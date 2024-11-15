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

  subtitle: (values) =>{
    return `Limit text to ${values.maxLength}, append with ${values.append} if limit exceeded`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    const sourceText = bridge.transf(values.srcTxt)
    const maxLength = bridge.transf(values.maxLength)
    const appendWith = bridge.transf(values.append)

    let result

    if (Number.isInteger(Number(maxLength))){
      maxLengthNum = Number(maxLength)
      if (sourceText.length > maxLengthNum){
        result = sourceText.slice(0, maxLengthNum) + appendWith
      }
      else if (sourceText.length < maxLengthNum){
        result = sourceText
      }
    }
    else {
      result = `Error: ${maxLength} is not a integer`
      console.error(`${maxLength} is not a integer`)
    }

    bridge.store(values.result, result)
  }
}