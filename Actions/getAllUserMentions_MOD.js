modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get All Mentioned Users In Message",
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
    return `Get All User Mentions In ${constants.message(values.message)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    let msg = await bridge.getMessage(values.message)
    let userMentions = msg.mentions.users
    let fullUserMentions = await Promise.all(
      userMentions.map(async (user) => {
        user.member = await bridge.guild.members.get(user.id)
        return user
      })
    )

    bridge.store(values.store, fullUserMentions)
  },
}
