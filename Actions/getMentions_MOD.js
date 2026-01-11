modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "Get User Mentions In List",
  },
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/QOLs",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Users",
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
    return `Get Mentions Of ${constants.variable(values.membersList)}`
  },

  async run(values, message, client, bridge) {
    let memList = bridge.get(values.membersList)

    let idRegex = /^[0-9]+$/
    memList = memList.map((member) => {
      if (idRegex.test(member) == true) {
        return `<@${member}>`
      } else if (member?.id) {
        return `<@${member.id}>`
      }
    })

    let styleType = bridge.transf(values.style.type)
    let delimiter = bridge.transf(values.style.value)
    let mentionList
    if (styleType == "text") {
      mentionList = memList.join(delimiter)
    } else {
      mentionList = memList
    }

    bridge.store(values.result, mentionList)
  },
}
