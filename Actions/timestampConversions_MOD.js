module.exports = {
  data: {
    name: "Timestamp Conversions",
    nameAlias: ["Format Timestamp"]
  },
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
      name: "Timestamp",
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
      element: "text",
      text: "",
      name: "Example Output"
    },
    {
      element: "store",
      storeAs: "store",
      name: "Store Output As"
    },
  ],

  script: (values)=>{
    function refElm(skipAnimation){
      let type = values.data.format.type
      let fmtEx

      switch(type){
        default:
          fmtEx = `<div style="text-align:center">
            November 28, 2018 9:01 AM | 28 November 2018 09:01
            </div>`
          break

        case "shortTime":
          fmtEx = `<div style="text-align:center">
            9:01 AM | 09:01
            </div>`
          break

        case "longTime":
          fmtEx = `<div style="text-align:center">
            9:01:00 AM | 09:01:00
            </div>`
          break

        case "shortDate":
          fmtEx = `<div style="text-align:center">
            11/28/2018 (MM/DD/YYYY)| 28/11/2018 (DD/MM/YYYY)
            </div>`
          break

        case "longDate":
          fmtEx = `<div style="text-align:center">
            November 28, 2018 | 28 November 2018
            </div>`
          break

        case "shortDateTime":
          fmtEx = `<div style="text-align:center">
            November 28, 2018 9:01 AM | 28 November 2018 09:01
            </div>`
          break

        case "longDateTime":
          fmtEx = `<div style="text-align:center">
            Wednesday, November 28, 2018 9:01 AM | Wednesday, 28 November 2018 09:01
            </div>`
          break

        case "relative":
          fmtEx = `<div style="text-align:center">
            3 years ago | 3 years ago
            </div>`
          break

        case "custom":
          fmtEx = `<div style="text-align:center">
            <strong>Syntax:</strong><br>
            <span>Year - <code>YYYY</code> | <code>YY</code></span><br>
            <span>Month - <code>Month</code> | <code>MMM</code> | <code>MM</code></span><br>
            <span>Date - <code>DD</code></span><br>
            <span>Day - <code>Day</code> | <code>dd</code></span><br>
            <span>Hour - <code>hh</code></span><br>
            <span>Minute - <code>mm</code></span><br>
            <span>Second - <code>ss</code></span>
            </div>`
      }

      values.UI[2].text = fmtEx

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
        return `Convert ${timestamp} To ${values.format.value} Format`
        break
    }
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    let tstmp = bridge.transf(values.timestamp)
    let format = bridge.transf(values.format.type)
    let output

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
        const components = {
          YYYY: date.getFullYear(), // Full year
          YY: date.getFullYear().toString().slice(-2), // Last two digits of year
          MMM: date.toLocaleString("en-US", { month: "short" }), // Abbreviated month name
          Month: date.toLocaleString("en-US", { month: "long" }), // Full month name
          MM: String(date.getMonth() + 1).padStart(2, "0"), // Month (01-12)
          DD: String(date.getDate()).padStart(2, "0"), // Day of the month (01-31)
          Day: date.toLocaleString("en-US", { weekday: "long" }), // Full day name
          dd: date.toLocaleString("en-US", { weekday: "short" }), // Abbreviated day name
          hh: String(date.getHours()).padStart(2, "0"), // Hours (00-23)
          mm: String(date.getMinutes()).padStart(2, "0"), // Minutes (00-59)
          ss: String(date.getSeconds()).padStart(2, "0"), // Seconds (00-59)
        }
        output = cstmFormat.replace(/YYYY|YY|Month|MMM|MM|DD|Day|dd|hh|mm|ss/g,(match) => components[match] || match)
    }

    bridge.store(values.store, output)
  }
}