modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get All Mentioned Roles In Message",
  },
  aliases: [],
  modules: [],
  category: "Messages",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Message",
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Get All Role Mentions In ${constants.message(values.message)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    let msg = await bridge.getMessage(values.message)
    let roleMentions = msg.mentions.roles
    let fullRoleMentions = roleMentions.map((role) => {
      return bridge.guild.roles.get(role)
    })

    bridge.store(values.store, fullRoleMentions)
  },
}
