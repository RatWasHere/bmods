module.exports = {
  data: {
    name: "String Limiter",
  },
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Text",
  modules: [],
  UI: [
    {
      element: "input",
      storeAs: "srcTxt",
      name: "Original Text",
    },
    {
      element: "input",
      storeAs: "maxLength",
      name: "Limit at character",
    },
    {
      element: "input",
      storeAs: "append",
      name: "Append with",
      placeholder: "Will only be appended if length exceeds limit"
    },
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As"
    }
  ],

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    const sourceText = bridge.transf(values.srcTxt)
    const maxLength = Number(bridge.transf(values.maxLength))
    const appendWith = bridge.transf(values.append)

    let result

    if (Number.isInteger(maxLength)){
      if (sourceText.length > maxLength){
        result = sourceText.slice(0, maxLength) + appendWith
      }
      else if (sourceText.length < maxLength){
        result = sourceText
      }
    }
    else {
      result = `Error: ${maxLength} is not a number`
      console.error(`${maxLength} is not a number`)
    }

    bridge.store(values.result, result)
  }
}