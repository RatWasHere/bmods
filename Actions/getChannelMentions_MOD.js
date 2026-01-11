modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "Get Channel Mentions In List",
  },
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/QOLs",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Channels",
  modules: [],
  UI: [
    {
      element: "var",
      storeAs: "channelsList",
      name: "Initial Channels List",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "style",
      name: "Output Style",
      choices: {
        list: { name: "List", field: false },
        text: { name: "Text", field: true, placeholder: "Delimiter" },
      },
    },
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As:",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `Get Mentions Of ${constants.variable(values.channelsList)}`
  },

  async run(values, message, client, bridge) {
    let channelList = bridge.get(values.channelsList)

    let filteredList = []
    let idRegex = /^[0-9]+$/

    channelList = channelList.forEach((channel) => {
      if (channel.type != 4) {
        if (idRegex.test(channel) == true) {
          filteredList.push(`<#${channel}>`)
        } else {
          filteredList.push(`<#${channel?.id}>`)
        }
      }
    })

    let styleType = bridge.transf(values.style.type)
    let delimiter = bridge.transf(values.style.value)
    let mentionList
    if (styleType == "text") {
      mentionList = filteredList.join(delimiter)
    } else {
      mentionList = filteredList
    }

    bridge.store(values.result, mentionList)
  },
}
