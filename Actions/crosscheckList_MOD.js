modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Cross-check List",
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
      storeAs: "list1",
      name: "List 1",
    },
    "_",
    {
      element: "variable",
      storeAs: "list2",
      name: "List 2",
    },
    "-",
    {
      element: "store",
      storeAs: "matches",
      name: "Store Matches As",
    },
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If List 1 Contains Elements From List 2",
    },
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
    return `Cross-check ${values.list1.type}(${values.list1.value}) For Elements In ${values.list2.type}(${values.list2.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let list1 = bridge.get(values.list1)
    let list2 = bridge.get(values.list2)

    if (!Array.isArray(list1) || !Array.isArray(list2)) {
      return console.log(`[${this.data.name}] One Or Both Lists Provided Is Not A List!`)
    }

    let set2 = new Set(list2)
    let matches = [...new Set(list1.filter((element) => set2.has(element)))]
    bridge.store(values.matches, matches)
    if (matches.length > 0) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
}
