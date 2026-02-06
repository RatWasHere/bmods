modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Sort Data Array",
  },
  aliases: ["Sort JSON Array"],
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
      storeAs: "dataArray",
      name: "JSON Data Array",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "sortType",
      name: "Sort Type",
      choices: {
        increase: { name: "Increasing Numerically", field: false },
        decrease: { name: "Decreasing Numerically", field: false },
      },
    },
    "-",
    {
      element: "input",
      storeAs: "attribute",
      name: "Attribute",
      placeholder: "path.to.sub.attribute",
    },
    {
      element: "input",
      storeAs: "defaultValue",
      name: "Default Value",
    },
    "-",
    {
      element: "input",
      storeAs: "limit",
      name: "Only Keep Top #",
      placeholder: "Leave Empty To Store Entire Sorted Data",
    },
    {
      element: "store",
      storeAs: "sorted",
      name: "Store Sorted Data Array As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Sort Data: ${constants.variable(values.inputJSON)}`
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

    let limit = parseInt(bridge.transf(values.limit))
    let attributePath
    if (values.attribute) {
      attributePath = bridge
        .transf(values.attribute)
        .replace(/\.{2,}/g, ".")
        .replace(/^\./, "")
    }
    let attributePathParts = attributePath.split(".")
    let sortType = bridge.transf(values.sortType.type)
    let defaultValue = bridge.transf(values.defaultValue)

    let entries = bridge.get(values.dataArray)
    if (!entries || !Array.isArray(entries)) {
      return console.log(`[${this.data.name}] Input Is Not An Array`)
    }

    if (!entries.every(isJSON)) {
      return console.log(`[${this.data.name}] One Or More Of The Elements Is Not A JSON Object`)
    }

    entries.sort((a, b) => {
      let valA = a
      let valB = b

      if (values.attribute) {
        for (let part of attributePathParts) {
          valA = valA && typeof valA === "object" ? valA[part] : undefined
          valB = valB && typeof valB === "object" ? valB[part] : undefined
        }
      }

      if (valA === undefined) {
        valA = defaultValue
      }
      if (valB === undefined) {
        valB = defaultValue
      }

      switch (sortType) {
        case "decrease": {
          return valB - valA
        }

        case "increase": {
          return valA - valB
        }
      }
    })

    if (!isNaN(limit)) {
      entries = entries.slice(0, limit)
    }

    // let sortedData = Object.fromEntries(entries)
    bridge.store(values.sorted, entries)
  },
}
