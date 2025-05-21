modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Get All Mentioned In Message"
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
      storeAs: "users",
      name: "Store Mentioned Users As"
    },
    {
      element: "store",
      storeAs: "roles",
      name: "Store Mentioned Roles As"
    },
    {
      element: "store",
      storeAs: "channels",
      name: "Store Mentioned Channels As"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Get All User Mentions In ${constants.message(values.message)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    let msg = await bridge.getMessage(values.message)
    let userMentions = msg.mentions.users
    let roleMentions = msg.mentions.roles
    let channelMentions = msg.mentions.channels

    let fullUserMentions
    let fullRoleMentions
    let fullChannelMentions

    if(values.users){
      fullUserMentions = await Promise.all(userMentions.map(async user => {
        user.member = await bridge.guild.members.get(user.id)
        return user
      }))
    }
    
    if(values.roles){
      fullRoleMentions = roleMentions.map(role =>{
        return bridge.guild.roles.get(role)
      })
    }

    if(values.channel){
      fullChannelMentions = channelMentions.map(channel =>{
        return client.getChannel(channel)
      })
    }

    bridge.store(values.users, fullUserMentions)
    bridge.store(values.roles, fullRoleMentions)
    bridge.store(values.channel, fullChannelMentions)
  }
}