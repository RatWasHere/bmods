modVersion = "v2.0.1"
const titleCase = (string) =>
  string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const indexByStoreAs = (values, storeAs) => {
  if (typeof storeAs != "string") {
    return console.log("Not String")
  }
  let index = values.UI.findIndex((element) => element.storeAs == storeAs)
  if (index == -1) {
    return console.log("Index Not Found")
  }
  return index
}

module.exports = {
  data: {
    name: "Check Text For Word",
  },
  aliases: ["Check For Word", "Check For Phrase", "Check If Text Includes Word", "Check If Text Includes List Of Words"],
  modules: [],
  category: "Text",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
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
        define: { name: "Define New List", field: false },
        import: { name: "Import From Variable", field: false },
      },
    },
    "_",
    {
      element: "variable",
      storeAs: "wordList",
      name: "Word List",
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "inclusionType",
      name: "Inclusion Type",
      choices: {
        startsWith: { name: "Starts With" },
        endsWith: { name: "Ends With" },
        includes: { name: "Includes" },
      },
    },
    "_",
    {
      element: "toggle",
      storeAs: "caseSens",
      name: "Case Sensitive?",
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
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return titleCase(`Check If Text Includes List Of Words Or Phrases`)
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
            words: "words",
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
                  placeholder: "Word / Phrase",
                },
              ],
            },
          },
        },

        import: {
          element: "variable",
          storeAs: "wordList",
          name: "Word List",
        },
      }

      values.UI[indexByStoreAs(values, "wordList") || indexByStoreAs(values, "wordListMenu")] = elementMap[listType]

      let inclusionType = values.data.inclusionType.type
      let phraseMap = {
        startsWith: {
          ifIncludes: "If Text Starts With",
          ifNotIncludes: "If Text Doesn't Start With",
        },
        endsWith: {
          ifIncludes: "If Text Ends With",
          ifNotIncludes: "If Text Doesn't End With",
        },
        includes: {
          ifIncludes: "If Text Includes",
          ifNotIncludes: "If Text Doesn't Include",
        },
      }

      values.UI[indexByStoreAs(values, "ifIncludes")].name = phraseMap[inclusionType].ifIncludes
      values.UI[indexByStoreAs(values, "ifNotIncludes")].name = phraseMap[inclusionType].ifNotIncludes

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100
      )
    }

    reflem(true)

    values.events.on("change", () => {
      reflem()
    })
  },

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let sourceText = bridge.transf(values.sourceText)

    let wordList

    switch (values.listType.type) {
      case "define": {
        wordList = []
        for (let word of values.wordListMenu) {
          let wordData = word.data
          wordList.push(wordData.word)
        }
        break
      }

      case "importList":
      case "import": {
        wordList = bridge.get(values.wordList)
        break
      }
    }

    if (!Array.isArray(wordList)) {
      return console.error(titleCase(`please provide a list of words to check for`))
    }

    let includesWords = false
    let inclusionType = bridge.transf(values.inclusionType.type) || "includes"
    let caseSens = values.caseSens

    if (caseSens == false) {
      sourceText = sourceText.toLowerCase()
    }

    for (let word of wordList) {
      if (caseSens == false) {
        word = word.toLowerCase()
      }

      if (sourceText[inclusionType](word)) {
        includesWords = true
        break
      }
    }

    if (includesWords == true) {
      await bridge.call(values.ifIncludes, values.ifIncludesActions)
    } else {
      await bridge.call(values.ifNotIncludes, values.ifNotIncludesActions)
    }
  },
}
