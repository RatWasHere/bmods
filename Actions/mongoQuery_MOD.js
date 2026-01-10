modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "MongoDB Query Collection",
  },
  aliases: ["Query MongoDB"],
  modules: ["mongodb"],
  category: "MongoDB",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "mongoClient",
      name: "MongoDB Connection",
    },
    {
      element: "inputGroup",
      storeAs: ["database", "collection"],
      nameSchemes: ["Database", "Collection"],
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "find",
      name: "Find How Many Items",
      choices: {
        single: { name: "Single (JSON)", field: false },
        multi: { name: "Multiple (JSON Array)", field: false },
      },
    },
    "_",
    {
      element: "menu",
      storeAs: "attributes",
      name: "List Of Attributes",
      types: { attribute: "attribute" },
      max: 1000,
      UItypes: {
        attribute: {
          data: {},
          name: "Attribute",
          preview: "`${option.data.attributeKey}: ${option.data.attributeValue}`",
          UI: [
            {
              element: "input",
              storeAs: "attributeKey",
              name: "Attribute",
              placeholder: "dot.notation.supported",
            },
            {
              element: "input",
              storeAs: "attributeValue",
              name: "Equals",
            },
          ],
        },
      },
      help: {
        title: "Attributes",
        UI: [
          {
            element: "text",
            text: `You Can Input 0 Attributes And It'll Filter Nothing`,
          },
          "_",
          {
            element: "text",
            text: `Select "Single" And It'll Return The Lastest Entry`,
          },
          {
            element: "text",
            text: `Select "Multiple" And It'll Return The Entire Collection`,
          },
        ],
      },
    },
    "-",
    {
      element: "toggle",
      storeAs: "stringify",
      name: "Stringify Result",
    },
    "_",
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Find MongoDB [${values.database}:${values.collection}] Document${values.find.type == "single" ? "" : "s"} That Matches ${
      values.attributes.length
    } Attributes`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const mongodb = require("mongodb")
    const mongoClient = bridge.get(values.mongoClient)
    let databaseName = null
    let collectionName = bridge.transf(values.collection).trim()
    if (!collectionName || !mongoClient) {
      return console.log(`[${this.data.name}] A MongoDB Connection & A Collection Is Needed`)
    }
    if (values.database) {
      databaseName = bridge.transf(values.database).trim()
    }
    let database = mongoClient.db(databaseName)
    let collection = database.collection(collectionName)

    let attributes = {}

    for (let attribute of values.attributes) {
      let attributeData = attribute.data
      let attributeKey = bridge.transf(attributeData.attributeKey)
      let attributeValue = bridge.transf(attributeData.attributeValue)
      if (attributeKey === "_id") {
        attributeValue = new mongodb.ObjectId(attributeValue)
      }
      attributes[attributeKey] = attributeValue
    }

    let result
    switch (values.find.type) {
      case "single": {
        result = await collection.findOne(attributes)
        if (result == null) {
          result = undefined
        }
        break
      }

      case "multi": {
        result = await collection.find(attributes).toArray()
        if (result.length == 0) {
          result = undefined
        }
        break
      }
    }

    if (values.stringify == true && result != undefined) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
