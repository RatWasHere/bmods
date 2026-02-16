modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Find List Element By Attribute",
  },
  aliases: [],
  modules: [],
  category: "Lists",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputList",
      name: "List",
    },
    "-",
    {
      element: "input",
      storeAs: "attributeKey",
      name: "Attribute",
    },
    {
      element: "input",
      storeAs: "attributeValue",
      name: "Must Equal",
    },
    "-",
    {
      element: "store",
      storeAs: "foundElement",
      name: "Store List Element As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Find List Element Where Attribute [${values.attributeKey}] Equals ${values.attributeValue}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    function isJSON(testObject) {
      return testObject != undefined && typeof testObject === "object" && testObject.constructor === Object
    }

    let inputList = bridge.get(values.inputList)
    if (!Array.isArray(inputList)) {
      return console.log(`[${this.data.name}] Input Is Not A List`)
    }
    if (!inputList.every(isJSON)) {
      return console.log(`[${this.data.name}] Not All Elements In The List Is A JSON Object`)
    }

    let attributeKey = bridge.transf(values.attributeKey).trim()
    attributeKey = attributeKey.replaceAll(/\.{2,}/g, ".")
    if (attributeKey.startsWith(".")) {
      attributeKey = attributeKey.slice(1)
    }

    let attributeValue = bridge.transf(values.attributeValue).trim()

    let attributeParts = attributeKey.split(".").filter(Boolean)
    let foundElement = inputList.find((element) => {
      let target = element
      for (let attributePart of attributeParts) {
        if (target !== null && typeof target === "object" && Object.prototype.hasOwnProperty.call(target, attributePart)) {
          target = target[attributePart]
        } else {
          target = undefined
          break
        }
      }
      return String(target) == attributeValue
    })
    bridge.store(values.foundElement, foundElement ?? undefined)
  },
}
