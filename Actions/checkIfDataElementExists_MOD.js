modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Check If Data Element Exists",
  },
  aliases: [],
  modules: [],
  category: "Data",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputData",
      name: "Data",
    },
    "_",
    {
      element: "input",
      storeAs: "elementPath",
      name: "Element Path",
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If Exists",
    },
    "_",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "Else",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Check If ${values.elementPath} Exist In ${values.inputData.type}(${values.inputData.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let inputData = bridge.get(values.inputData)
    function isJSON(testObject) {
      return testObject != undefined && typeof testObject === "object" && testObject.constructor === Object
    }

    if (isJSON(inputData) !== true) {
      return console.error(`[${this.data.name}] ${values.inputData.type}(${values.inputData.value}) Is Not Valid JSON.`)
    }

    let elementPath = bridge.transf(values.elementPath).trim()

    elementPath = elementPath.replace(/\.{2,}/g, ".")
    if (elementPath.startsWith(".")) {
      elementPath = elementPath.slice(1)
    }

    if (elementPath === "" || elementPath.includes("..") || elementPath.startsWith(".") || elementPath.endsWith(".")) {
      return console.error(`[${this.data.name}] Invalid Path: "${bridge.transf(values.elementPath)}"`)
    }

    let keys = elementPath.split(".")

    let exists = true
    for (let key of keys) {
      if (inputData && Object.prototype.hasOwnProperty.call(inputData, key)) {
        inputData = inputData[key]
      } else {
        inputData = undefined
        exists = false
      }
    }

    if (exists == true) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
}
