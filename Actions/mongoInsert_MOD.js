modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "MongoDB Insert Document",
  },
  aliases: ["Insert MongoDB Document"],
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
      storeAs: "insert",
      name: "Insert How Many Items",
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
              name: "Equals",
              also: { string: "Text" },
            },
          ],
        },
      },
    },
    {
      element: "menu",
      storeAs: "documents",
      name: "List Of Documents",
      types: { attribute: "attribute" },
      max: 1000,
      UItypes: {
        attribute: {
          data: {},
          name: "Document",
          preview: "`${option.data.attributes.length} Attributes`",
          UI: [
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
                      name: "Equals",
                      also: { string: "Text" },
                    },
                  ],
                },
              },
            },
          ],
        },
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
      name: "Store Insert Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

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
      let insertType = values.data.insert.type
      switch (insertType) {
        case "single": {
          values.UI[indexByStoreAs(values, "attributes")].element = "menu"
          values.UI[indexByStoreAs(values, "documents")].element = ""
          break
        }

        case "multi": {
          values.UI[indexByStoreAs(values, "attributes")].element = ""
          values.UI[indexByStoreAs(values, "documents")].element = "menu"
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

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let countIndicator = values.insert.type == "single" ? "1" : values.documents.length
    return `Insert ${countIndicator} Document${values.insert.type == "single" ? "" : "s"} Into MongoDB [${values.database}:${values.collection}]`
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
    switch (values.insert.type) {
      case "single": {
        let attributes = {}
        if (values.attributes.length == 0) {
          return console.log(`[${this.data.name}] To Insert A Document In MongoDB, At Least 1 Attribute Must Be Given`)
        }
        for (let attribute of values.attributes) {
          let attributeData = attribute.data
          let attributeKey = bridge.transf(attributeData.attributeKey)
          let attributeValue =
            attributeData.attributeValue.type == "string" ? bridge.transf(attributeData.attributeValue.value) : bridge.get(attributeData.attributeValue)
          if (attributeKey == "_id") {
            attributeValue = new mongodb.ObjectId(attributeValue)
          }
          let parts = attributeKey.split(".").filter(Boolean)

          let current = attributes
          parts.forEach((part, index) => {
            if (index === parts.length - 1) {
              current[part] = attributeValue
            } else {
              if (!current[part] || typeof current[part] !== "object") {
                current[part] = {}
              }
              current = current[part]
            }
          })
        }

        result = await collection.insertOne(attributes)
        break
      }

      case "multi": {
        let documents = []
        if (values.documents.length == 0) {
          return console.log(`[${this.data.name}] To Insert A Document In MongoDB, At Least 1 Document Must Be Given`)
        }
        for (let document of values.documents) {
          let documentData = document.data
          let attributes = {}
          if (documentData.attributes.length == 0) {
            return console.log(`[${this.data.name}] To Insert A Document In MongoDB, At Least 1 Attribute Must Be Given`)
          }
          for (let attribute of documentData.attributes) {
            let attributeData = attribute.data
            let attributeKey = bridge.transf(attributeData.attributeKey)
            let attributeValue =
              attributeData.attributeValue.type == "string" ? bridge.transf(attributeData.attributeValue.value) : bridge.get(attributeData.attributeValue)
            if (attributeKey == "_id") {
              attributeValue = new mongodb.ObjectId(attributeValue)
            }
            let parts = attributeKey.split(".").filter(Boolean)

            let current = attributes
            parts.forEach((part, index) => {
              if (index === parts.length - 1) {
                current[part] = attributeValue
              } else {
                if (!current[part] || typeof current[part] !== "object") {
                  current[part] = {}
                }
                current = current[part]
              }
            })
          }
          documents.push(attributes)
        }
        result = await collection.insertMany(documents)
        break
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
