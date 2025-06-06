modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Channel Mentions In List",
  },
  info: {
  source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
  creator: "Acedia QOLs",
  donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Shortcuts",
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
      choices:{
        list: {name: "List", field: false},
        text: {name: "Text", field: true, placeholder: "Delimiter"},
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
    }
  ],

  subtitle: (values, constants) => {
    return `Get Mentions Of ${constants.variable(values.channelsList)}`
  },

  async run(values, message, client, bridge){
    let channelList = bridge.get(values.channelsList)

    let filteredList = []

    channelList = channelList.forEach(channel =>{
      if (channel.type != 4){
        filteredList.push(`<#${channel.id}>`)
      }
    })

    let styleType = bridge.transf(values.style.type)
    let delimiter = bridge.transf(values.style.value)
    let mentionList
    if (styleType == "text"){
      mentionList = filteredList.join(delimiter)
    } else {mentionList = filteredList}

    bridge.store(values.result, mentionList)
  }
}

