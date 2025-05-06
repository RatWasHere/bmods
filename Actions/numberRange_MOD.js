modVersion = "s.v1.1"
module.exports = {
  data: {
    name: "Check If Number Is In Range"
  },
  aliases: ["If Is In Number Range", "Number Range"],
  modules: [],
  category: "Numbers",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "inputNum",
      name: "Input Number",
    },
    {
      element: "input",
      storeAs: "lowerRange",
      name: "Minimum",
    },
    {
      element: "input",
      storeAs: "upperRange",
      name: "Maximum",
    },
    "-",
    {
      element: "condition",
      name: "If True",
      storeAs: "true",
      storeActionsAs: "trueActions"
    },
    {
      element: "condition",
      name: "If False",
      storeAs: "false",
      storeActionsAs: "falseActions"
    },
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values) => {
    return `Check If ${values.inputNum} Is In Range Of ${values.lowerRange}-${values.upperRange}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    let checkNumber = parseFloat(bridge.transf(values.inputNum))
    let minimum = parseFloat(bridge.transf(values.lowerRange))
    let maximum = parseFloat(bridge.transf(values.upperRange))

    if (!isNaN(checkNumber) && !isNaN(minimum) && !isNaN(maximum)){
      if (checkNumber >= minimum && maximum >= checkNumber){
        bridge.call(values.true, values.trueActions)
      } else {
        bridge.call(values.false, values.falseActions)
      }
    } else {
      console.log(`One of the following values is not a number; ${values.inputNum}, ${values.lowerRange}, ${values.upperRange}`)
    }
  }
}