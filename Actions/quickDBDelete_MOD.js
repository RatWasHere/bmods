modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "QuickDB Delete Document",
    allowNuke: false,
  },
  aliases: ["Delete QuickDB Document"],
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
              },
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
    return `Delete Document${values.delete.type == "single" ? "" : "s"} That Match ${values.attributes.length} Attributes In QuickDB [${values.database}:${
      values.collection
    }]`
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
    let collection = (await db.get("documents")) || {}

    let attributes = {}
    if (values.attributes.length == 0 && values.allowNuke == false) {
      console.log(`[${this.data.name}] To Delete A Document In QuickDB, A Query Is Needed`)
      console.log(`[${this.data.name}] If You're Trying To Delete Documents Without Attribute Querying, Please Toggle On "Allow Delete All"`)
      return
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
      }

      attributes[attributeKey] = attributeValue
    }

    let result
    switch (values.delete.type) {
      case "single": {
        const entry = Object.entries(collection).find(([, doc]) => Object.entries(attributes).every(([key, value]) => deepGet(doc, key) === value))
        if (entry) {
          await db.delete(`documents.${entry[0]}`)
          result = 1
        } else {
          result = 0
        }
        break
      }
      case "multi": {
        const matches = Object.entries(collection).filter(([, doc]) => Object.entries(attributes).every(([key, value]) => deepGet(doc, key) === value))
        for (const [id] of matches) {
          await db.delete(`documents.${id}`)
        }
        result = matches.length
        break
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
