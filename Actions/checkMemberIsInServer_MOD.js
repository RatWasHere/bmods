modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Check If Member Is In Server",
  },
  aliases: [],
  modules: [],
  category: "Members",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "guild",
      storeAs: "guild",
      name: "Server",
    },
    {
      element: "member",
      storeAs: "member",
      name: "Member",
    },
    "-",
    {
      element: "condition",
      storeAs: "ifTrue",
      storeActionsAs: "ifTrueActions",
      name: "If Member Is In Server",
    },
    {
      element: "condition",
      storeAs: "ifFalse",
      storeActionsAs: "ifFalseActions",
      name: "If Member Is Not In Server",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Check If Member ${constants.user(values.member)} Is In ${constants.guild(values.guild)} Server`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let guild = await bridge.getGuild(values.guild)
    let member = await bridge.getUser(values.member)

    if (!guild || !member) {
      console.log(`[${this.data.name}] A Guild Or Member Doesn't Exist`)
      await bridge.call(values.ifFalse, values.ifFalseActions)
      return
    }

    let guildMember = guild.members.has(member.id)

    if (guildMember) {
      await bridge.call(values.ifTrue, values.ifTrueActions)
      return
    } else {
      try {
        await guild.getMember(member.id)
        await bridge.call(values.ifTrue, values.ifTrueActions)
      } catch {
        await bridge.call(values.ifFalse, values.ifFalseActions)
      }
    }
  },
}
