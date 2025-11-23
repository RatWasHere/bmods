modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Message Webhook",
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
      name: "Message",
      storeAs: "message",
    },
    {
      element: "store",
      name: "Store Webhook ID As",
      storeAs: "webhookId",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Get Webhook ID Of ${constants.message(values.message)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    /**
     * @type {Message}
     */
    let msg = await bridge.getMessage(values.message)

    if (msg.webhookID ? true : false == true) {
      bridge.store(values.webhookId, msg.webhookID)
    } else {
      console.warn(`${msg} has no webhook property`)
      bridge.store(values.webhookId, undefined)
    }
  },
}
