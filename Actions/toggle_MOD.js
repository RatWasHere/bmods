module.exports = {
  data: {
    name: "Toggle"
  },
  aliases: [],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Control",
  modules: [],
  UI: [
    {
      element: "toggle",
      storeAs: "toggle",
      name: "Set Value",
      true: "True",
      false: "False"
    },
    {
      element: "store",
      storeAs: "store",
      name: "Store As",
    },
    {
      element: "largeInput",
      storeAs: "comment",
      name: "Comments",
    }
  ],

  subtitle: (values, constants) =>{
    return `Set ${constants.variable(values.store)} to ${values.toggle}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    bridge.store(values.store, values.toggle)
  }
}