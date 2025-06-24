modVersion = "v1.2.4"
module.exports = {
  data: {
    name: "Extract From Text"
  },
  aliases: ["Number Extraction", "Regex Extraction", "Text Extractions"],
  modules: [],
  category: "Text",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "largeInput",
      storeAs: "sourceText",
      name: "Source"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "extraction",
      name: "Extract",
      choices: {
        string: {name: "Regex", field: true, placeholder: "Regex"},
        number: {name: "Numbers", field: false},
        text: {name: "Words", field: true, placeholder: "Words That Include"}
      },
    },
    {
      element: "toggle",
      storeAs: "caseInsensitive",
      name: "Case Insensitive?",
      true: "Yes",
      false: "No",
    },
    "-",
    {
      element: "store",
      storeAs: "extractedItem",
      name: "Store Extracted Array As"
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    let type = values.extraction.type
    let subtitle
    switch (type){
      case "string":{
        let regexExp = values.extraction.value.replace("\\", "\\\\") || ""
        subtitle = `Extract Regex(${regexExp})`
        break
      }

      case "number":{
        subtitle = `Extract Numbers`
        break
      }

      case "text":{
        subtitle = `Extract Words That Includes "${values.extraction.value}"`
      }
    }
    return subtitle
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    let source = bridge.transf(values.sourceText)
    let extractionType = bridge.transf(values.extraction.type)

    let extracts
    switch(extractionType){
      case "string":{
        let extractionReg = bridge.transf(values.extraction.value) || ""
        let regexExpression = new RegExp(extractionReg, "g" + (values.caseInsensitive? "i":""))
        extracts = [...source.matchAll(regexExpression)].map((match) => match[0])
        break
      }
      
      case "number":{
        extracts = (source.match(/-?\d+(?:\.\d+)?/g) || [])
        break
      }

      case "text":{
        let lookFor = bridge.transf(values.extraction.value) || ""
        let words = source.split(" ")
        if (values.caseInsensitive){
          extracts = words.filter(word => word.toLowerCase().includes(lookFor.toLowerCase()))
        } else {
          extracts = words.filter(word => word.includes(lookFor))
        }

        extracts = (extracts || []).map(extractedWord => extractedWord.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~‘’“”]/g, ""))
        break
      }
    }
    let results = (extracts && extracts.length > 0) ? extracts : []
    bridge.store(values.extractedItem, results)
  }
}