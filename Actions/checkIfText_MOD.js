module.exports = {
  data: {
    name: "Check If Text",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Text",
  modules: [],
  UI: [
    {
      element: "largeInput",
      storeAs: "sourceText",
      name: "Source Text",
    },
    {
      element: "typedDropdown",
      storeAs: "criteria",
      name: "Check If Text",
      choices: {
        startsWith: {name: "Starts With", field: false},
        endsWith: {name: "Ends With", field: false},
        includes: {name: "Includes", field: false},
        matchesRegex: {name: "Matches Regex", field: false}
      }
    },
    {
      element: "largeInput",
      storeAs: "lookup",
      name: "Text"
    },
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    },
  ],

  script: (values) => {
    function refreshElements(skipAnimation){
      type = values.data.criteria.type
      switch(type){
        case "startsWith":
          values.UI[2].name = "Text"
          break

        case "endsWith":
          values.UI[2].name = "Text"
          break

        case "includes":
          values.UI[2].name = "Text"
          break
        
        case "matchesRegex":
          values.UI[2].name = "Regex Term"
          break
      }

      setTimeout(()=>{
        values.updateUI()
      }, skipAnimation?1: values.commonAnimation*100)
    }

    refreshElements(true)

    values.events.on("change", ()=>{
      refreshElements()
    })
  },

  subtitle: (values) => {
    let looktype
    switch (values.criteria.type){
      case "startsWith":
        looktype = `Starts With`
        break

      case "endsWith":
        looktype = `Ends With`
        break

      case "includes":
        looktype = `Includes`
        break

      case "matchesRegex":
        looktype = `Matches Regex`
        break
    }
    return `Check If Text ${looktype} "${values.lookup||""}"`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    srcTxt = bridge.transf(values.sourceText)
    lookFor = bridge.transf(values.lookup)
    criterion = bridge.transf(values.criteria.type)

    let result = false

    switch (criterion) {
      case "startsWith":
        if (srcTxt.startsWith(lookFor)){
          result = true
        } else {result = false}
        break

      case "endsWith":
        if (srcTxt.endsWith(lookFor)){
          result = true
        } else {result = false}
        break

      case "includes":
        if (srcTxt.includes(lookFor)){
          result = true
        } else {result = false}
        break

      case "matchesRegex":
        if (srcTxt.match(new RegExp("^" + lookFor + "$", "i"))){
          result = true
        } else {result = false}
        break
    }

    if (result == true){
      await bridge.call(values.true, values.trueActions)
    } else if (result == false){await bridge.call(values.false, values.falseActions)}
  }
}