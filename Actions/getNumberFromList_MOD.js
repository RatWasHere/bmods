modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Number From List",
  },
  aliases: [],
  modules: [],
  category: "Numbers",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputList",
      name: "List",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "getType",
      name: "Get",
      choices: {
        min: { name: "Smallest Number" },
        max: { name: "Largest Number" },
        mean: { name: "Mean (Average)" },
        median: { name: "Median (Middle Number)" },
        mode: { name: "Mode (Most Repeated Number)" },
        sum: { name: "Sum" },
      },
    },
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let phrases = {
      min: "Smallest Number",
      max: "Largest Number",
      mean: "Average",
      median: "Middle Number",
      mode: "Most Repeated Number",
      sum: "Sum",
    }
    return `Get The ${phrases[values.getType.type]} Of List ${constants.variable(values.inputList)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let getType = bridge.transf(values.getType.type)
    let inputList = bridge.get(values.inputList)

    inputList = inputList.map(Number).filter((number) => !isNaN(number) && isFinite(number))
    if (inputList.length < 1) {
      console.log(`[${this.data.name}] Filtered List Contains Less Than 1 Element`)
      return
    }

    let result
    switch (getType) {
      case "min": {
        result = Math.min(...inputList)
        break
      }

      case "max": {
        result = Math.max(...inputList)
        break
      }

      case "mean": {
        let total = inputList.reduce((total, number) => (total = (total || 0) + number))
        let mean = total / inputList.length
        result = Math.round(mean * 1000) / 1000
        break
      }

      case "median": {
        let sortedList = [...inputList].sort((a, b) => a - b)
        let mid = Math.floor(sortedList.length / 2)
        result = sortedList.length % 2 ? sortedList[mid] : (sortedList[mid - 1] + sortedList[mid]) / 2
        break
      }

      case "mode": {
        let counts = {}
        let maxCount = 0
        let mode

        for (let element of inputList) {
          counts[element] = (counts[element] || 0) + 1

          if (counts[element] > maxCount) {
            maxCount = counts[element]
            mode = element
          }
        }

        result = mode
        break
      }

      case "sum": {
        let total = inputList.reduce((total, number) => (total = (total || 0) + number))
        result = Math.round(total * 1000) / 1000
        break
      }
    }

    bridge.store(values.result, result)
  },
}
