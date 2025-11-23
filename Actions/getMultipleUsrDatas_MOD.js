modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Multiple User Datas",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "User Data",
  UI: [
    {
      element: "menu",
      storeAs: "retrieveList",
      name: "List of User Datas",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes: {
        data: {
          data: {},
          name: "Data Name:",
          preview: "`${option.data.dataName}`",
          UI: [
            {
              element: "user",
              storeAs: "user",
              name: "User",
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
              name: "Store Value As",
            },
          ],
        },
      },
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `Get ${values.retrieveList.length} User Datas.`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get()
    let dataType = "users"

    for (let retrieve of values.retrieveList) {
      let retrieveData = retrieve.data
      let retrieveObject = await bridge.getUser(retrieveData.user)
      let id = retrieveObject.id

      let defaultVal = bridge.transf(retrieveData.defaultValue) || ""
      let currentData = defaultVal
      let dataName = bridge.transf(retrieveData.dataName)

      if (storedData[dataType][id][dataName]) {
        currentData = storedData[dataType][id][dataName]
      }

      bridge.store(retrieveData.store, currentData)
    }
  },
}
