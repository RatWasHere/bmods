modVersion = "v2.0.1"
module.exports = {
  data: {
    name: "Better Multiple Comparisons"
  },
  aliases: ["Switch Case", "Multiple Comparisons", "Multiple Check If"],
  info: {
  source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
  creator: "Acedia QOLs",
  donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Conditions",
  modules: [],
  UI: [
    {
      element: "input",
      storeAs: "input",
      name: "Input",
    },
    {
      element: "menu",
      storeAs: "matchConditions",
      name: "Conditions",
      types: {
        conditions: "conditions",
      },
      max: 1000,
      UItypes: {
        conditions:{
          data: {},
          name: "Condition",
          preview: "`${option.data.conditionType} ${option.data.compValue}`",
          UI: [
            {
              element: "dropdown",
              storeAs: "conditionType",
              name: "Operand",
              choices: [
                {name: "Equals To", field: false},
                {name: "Not Equals To", field: false},
                {name: "More Than", field: false},
                {name: "More Than / Equals To", field: false},
                {name: "Less Than", field: false},
                {name: "Less Than / Equal To", field: false},
                {name: "Matches Regex", field: false},
                {name: "Starts With", field: false},
                {name: "Ends With", field: false},
                {name: "Contains", field: false},
                {name: "Is Number", field: false},
              ],
            },
            {
              element: "largeInput",
              storeAs: "compValue",
              name: "Comparison Value",
            },
            "-",
            {
              element: "condition",
              storeAs: "true",
              storeActionsAs: "trueActions",
              name: "If True, Run",
            }
          ]
        }
      }
    },
    {
      element: "condition",
      storeAs: "else",
      storeActionsAs: "elseActions",
      name: "If No Matches At All, Run"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values) => {
    return `Match against ${values.matchConditions.length} conditions.`
  },

  async run(values, interaction, client, bridge){
    let oriValue = bridge.transf(values.input)
    let matches = false

    for (let cnd in values.matchConditions){
      let conditionData = values.matchConditions[cnd].data
      let compValue = bridge.transf(conditionData.compValue)
      let conditionType = bridge.transf(conditionData.conditionType)
      let conditionMatch = false

      switch (conditionType){
        case "More Than":
          if(oriValue > compValue){
            conditionMatch = true
          }
          break

        case "More Than / Equals To":
          if(oriValue >= compValue){
            conditionMatch = true
          }
          break

        case "Less Than":
          if(oriValue < compValue){
            conditionMatch = true
          }
          break

        case "Less Than / Equals To":
          if(oriValue <= compValue){
            conditionMatch = true
          }
          break

        case "Equals To":
          if(oriValue === compValue){
            conditionMatch = true
          }
          break

        case "Not Equals To":
          if(oriValue !== compValue){
            conditionMatch = true
          }
          break

        case "Matches Regex":
          if (conditionMatch = oriValue.match(new RegExp("^" + compValue + "$", "i"))){
            conditionMatch = true
          }
          break

        case "Starts With":
          if(oriValue.startsWith(compValue)){
            conditionMatch = true
          }
          break

        case "Ends With":
          if(oriValue.endsWith(compValue)){
            conditionMatch = true
          }
          break

        case "Contains":
          if(oriValue.includes(compValue)){
            conditionMatch = true
          }
          break

        case "Is Number":
          if(typeof parseFloat(oriValue) === "number" && `${parseFloat(oriValue)}` !== `NaN`){
            conditionMatch = true
          }
          break
      }

      if (conditionMatch == true){
        await bridge.call(conditionData.true, conditionData.trueActions)
        matches = true
      }
    }

    if (matches === false){
      await bridge.call(values.else, values.elseActions)
    }
  }
}