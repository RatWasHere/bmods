modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "String Limiter",
  },
  aliases: ["Truncate String"],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
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
      element: "toggle",
      storeAs: "countAppend",
      name: "Length of string includes appended text?",
    },
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As"
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values) =>{
    return `Limit text to ${values.maxLength||""}, append with "${values.append||""}" if limit exceeded`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    const sourceText = bridge.transf(values.srcTxt)
    const maxLength = bridge.transf(values.maxLength)
    const appendWith = bridge.transf(values.append)

    let result

    const maxLengthNum = parseInt(maxLength, 10)
    if (isNaN(maxLengthNum) || maxLengthNum <= 0){
      result = `${maxLength} is not a integer!`
    }
    else if (sourceText.length > maxLengthNum){
      if (values.countAppend === true){
        result = sourceText.slice(0, maxLengthNum-appendWith.length) + appendWith
      }
      else{
        result = sourceText.slice(0, maxLengthNum) + appendWith
      }
    }
    else if (sourceText.length < maxLengthNum){
      result = sourceText
    }

    bridge.store(values.result, result)
  }
}