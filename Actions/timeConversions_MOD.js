modVersion = "v2.3.1"
module.exports = {
  data: {
    name: "Time Conversions",
    inputUnit: {
      type: "custom",
      value: "",
    },
  },
  aliases: ["Parse Time"],
  modules: [],
  category: "Time",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "timeInput",
      name: "Time",
    },
    {
      element: "typedDropdown",
      storeAs: "inputUnit",
      name: "Time Input Unit",
      choices: {
        ms: { name: "Milliseconds", field: false },
        sec: { name: "Seconds", field: false },
        min: { name: "Minutes", field: false },
        hour: { name: "Hours", field: false },
        day: { name: "Days", field: false },
        week: { name: "Weeks", field: false },
        month: { name: "Months", field: false },
        years: { name: "Years", field: false },
        custom: { name: "Parse Time (Custom)", field: false },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "outputUnit",
      name: "Output As",
      choices: {
        ms: { name: "Milliseconds", field: false },
        sec: { name: "Seconds", field: false },
        min: { name: "Minutes", field: false },
        hour: { name: "Hours", field: false },
        day: { name: "Days", field: false },
        week: { name: "Weeks", field: false },
        month: { name: "Months", field: false },
        years: { name: "Years", field: false },
        custom: { name: "Custom", field: true },
      },
      help: {
        title: "Placeholders",
        UI: [
          {
            element: "text",
            text: "Placeholders For Custom Output",
            header: true,
          },
          "-",
          {
            element: "text",
            text: "Years: {years} OR YY",
          },
          {
            element: "text",
            text: "Months: {months} OR MO",
          },
          {
            element: "text",
            text: "Weeks: {weeks} OR WK",
          },
          {
            element: "text",
            text: "Days: {days} OR DD",
          },
          {
            element: "text",
            text: "Hours: {hours} OR HH",
          },
          {
            element: "text",
            text: "Minutes: {minutes} OR MM",
          },
          {
            element: "text",
            text: "Seconds: {seconds} OR SS",
          },
          {
            element: "text",
            text: "Milliseconds: {milliseconds} OR MS",
          },
        ],
      },
    },
    "_",
    {
      element: "text",
      storeAs: "customOutputDocumentation",
      text: `Click On The "?" To See The Documentation For Output Placeholders`,
    },
    "-",
    {
      element: "store",
      storeAs: "convertedTime",
      name: "Store As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    let inputUnits = values.inputUnit.type
    let outputUnits = values.outputUnit.type

    let inputType = thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.inputUnit.type].name

    let outputType
    switch (outputUnits) {
      default:
        outputType = thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.outputUnit.type].name
        break

      case "custom":
        outputType = values.outputUnit.value
        break
    }

    return `Format ${values.timeInput} From ${inputType} To ${outputType}`
  },

  script: (values) => {
    // Find Element By StoreAs
    const indexByStoreAs = (values, storeAs) => {
      if (typeof storeAs != "string") {
        return console.log("Not String")
      }
      let index = values.UI.findIndex((element) => element.storeAs == storeAs)
      console.log(index)
      if (index == -1) {
        return console.log("Index Not Found")
      }
      return index
    }

    function refelm(skipAnimation) {
      if (values.data.outputUnit.type == "custom") {
        values.UI[indexByStoreAs(values, "customOutputDocumentation")].element = "text"
      } else {
        values.UI[indexByStoreAs(values, "customOutputDocumentation")].element = ""
      }

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100,
      )
    }
    refelm(true)

    values.events.on("change", () => {
      refelm()
    })
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let timeInput = bridge.transf(values.timeInput)
    let inputUnitType = bridge.transf(values.inputUnit.type)
    let outputUnitType = bridge.transf(values.outputUnit.type)
    let resultOutput
    let msTimeBase

    if (inputUnitType !== "custom") {
      timeInput = parseFloat(timeInput)
      if (isNaN(timeInput)) {
        console.error(`[${this.data.name}] The Given Time Input Is Not A Number!`)
        bridge.store(values.convertedTime, undefined)
        return
      }
    }

    switch (inputUnitType) {
      case "ms":
        msTimeBase = parseFloat(timeInput)
        break

      case "sec":
        msTimeBase = parseFloat(timeInput) * 1000
        break

      case "min":
        msTimeBase = parseFloat(timeInput) * (1000 * 60)
        break

      case "hour":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60)
        break

      case "day":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24)
        break

      case "week":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 7)
        break

      case "month":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 30.44)
        break

      case "years":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 365.25)
        break

      case "custom":
        let extractions = {
          year: { regex: /(\d+(?:\.\d+)?) ?(years?\b|yrs?\b|yy?\b)/gi, toMilli: 365.25 * 24 * 60 * 60 * 1000 },
          month: { regex: /(\d+(?:\.\d+)?) ?(mo(nths?)?\b|mths?\b)/gi, toMilli: 30.44 * 24 * 60 * 60 * 1000 },
          week: { regex: /(\d+(?:\.\d+)?) ?(weeks?\b|wks?\b|w\b)/gi, toMilli: 7 * 24 * 60 * 60 * 1000 },
          day: { regex: /(\d+(?:\.\d+)?) ?(days?\b|dd?\b)/gi, toMilli: 24 * 60 * 60 * 1000 },
          hour: { regex: /(\d+(?:\.\d+)?) ?(hours?\b|hrs?\b|hh?\b)/gi, toMilli: 60 * 60 * 1000 },
          minute: { regex: /(\d+(?:\.\d+)?) ?(minutes?\b|mins?\b|mm?\b)/gi, toMilli: 60 * 1000 },
          second: { regex: /(\d+(?:\.\d+)?) ?(seconds?\b|secs?\b|ss?\b)/gi, toMilli: 1000 },
          millisecond: { regex: /(\d+(?:\.\d+)?) ?(milliseconds?\b|ms\b)/gi, toMilli: 1 },
        }

        let extractedValues = {}
        for (let unit in extractions) {
          let matches = [...timeInput.matchAll(extractions[unit].regex)]

          if (matches.length > 0) {
            extractedValues[unit] = matches.reduce((sum, match) => {
              return sum + (parseFloat(match[1]) || 0)
            }, 0)
          } else {
            extractedValues[unit] = 0
          }
        }

        msTimeBase = 0
        for (let unit in extractedValues) {
          msTimeBase += extractedValues[unit] * extractions[unit].toMilli
        }
        parseFloat(msTimeBase)
        break
    }

    msTimeBase = Number(msTimeBase)

    switch (outputUnitType) {
      case "ms":
        resultOutput = msTimeBase
        break

      case "sec":
        resultOutput = msTimeBase / 1000
        break

      case "min":
        resultOutput = msTimeBase / (1000 * 60)
        break

      case "hour":
        resultOutput = msTimeBase / (1000 * 60 * 60)
        break

      case "day":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24)
        break

      case "week":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 7)
        break

      case "month":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 30.44)
        break

      case "years":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 365.25)
        break

      case "custom":
        let format = bridge.transf(values.outputUnit.value)

        let unitInMS = {
          YY: 365.25 * 24 * 60 * 60 * 1000,
          MO: 30.44 * 24 * 60 * 60 * 1000,
          WK: 7 * 24 * 60 * 60 * 1000,
          DD: 24 * 60 * 60 * 1000,
          HH: 60 * 60 * 1000,
          MM: 60 * 1000,
          SS: 1000,
          MS: 1,
        }

        let placeholders = {
          YY: ["YY", "{years}"],
          MO: ["MO", "{months}"],
          WK: ["WK", "{weeks}"],
          DD: ["DD", "{days}"],
          HH: ["HH", "{hours}"],
          MM: ["MM", "{minutes}"],
          SS: ["SS", "{seconds}"],
          MS: ["MS", "{milliseconds}"],
        }

        let usedUnits = {}
        for (let unit in placeholders) {
          usedUnits[unit] = placeholders[unit].some((placeholder) => format.includes(placeholder))
        }

        if (!Object.values(usedUnits).some(Boolean)) {
          console.error(`[${this.data.name}] There Is No Format Provided`)
          bridge.store(values.convertedTime, undefined)
          return
        }

        let remaining = msTimeBase
        let valuesOut = {}
        for (let unit of Object.keys(unitInMS)) {
          if (usedUnits[unit]) {
            valuesOut[unit] = Math.floor(remaining / unitInMS[unit])
            remaining %= unitInMS[unit]
          } else {
            valuesOut[unit] = 0
          }
        }
        let units = Object.keys(unitInMS)
        for (let i = 0; i < units.length - 1; i++) {
          let current = units[i]
          let next = units[i + 1]

          if (!usedUnits[current]) {
            valuesOut[next] += valuesOut[current] * (unitInMS[current] / unitInMS[next])
            valuesOut[current] = 0
          }
        }
        let replaceMap = {}

        for (let unit in placeholders) {
          let padded = unit === "MS" ? String(valuesOut[unit]).padStart(3, "0") : String(valuesOut[unit]).padStart(2, "0")

          for (let placeholder of placeholders[unit]) {
            replaceMap[placeholder] = padded
          }
        }

        resultOutput = format.replace(
          /YY|MO|WK|DD|HH|MM|SS|MS|{years}|{months}|{weeks}|{days}|{hours}|{minutes}|{seconds}|{milliseconds}/g,
          (match) => replaceMap[match],
        )
        break
    }
    bridge.store(values.convertedTime, resultOutput)
  },
}
