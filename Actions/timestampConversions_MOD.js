modVersion = "s.v1.2"
module.exports = {
  data: {
    name: "Timestamp Conversions",
  },
  aliases: ["Format Timestamp"],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Time",
  modules: [],
  UI: [
    {
      element: "input",
      storeAs: "timestamp",
      name: "Unix Timestamp",
    },
    {
      element: "typedDropdown",
      storeAs: "format",
      name: "Format As",
      choices: {
        default: {name: "Default", field: false},
        shortTime: {name: "Short Time", field: false},
        longTime: {name: "Long Time", field: false},
        shortDate: {name: "Short Date", field: false},
        longDate: {name: "Long Date", field: false},
        shortDateTime: {name: "Short Date / Time", field: false},
        longDateTime: {name: "Long Date / Time", field: false},
        relative: {name: "Relative Time", field: false},
        custom: {name: "Custom", field: true}
      }
    },
    {
      element: "",
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
      element: "text",
      text: ""
    },
    {
      element: "text",
      text: "",
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Output As"
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  script: (values)=>{
    function refElm(skipAnimation){
      let type = values.data.format.type
      let fmtEx
      let header
      let timezoneSelector

      switch(type){
        default:
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            November 28, 2018 9:01 AM | 28 November 2018 09:01
            </div>`
          break

        case "shortTime":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            9:01 AM | 09:01
            </div>`
          break

        case "longTime":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            9:01:00 AM | 09:01:00
            </div>`
          break

        case "shortDate":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            11/28/2018 (MM/DD/YYYY)| 28/11/2018 (DD/MM/YYYY)
            </div>`
          break

        case "longDate":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            November 28, 2018 | 28 November 2018
            </div>`
          break

        case "shortDateTime":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            November 28, 2018 9:01 AM | 28 November 2018 09:01
            </div>`
          break

        case "longDateTime":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            Wednesday, November 28, 2018 9:01 AM | Wednesday, 28 November 2018 09:01
            </div>`
          break

        case "relative":
          header = `<div style="font-size:20px">Example Output</div>`
          fmtEx = `<div style="text-align:left">
            3 years ago | 3 years ago
            </div>`
          break

        case "custom":
          header = `<div style="font-size:20px">Syntax</div>`
          fmtEx = `<div style="text-align:left">
            <span>Year - <code>YYYY</code> | <code>YY</code></span><br>
            <span>Month - <code>Month</code> | <code>MMM</code> | <code>MM</code></span><br>
            <span>Date - <code>DD</code></span><br>
            <span>Day - <code>Day</code> | <code>ddd</code></span><br>
            <span>Hour - <code>hh</code></span><br>
            <span>Minute - <code>mm</code></span><br>
            <span>Second - <code>ss</code></span>
            </div>`
          break
      }

      if (type == "custom"){values.UI[2].element="typedDropdown"}
      else {values.UI[2].element=""}
      
      values.UI[4].text = header
      values.UI[5].text = fmtEx

      setTimeout(()=>{
        values.updateUI()
      }, skipAnimation?1: values.commonAnimation*100)
    }

    refElm(true)

    values.events.on("change", ()=>{
      refElm()
    })
  },

  subtitle: (values) => {
    let type = values.format.type
    let timestamp = values.timestamp
    switch (type){
      case "default":
        return `Convert ${timestamp} To Default Format`
        break

      case "shortTime":
        return `Convert ${timestamp} To Short Time Format`
        break

      case "longTime":
        return `Convert ${timestamp} To Long Time Format`
        break

      case "shortDate":
        return `Convert ${timestamp} To Short Date Format`
        break

      case "longDate":
        return `Convert ${timestamp} To Long Date Format`
        break

      case "shortDateTime":
        return `Convert ${timestamp} To Short Date / Time Format`
        break

      case "longDateTime":
        return `Convert ${timestamp} To Long Date / Time Format`
        break

      case "relative":
        return `Convert ${timestamp} To Relative Time Format`
        break

      case "custom":
        let tz = values.timezone.type
        if (tz == "custom"){
          tz = values.timezone.value
        }
        return `Convert ${timestamp} To ${values.format.value} Format, Timezone Of ${tz}`
        break
    }
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    let tstmp = bridge.transf(values.timestamp)
    let format = bridge.transf(values.format.type)
    let output

    if (tstmp.length == 13){
      tstmp = Math.floor(tstmp/1000)
    }

    switch (format){
      case "default":
        output = `<t:${tstmp}>`
        break

      case "shortTime":
        output = `<t:${tstmp}:t>`
        break

      case "longTime":
        output = `<t:${tstmp}:T>`
        break

      case "shortDate":
        output = `<t:${tstmp}:d>`
        break

      case "longDate":
        output = `<t:${tstmp}:D>`
        break

      case "shortDateTime":
        output = `<t:${tstmp}:f>`
        break

      case "longDateTime":
        output = `<t:${tstmp}:F>`
        break

      case "relative":
        output = `<t:${tstmp}:R>`
        break

      case "custom":
        cstmFormat = bridge.transf(values.format.value)
        let date = new Date(tstmp*1000)
        let timeZone = bridge.transf(values.timezone.type)
        if (timeZone == "custom"){
          timeZone = bridge.transf(values.timezone.value) || undefined
        }
        locale = "en-US"
        const components = {
          YYYY: new Intl.DateTimeFormat(locale, { year: "numeric", timeZone }).format(date), // Full year (e.g., 2025)
          YY: new Intl.DateTimeFormat(locale, { year: "2-digit", timeZone }).format(date), // Last two digits of year (e.g., 25)
          MMM: new Intl.DateTimeFormat(locale, { month: "short", timeZone }).format(date), // Abbreviated month name (e.g., Jan)
          Month: new Intl.DateTimeFormat(locale, { month: "long", timeZone }).format(date), // Full month name (e.g., January)
          MM: new Intl.DateTimeFormat(locale, { month: "2-digit", timeZone }).format(date).padStart(2, "0"), // Month (01-12) - zero-padded
          DD: new Intl.DateTimeFormat(locale, { day: "2-digit", timeZone }).format(date).padStart(2, "0"), // Day of the month (01-31) - zero-padded
          Day: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone }).format(date), // Full day name (e.g., Monday)
          ddd: new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }).format(date), // Abbreviated day name (e.g., Mon)
          hh: new Intl.DateTimeFormat(locale, { hour: "2-digit", hour12: false, timeZone }).format(date).slice(0, 2).padStart(2, "0"), // Hours (00-23)
          mm: new Intl.DateTimeFormat(locale, { minute: "2-digit", timeZone }).format(date).slice(0, 2).padStart(2, "0"), // Minutes (00-59)
          ss: new Intl.DateTimeFormat(locale, { second: "2-digit", timeZone }).format(date).slice(0, 2).padStart(2, "0"), // Seconds (00-59)
        }
        output = cstmFormat.replace(/YYYY|YY|Month|MMM|MM|DD|Day|ddd|hh|mm|ss/g,(match) => components[match] || match)
    }

    bridge.store(values.store, output)
  }
}