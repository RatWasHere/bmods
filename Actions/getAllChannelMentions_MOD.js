modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Get All Mentioned Channels In Message"
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
      name: "Store As"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Get All Channel Mentions In ${constants.message(values.message)}`
  },
  
  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    let msg = await bridge.getMessage(values.message)
    let channelMentions = msg.mentions.channels
    let fullChannelMentions = channelMentions.map(channel =>{
      return client.getChannel(channel)
    })

    bridge.store(values.store, fullChannelMentions)
  }
}