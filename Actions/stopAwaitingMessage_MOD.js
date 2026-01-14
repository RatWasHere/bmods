modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Stop Awaiting Message",
  },
  aliases: [],
  modules: [],
  category: "Messages",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "handler",
      name: "Await Handler",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Stop Awaiting ${values.handler.type}(${values.handler.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let handler = bridge.get(values.handler)
    client.off("messageCreate", handler)
  },
}
