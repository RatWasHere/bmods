modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "QuickDB Insert Document",
  },
  aliases: ["Insert QuickDB Document"],
  modules: ["quick.db", "node:path"],
  category: "QuickDB",
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    // {
    //   element: "variable",
    //   storeAs: "NeClient",
    //   name: "QuickDB Connection",
    // },
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
    return `Insert ${countIndicator} Document${values.insert.type == "single" ? "" : "s"} Into QuickDB [${values.database}:${values.collection}]`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const { QuickDB, JSONDriver } = require("quick.db")
    const fs = require("node:fs")
    const path = require("node:path")

    let sanitisePath = (str) => {
      return str
        .replace(/ /g, "_")
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/[\x00-\x1f\x80-\x9f]/g, "")
        .replace(/^\.+/, "")
        .trim()
    }

    let database = sanitisePath(bridge.transf(values.database))
    let collectionName = sanitisePath(bridge.transf(values.collection))

    if (!database || !collectionName) {
      console.log(`[${this.data.name}] A Database And Collection Is Needed!`)
      return
    }

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (
      workingDir.includes(path.join("common", "Bot Maker For Discord")) ||
      workingDir.endsWith("Bot Maker For Discord") ||
      fs.existsSync(path.join(workingDir, "AppData", "Kits", "EditorBones.js")) ||
      fs.existsSync(path.join(workingDir, "linux-data")) ||
      fs.existsSync(path.join(workingDir, "mac-data")) ||
      (fs.existsSync(path.join(workingDir, "stage1")) &&
        fs.existsSync(path.join(workingDir, "stage2")) &&
        fs.existsSync(path.join(workingDir, "stage3")) &&
        fs.existsSync(path.join(workingDir, "stage4")) &&
        fs.existsSync(path.join(workingDir, "stage5")))
    ) {
      projectFolder = botData.prjSrc
    } else {
      projectFolder = workingDir
    }

    function deepGet(obj, path) {
      return path.split(".").reduce((curr, key) => curr?.[key], obj)
    }

    let dbDir = path.join(projectFolder, "QuickDB", database)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    const jsonDriver = new JSONDriver(path.join(projectFolder, "QuickDB", database, `${collectionName}.quickdb`))
    let db = new QuickDB({ driver: jsonDriver })

    let result
    switch (values.insert.type) {
      case "single": {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
        let attributes = {}
        if (values.attributes.length == 0) {
          return console.log(`[${this.data.name}] To Insert A Document In QuickDB, At Least 1 Attribute Must Be Given`)
        }
        for (let attribute of values.attributes) {
          let attributeData = attribute.data
          let attributeKey = bridge.transf(attributeData.attributeKey)
          let attributeValue =
            attributeData.attributeValue.type == "string" ? bridge.transf(attributeData.attributeValue.value) : bridge.get(attributeData.attributeValue)
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
        await db.set(`documents.${id}`, attributes)
        result = { _id: id, ...attributes }
        break
      }
      case "multi": {
        result = []
        let documents = []
        if (values.documents.length == 0) {
          return console.log(`[${this.data.name}] To Insert A Document In QuickDB, At Least 1 Document Must Be Given`)
        }
        for (let document of values.documents) {
          let documentData = document.data
          let attributes = {}
          if (documentData.attributes.length == 0) {
            return console.log(`[${this.data.name}] To Insert A Document In QuickDB, At Least 1 Attribute Must Be Given`)
          }
          for (let attribute of documentData.attributes) {
            let attributeData = attribute.data
            let attributeKey = bridge.transf(attributeData.attributeKey)
            let attributeValue =
              attributeData.attributeValue.type == "string" ? bridge.transf(attributeData.attributeValue.value) : bridge.get(attributeData.attributeValue)
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

        for (const doc of documents) {
          const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
          await db.set(`documents.${id}`, doc)
          result.push({ _id: id, ...doc })
        }
        break
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
