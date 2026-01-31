modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "MongoDB Update Document",
  },
  aliases: ["Update MongoDB Document"],
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
      storeAs: "update",
      name: "Update How Many Items",
      choices: {
        single: { name: "Single", field: false },
        multi: { name: "Multiple", field: false },
      },
    },
    "_",
    {
      element: "menu",
      storeAs: "attributes",
      name: "List Of Attribute Filters",
      types: { attribute: "attribute" },
      max: 1000,
      UItypes: {
        attribute: {
          data: {},
          name: "Attribute",
          preview:
            "`${option.data.attributeKey}: ${option.data.attributeValue.type}(${option.data.attributeValue.value ? option.data.attributeValue.value : option.data.attributeValue})`",
          UI: [
            {
              element: "input",
              storeAs: "attributeKey",
              name: "Attribute",
              placeholder: "dot.notation.supported",
            },
            {
              element: "typedDropdown",
              storeAs: "attributeValue",
              name: "Equals",
              choices: {
                text: { name: "Text", field: true },
                number: { name: "Number", field: true },
                boolean: { name: "Boolean (true / false)", field: true },
                regex: { name: "Regex", field: true },
                objectId: { name: "_id", field: true },
              },
            },
          ],
        },
      },
    },
    "-",
    {
      element: "menu",
      storeAs: "updates",
      name: "List Of Updates",
      types: { attribute: "attribute" },
      max: 1000,
      UItypes: {
        attribute: {
          data: {},
          name: "Attribute",
          preview:
            "`${option.data.attributeKey}: ${option.data.attributeValue.type}(${option.data.attributeValue.value ? option.data.attributeValue.value : option.data.attributeValue})`",
          UI: [
            {
              element: "input",
              storeAs: "attributeKey",
              name: "Attribute",
              placeholder: "dot.notation.supported",
            },
            "_",
            {
              element: "variable",
              storeAs: "attributeValue",
              name: "New Value",
              also: { string: "Text" },
            },
          ],
        },
      },
    },
    "_",
    {
      element: "toggle",
      storeAs: "upsert",
      name: "Upsert (Insert If Not Found)",
    },
    "_",
    {
      element: "toggle",
      storeAs: "returnDocument",
      name: "Return Updated Document",
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
      name: "Store Update Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Update Document${values.update.type == "single" ? "" : "s"} That Match ${values.attributes.length} Attributes In MongoDB [${values.database}:${
      values.collection
    }]`
  },

  script: (values) => {
    const indexByStoreAs = (values, storeAs) => {
      if (typeof storeAs != "string") {
        return console.log("Not String")
      }
      let index = values.UI.findIndex((element) => element.storeAs == storeAs)
      console.log(index)
      if (index == -1) {
        return console.log("Index Not Found")
      }
      return index
    }

    function reflem(skipAnimation) {
      let insertType = values.data.update.type
      switch (insertType) {
        case "single": {
          values.UI[indexByStoreAs(values, "returnDocument")].element = "toggle"
          break
        }

        case "multi": {
          values.UI[indexByStoreAs(values, "returnDocument")].element = ""
          break
        }
      }

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100,
      )
    }

    reflem(true)
    values.events.on("change", () => {
      reflem()
    })
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
    if (values.attributes.length == 0 || values.updates.length == 0) {
      return console.log(`[${this.data.name}] To Update A Document In MongoDB, Both Query & Updates Is Needed`)
    }
    for (let attribute of values.attributes) {
      let attributeData = attribute.data
      let attributeKey = bridge.transf(attributeData.attributeKey)
      let attributeValue = bridge.transf(attributeData.attributeValue.value)
      let attributeValueType = bridge.transf(attributeData.attributeValue.type)
      switch (attributeValueType) {
        case "text": {
          break
        }

        case "number": {
          if (!isNaN(Number(attributeValue))) {
            attributeValue = Number(attributeValue)
          } else {
            console.log(`[${this.data.name}] ${attributeValue} Is Not A Number`)
          }
          break
        }

        case "boolean": {
          if (typeof attributeValue === "boolean") {
          } else if (/^(true|false)$/i.test(attributeValue)) {
            attributeValue = attributeValue.toLowerCase() === "true"
          } else {
            console.log(`[${this.data.name}] ${attributeValue} Is Not A Boolean`)
          }
          break
        }

        case "regex": {
          try {
            attributeValue = new RegExp(attributeValue, "i")
          } catch (err) {
            console.log(`[${this.data.name}] Invalid Regex: ${err.message}`)
            attributeValue = bridge.transf(attributeData.attributeValue.value)
          }
          break
        }

        case "objectId": {
          try {
            attributeValue = new mongodb.ObjectId(attributeValue)
          } catch (err) {
            console.log(`[${this.data.name}] ${attributeValue}; ${err.message}`)
            attributeValue = bridge.transf(attributeData.attributeValue.value)
          }
          break
        }
      }

      attributes[attributeKey] = attributeValue
    }
    let $set = {}
    for (let update of values.updates) {
      let updateData = update.data
      let updateKey = bridge.transf(updateData.attributeKey)
      let updateValue = updateData.attributeValue.type == "string" ? bridge.transf(updateData.attributeValue.value) : bridge.get(updateData.attributeValue)
      $set[updateKey] = updateValue
    }

    let upsert = values.upsert
    switch (values.update.type) {
      case "single": {
        if (values.returnDocument == true) {
          result = await collection.findOneAndUpdate(attributes, { $set }, { upsert, returnDocument: "after" })
        } else {
          result = await collection.updateOne(attributes, { $set }, { upsert })
        }
        break
      }

      case "multi": {
        result = await collection.updateMany(attributes, { $set }, { upsert })
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
