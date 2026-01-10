modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "MongoDB Delete Document",
    allowNuke: false,
  },
  aliases: ["Delete MongoDB Document"],
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
      storeAs: "delete",
      name: "Delete How Many Items",
      choices: {
        single: { name: "Single", field: false },
        multi: { name: "Multiple", field: false },
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
    },
    "_",
    {
      element: "toggle",
      storeAs: "allowNuke",
      name: "Allow Delete All",
      help: {
        title: "Allow Delete All",
        UI: [
          {
            element: "text",
            text: "Allowing Delete All Would Essentially Allow You To Delete An Entire Collection If There Are No Attributes Given.<br>This Is Extremely Dangerous And Should Be Toggled Off To Prevent Database Nuking.",
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
      name: "Store Delete Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Delete Document${values.delete.type == "single" ? "" : "s"} That Match ${values.attributes.length} Attributes In MongoDB [${values.database}:${
      values.collection
    }]`
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

    let result

    let attributes = {}
    if (values.attributes.length == 0 && values.allowNuke == false) {
      console.log(`[${this.data.name}] To Delete A Document In MongoDB, A Query Is Needed`)
      console.log(`[${this.data.name}] If You're Trying To Delete Documents Without Attribute Querying, Please Toggle On "Allow Delete All"`)
      return
    }
    for (let attribute of values.attributes) {
      let attributeData = attribute.data
      let attributeKey = bridge.transf(attributeData.attributeKey)
      let attributeValue = bridge.transf(attributeData.attributeValue)
      if (attributeKey === "_id") {
        attributeValue = new mongodb.ObjectId(attributeValue)
      }
      attributes[attributeKey] = attributeValue
    }

    switch (values.delete.type) {
      case "single": {
        result = await collection.deleteOne(attributes)
        break
      }

      case "multi": {
        result = await collection.deleteMany(attributes)
        break
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
