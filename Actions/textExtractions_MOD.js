modVersion = "s.v1.1"
module.exports = {
  data: {
    name: "Extract From Text"
  },
  aliases: ["Number Extraction", "Regex Extraction"],
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
    {
      element: "typedDropdown",
      storeAs: "extraction",
      name: "Extract",
      choices: {
        string: {name: "String", field: true, placeholder: "Regex"},
        number: {name: "Number", field: false}
      },
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
    let regexExp
    if (type == "string"){
      regexExp = values.extraction.value.replace("\\", "\\\\") || ""
    } else if (type == "number"){
      regexExp = `(\\d+(?:\\.\\d+)?)`
    }
    return `Extract ${thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.extraction.type].name}(${regexExp})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    let source = bridge.transf(values.sourceText)
    let extractionType = bridge.transf(values.extraction.type)

    let extracts
    switch(extractionType){
      case "string":
        let extractionReg = bridge.transf(values.extraction.value) || ""
        extracts = [...source.matchAll(new RegExp("^"+extractionReg+"$", "g"))].map((match) => match[0])
        break
      
      case "number":
        extracts = [...source.matchAll(/(\d+(?:\.\d+)?)/g)].map((match) => match[0])
        break
    }
    let results = (extracts && extracts.length > 0) ? extracts : []
    bridge.store(values.extractedItem, results)
  }
}