modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Get User Mentions In List",
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
      storeAs: "membersList",
      name: "Initial member or user List",
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
    return `Get Mentions Of ${constants.variable(values.membersList)}`
  },

  async run(values, message, client, bridge){
    let memList = bridge.get(values.membersList)

    memList = memList.map(member =>{
      return `<@${member.id}>`
    })

    let styleType = bridge.transf(values.style.type)
    let delimiter = bridge.transf(values.style.value)
    let mentionList
    if (styleType == "text"){
      mentionList = memList.join(delimiter)
    } else {mentionList = memList}

    bridge.store(values.result, mentionList)
  }
}

