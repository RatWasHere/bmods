modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Sort Data",
  },
  aliases: ["Sort JSON Data"],
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
      storeAs: "inputJSON",
      name: "Data",
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
      name: "Store Sorted Data As",
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

    let inputJSON = bridge.get(values.inputJSON)
    if (isJSON(inputJSON) == false) {
      return `Input Data Is Not Valid JSON`
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

    let entries = Object.entries(inputJSON)
    entries.sort((a, b) => {
      let idA = a[0]
      let idB = b[0]

      let elA = a[1]
      let elB = b[1]

      let valA = elA
      let valB = elB

      if (values.attribute) {
        for (let part of attributePathParts) {
          valA = valA && typeof valA === "object" ? valA[part] : undefined
          valB = valB && typeof valB === "object" ? valB[part] : undefined
        }
      }

      if (valA === undefined) {
        valA = bridge.transf(values.defaultValue)
      }
      if (valB === undefined) {
        valB = bridge.transf(values.defaultValue)
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

    let sortedData = Object.fromEntries(entries)
    bridge.store(values.sorted, sortedData)
  },
}
