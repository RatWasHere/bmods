module.exports = {
  category: "Messages",
  data: {
    name: "Modified Await Message",
    stopAwaitingAfter: 60,
  },

  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      name: "Await In Channel",
    },
    "_",
    {
      element: "userInput",
      storeAs: "user",
      name: "From User",
      also: {
        any: "Any",
      },
      and: {
        any: false,
      },
    },
    "-",
    {
      element: "input",
      storeAs: "stopAwaitingAfter",
      name: "Stop Awaiting After (Seconds)",
      placeholder: "Min: 1",
    },
    "_",
    {
      element: "toggle",
      storeAs: "oneTime",
      name: "One-Time Only",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "messageStorage",
      name: "Store Message As",
    },
    "_",
    {
      element: "storageInput",
      storeAs: "authorStorage",
      name: "Store Message Author As",
    },
    "_",
    {
      name: "Once Sent, Run",
      element: "actions",
      storeAs: "actions",
    },
    "-",
    {
      element: "store",
      storeAs: "handler",
      name: "Store Await Handler As",
    },
    "_",
    {
      element: "menu",
      max: 1,
      name: "Timeout",
      storeAs: "timeout",
      types: {
        timeout: "Timeout",
      },
      UItypes: {
        timeout: {
          name: "Timeout",
          inheritData: true,
          data: {},
          preview: "`${option.data.timeoutActions?.length || 0} Actions`",
          height: 330,
          UI: [
            {
              element: "actions",
              storeAs: "timeoutActions",
              name: "Timeout Actions",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `In Channel: ${constants.channel(values.channel)} - Stop Awaiting After: ${values.stopAwaitingAfter}s`
  },

  async run(values, message, client, bridge) {
    let ran = false
    let actions = bridge.runner

    let channel = await bridge.getChannel(values.channel)

    const handleMessage = async (msg) => {
      let matchesTarget = false
      let matchesChannel = channel.id == msg.channel.id

      if (values.user.type == "any") {
        matchesTarget = true
      } else {
        let user = await bridge.getUser(values.user)
        matchesTarget = user.id == msg.author.id
      }

      if (matchesTarget && matchesChannel && (values.oneTime ? !ran : true)) {
        ran = true
        msg.author.member = msg.member
        bridge.store(values.authorStorage, msg.author)
        bridge.store(values.messageStorage, msg)

        actions(values.actions)
      }
    }

    bridge.store(values.handler, handleMessage)
    client.on("messageCreate", handleMessage)

    if (values.stopAwaitingAfter) {
      setTimeout(() => {
        client.off("messageCreate", handleMessage)
        if (!ran && values.timeout[0] && values.timeoutActions) {
          actions(values.timeoutActions)
        }
      }, parseFloat(values.stopAwaitingAfter) * 1000)
    }
  },
}
