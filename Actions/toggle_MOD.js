modVersion = "v2.0.0"
module.exports = {
  data: {
    name: "Toggle Actions"
  },
  aliases: [],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Control",
  modules: [],
  UI: [
    {
      element: "toggle",
      storeAs: "toggle",
      name: "Run Actions",
      true: "Run",
      false: "Don't Run"
    },
    {
      element: "actions",
      storeAs: "actions",
      name: "Run Actions",
      large: false
    },
    {
      element: "largeInput",
      storeAs: "comment",
      name: "Comments",
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values, constants) =>{
    return `${values.toggle}: ${values.comment}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    if (values.toggle == true){
      let promise = new Promise(async res => {
        await bridge.runner(values.actions)
        res()
      })
      promise.catch(err => console.log(err))
      await promise
    } else {
      // noop
    }
  }
}