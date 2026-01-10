modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Deduplicate List",
  },
  aliases: ["Remove Duplicates In List"],
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
      storeAs: "list",
      name: "List",
    },
    "_",
    {
      element: "store",
      storeAs: "setList",
      name: "Store Deduplicated List As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Deduplicate List ${values.list.type}(${values.list.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let list = bridge.get(values.list)

    if (!Array.isArray(list)) {
      return console.log(`The List Provided Is Not A List!`)
    }

    let deduplicatedList = [...new Set(list)]
    bridge.store(values.setList, deduplicatedList)
  },
}
