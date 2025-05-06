modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Number Clamp"
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
      storeAs: "number",
      name: "Number Input",
    },
    {
      element: "input",
      storeAs: "minimum",
      name: "Minimum",
      placeholder: "Defaults To 0"
    },
    {
      element: "input",
      storeAs: "maximum",
      name: "Maximum",
    },
    "-",
    {
      element: "store",
      storeAs: "clampedNumber",
      name: "Store Clamped Number As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Clamp ${values.number} To ${values.minimum}-${values.maximum}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    let number = parseFloat(bridge.transf(values.number))
    let minimum = parseFloat(bridge.transf(values.minimum)) || 0
    let maximum = parseFloat(bridge.transf(values.maximum))
    let outputNumber
    if (isNaN(minimum) || isNaN(maximum) || isNaN(number)){
      console.error(`One of the following isn't a number: ${bridge.transf(values.number)}, ${bridge.transf(values.minimum)}, ${bridge.transf(values.maximum)}`)
      outputNumber = undefined
    } else if (!isNaN(minimum) && !isNaN(maximum) && !isNaN(number) && maximum>minimum){
      outputNumber = Math.max(minimum, Math.min(number, maximum))
    } else {
      console.error(`Maximum must be bigger than minimum!`)
      outputNumber = undefined
    }
    bridge.store(values.clampedNumber, outputNumber)
  }
}