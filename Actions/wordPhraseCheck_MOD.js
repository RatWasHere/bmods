modVersion = "v1.0.0"
const titleCase = string => string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

module.exports = {
  data: {
    name: titleCase("Check Text For Word")
  },
  aliases: ["Check For Word", "Check For Phrase", "Check If Text Includes Word", "Check If Text Includes List Of Words"],
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
      name: "Source Text",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "listType",
      name: "List Type",
      choices: {
        define: {name: "Define New List", field:false},
        importList: {name: "Import From Variable", field:false}
      },
    },
    "_",
    {
      element: "variable",
      storeAs: "wordList",
      name: "Word List"
    },
    "_",
    {
      element: "toggle",
      storeAs: "caseSens",
      name: "Case Sensitive?"
    },
    "-",
    {
      element: "condition",
      storeAs: "ifIncludes",
      storeActionsAs: "ifIncludesActions",
      name: "If Text Includes",
    },
    {
      element: "condition",
      storeAs: "ifNotIncludes",
      storeActionsAs: "ifNotIncludesActions",
      name: "If Text Doesn't Includes",
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return titleCase(`Check If Text Includes List Of Words`)
  },

  compatibility: ["Any"],

  script: (values) => {
    function reflem(skipAnimation) {
      let listType = values.data.listType.type

      let elementMap = {
        define: {
          element: "menu",
          storeAs: "wordListMenu",
          name: "Word / Phrase List",
          types: {
            words: "words"
          },
          max: 1000,
          UItypes: {
            words: {
              data: {},
              name: "Entry:",
              preview: "`${option.data.word}`",
              UI: [
                {
                  element: "largeInput",
                  storeAs: "word",
                  name: "Word / Phrase",
                  placeholder: "Word / Phrase"
                }
              ]
            }
          }
        },

        importList: {
          element: "variable",
          storeAs: "wordListVar",
          name: "Word List"
        },
      }

      values.UI[4] = elementMap[listType]

      setTimeout(
        () => {
          values.updateUI();
        },
        skipAnimation ? 1 : values.commonAnimation * 100
      );
    }

    reflem(true);

    values.events.on("change", () => {
      reflem();
    });
  },

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }
    
    let sourceText = bridge.transf(values.sourceText)

    let wordList

    switch(values.listType.type){
      case "define":{
        wordList = []
        for (let word of values.wordListMenu){
          let wordData = word.data
          wordList.push(wordData.word)
        }
        break
      }

      case "import":{
        wordList = bridge.get(values.wordListVar)
        break
      }
    }

    if (!Array.isArray(wordList)){
      return console.error(titleCase(`please provide a list of words to check for`))
    }

    let includesWords = false
    let caseSens = values.caseSens

    if (caseSens == false){
      sourceText = sourceText.toLowerCase()
    }

    for (let word of wordList){
      if (caseSens == false){
        word = word.toLowerCase()
      }

      if (sourceText.includes(word)){
        includesWords = true
        break
      }
    }

    if (includesWords == true){
      await bridge.call(values.ifIncludes, values.ifIncludesActions)
    } else {
      await bridge.call(values.ifNotIncludes, values.ifNotIncludesActions)
    }
  }
}