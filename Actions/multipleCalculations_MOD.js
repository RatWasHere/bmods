modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Multiple Calculations"
  },
  aliases: [],
  modules: [],
  category: "Numbers",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "starting",
      name: "Number",
    },
    {
      element: "menu",
      storeAs: "operations",
      name: "Calculation Steps",
      max: 1000,
      types: {
        operations: "operations",
      },
      UItypes: {
        operations: {
          data: {},
          name: "Step",
          preview: "`${option.data.operation||''} ${option.data.number||''}`",
          UI: [
            {
              element: "dropdown",
              storeAs: "operation",
              name: "Operation",
              choices: [
                {name: "Addition"},
                {name: "Subtraction"},
                {name: "Multiplication"},
                {name: "Division"},
                {name: "Percentage Of Number"},
                {name: "Number Increased By Percentage"},
                {name: "Number Decreased By Percentage"},
                {name: "Raised By (Exponents)"},
                {name: "Raised By (Roots)"},
              ]
            },
            {
              element: "largeInput",
              storeAs: "number",
              name: "Number"
            },
          ],
        },
      },
    },
    {
      element: "store",
      storeAs: "final",
      name: "Store Final Number As",
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Do ${values.operations.length} Operations To ${values.starting}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    let startingNumber = Number(bridge.transf(values.starting))
    let result = startingNumber
    for (let operation of values.operations){
      let operationData = operation.data
      let operationType = bridge.transf(operationData.operation)
      let operationNumber = Number(bridge.transf(operationData.number))
      switch (operationType){
        case "Addition":{
          result = result + operationNumber
          break
        }

        case "Subtraction":{
          result = result - operationNumber
          break
        }

        case "Multiplication":{
          result = result * operationNumber
          break
        }

        case "Division":{
          result = result / operationNumber
          break
        }

        case "Number Increased By Percentage":{
          result = result * (1 + operationNumber / 100)
          break
        }

        case "Number Decreased By Percentage":{
          result = result * (1 - operationNumber / 100)
          break
        }

        case "Raised By (Exponents)":{
          result = Math.pow(result, operationNumber)
          break
        }

        case "Raised By (Roots)":{
          result = Math.pow(result, 1/operationNumber)
          break
        }

        case "Percentage Of Number":{
          result = (operationNumber/100) * result
          break
        }
      }
    }

    bridge.store(values.final, result)
  }
}