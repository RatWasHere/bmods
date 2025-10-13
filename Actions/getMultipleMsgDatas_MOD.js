modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Multiple Message Datas",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Message Data",
  UI: [
    {
      element: "menu",
      storeAs: "retrieveList",
      name: "List of Message Datas",
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
              element: "message",
              storeAs: "message",
              name: "Message",
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
    return `Get ${values.retrieveList.length} Message Datas.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let dataType = "messages"

    for (let retrieve of values.retrieveList) {
      let retrieveData = retrieve.data
      let retrieveObject = await bridge.getMessage(retrieveData.channel)
      let id = retrieveObject.id

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