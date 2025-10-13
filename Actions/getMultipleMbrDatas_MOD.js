modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Multiple Member Datas",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Member Data",
  UI: [
    {
      element: "menu",
      storeAs: "retrieveList",
      name: "List of Member Datas",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes:{
        data: {
          data: {},
          name: "Data Name:",
          preview: "`${option.data.dataName}`",
          UI: [
            {
              element: "user",
              storeAs: "member",
              name: "Member",
            },
            {
              element: "input",
              storeAs: "dataName",
              name: "Data Name",
            },
            "-",
            {
              element: "input",
              storeAs: "defaultValue",
              name: "Default Value",
            },
            {
              element: "store",
              storeAs: "store",
              name: "Store Value As"
            }
          ],
        },
      },
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values, constants) => {
    return `Get ${values.retrieveList.length} Member Datas.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let dataType = "members"

    for (let retrieve of values.retrieveList) {
      let retrieveData = retrieve.data
      let retrieveObject = await bridge.getUser(retrieveData.member)
      let id = `${retrieveObject.member.guild.id}${retrieveObject.id}`

      let defaultVal = bridge.transf(retrieveData.defaultValue) || ""
      let currentData = defaultVal
      let dataName = bridge.transf(retrieveData.dataName)

      if (storedData[dataType][id][dataName]){
        currentData = storedData[dataType][id][dataName]
      }

      bridge.store(retrieveData.store, currentData)
    }
  }
}