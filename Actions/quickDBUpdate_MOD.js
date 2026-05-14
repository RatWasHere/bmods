modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "QuickDB Update Document",
  },
  aliases: ["Update QuickDB Document"],
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
    return `Update Document${values.update.type == "single" ? "" : "s"} That Match ${values.attributes.length} Attributes In QuickDB [${values.database}:${
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

    function deepSet(obj, path, value) {
      const parts = path.split(".")
      let current = obj
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = value
        } else {
          if (!current[part] || typeof current[part] !== "object") current[part] = {}
          current = current[part]
        }
      })
      return obj
    }

    let dbDir = path.join(projectFolder, "QuickDB", database)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    const jsonDriver = new JSONDriver(path.join(projectFolder, "QuickDB", database, `${collectionName}.quickdb`))
    let db = new QuickDB({ driver: jsonDriver })
    let collection = (await db.get("documents")) || {}

    let result

    let attributes = {}
    if (values.attributes.length == 0 || values.updates.length == 0) {
      return console.log(`[${this.data.name}] To Update A Document In QuickDB, Both Query & Updates Is Needed`)
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
        const entry = Object.entries(collection).find(([, doc]) => Object.entries(attributes).every(([key, value]) => deepGet(doc, key) === value))
        if (entry) {
          let [id, doc] = entry
          for (const [key, value] of Object.entries($set)) deepSet(doc, key, value)
          await db.set(`documents.${id}`, doc)
          result = values.returnDocument ? doc : { numAffected: 1, upsert: false }
        } else if (upsert) {
          const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
          const doc = { ...attributes, ...$set }
          await db.set(`documents.${id}`, doc)
          result = values.returnDocument ? doc : { numAffected: 1, upsert: true }
        } else {
          result = { numAffected: 0, upsert: false }
        }
        break
      }
      case "multi": {
        const matches = Object.entries(collection).filter(([, doc]) => Object.entries(attributes).every(([key, value]) => deepGet(doc, key) === value))
        for (const [id, doc] of matches) {
          for (const [key, value] of Object.entries($set)) deepSet(doc, key, value)
          await db.set(`documents.${id}`, doc)
        }
        result = { numAffected: matches.length, upsert: false }
        break
      }
    }

    if (values.stringify == true) {
      result = JSON.stringify(result)
    }
    bridge.store(values.result, result)
  },
}
