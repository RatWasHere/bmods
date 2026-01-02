modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Count Repeated List Elements",
  },
  aliases: [],
  modules: [],
  category: "Lists",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputList",
      name: "List",
    },
    "_",
    {
      element: "menu",
      storeAs: "listElements",
      name: "Look For Elements",
      types: {
        elements: "elements",
      },
      max: 1000,
      UItypes: {
        elements: {
          data: {},
          name: "Element",
          preview: "`${option.data.elementValue}, Case Sensitive: ${option.data.caseSens}`",
          UI: [
            {
              element: "input",
              storeAs: "elementValue",
              name: "Element Value (Filter For)",
              placeholder: "A",
            },
            {
              element: "toggle",
              storeAs: "caseSens",
              name: "Case Sensitive?",
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store Number Of Occurrences As",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    return `Count ${values.listElements.length} Element${values.listElements.length !== 1 ? "s" : ""} In List`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const inputList = bridge.get(values.inputList)
    if (!Array.isArray(inputList)) return

    for (const listElement of values.listElements) {
      const listElementData = listElement.data
      const elementValue = String(listElementData.elementValue)
      const caseSensitive = listElementData.caseSens

      const comparisonValue = caseSensitive ? elementValue : elementValue.toLowerCase()

      const filteredList = inputList.filter((e) => {
        const val = String(e)
        return (caseSensitive ? val : val.toLowerCase()) === comparisonValue
      })

      bridge.store(listElementData.store, filteredList.length)
    }
  },
}
