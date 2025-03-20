modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Date Time Conversions"
  },
  aliases: [],
  modules: ["luxon"],
  category: "Time",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "timeInput",
      name: "Time Input",
      placeholder: "YYYY-MM-DD hh:mm:ss" // ISO 8601-ish
    },
    {
      element: "typedDropdown",
      storeAs: "timezone",
      name: "Timezone",
      choices: (()=>{
        let timezones = {}
        timezones["custom"] = {name: "IANA Timezone", field: true, placeholder: "e.g: Asia/Singapore"}
        let supportedTimezones = Intl.supportedValuesOf("timeZone")
        supportedTimezones.forEach(timezone => {
          timezones[timezone] = {name: `${timezone}`, field: false}
        })
        return timezones
      })()
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "unit",
      name: "Timestamp Units",
      choices: {
        ms: {name: "Timestamp (13 Digit)", field: false},
        sec: {name: "Normalised Timestamp (10 Digit)", field: false}
      },
      help: {
        title: "Which Unit To Choose?",
        UI: [
          {
            element: "text",
            text: `<div style="font-size:20px">
            Normalised Timestamps Are Based On The Seconds Time Scale And Are 10 Digits Long.<br><br>
            Unnormalised Timestamps On The Other Hand, Is Based On The Milliseconds Time Scale. Meaning Its More Accurate.<br><br>
            Usually, A Normalised Timestamp Is Plenty For Normal Use But Some Actions May Ask For A Unnormalised Timestamp Instead.
            <div>`
          }
        ]
      },
    },
    {
      element: "store",
      storeAs: "timestamp",
      name: "Store Timestamp As",
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    let unit = values.unit.type
    let unitText
    switch(unit){
      case "ms":
        unitText = "Milliseconds Timestamp (13 Digits)"
        break

      case "sec":
        unitText = "Seconds Timestamp (10 Digits)"
        break
    }
    return `Convert ${values.timeInput} To ${unitText}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const { DateTime } = require("luxon")
    let timeInput = bridge.transf(values.timeInput)
    let timezone = bridge.transf(values.timezone.type)
    let outputUnit = bridge.transf(values.unit.type)
    if (timezone === "custom"){
      timezone = bridge.transf(values.timezone.value)
    }
    let dateTime = DateTime.fromFormat(timeInput, "yyyy-MM-dd HH:mm:ss", { zone: timezone })
    if (!dateTime.isValid) {
      console.error(`Invalid Date Time Format Or Timezone`)
      return bridge.store(values.timestamp, undefined)
    }
    let timestamp
    if (outputUnit == "ms"){
      timestamp = dateTime.toMillis()
    } else if (outputUnit == "sec"){
      timestamp = dateTime.toSeconds()
    }
    bridge.store(values.timestamp, timestamp)
  }
}