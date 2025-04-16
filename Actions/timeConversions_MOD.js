modVersion = "s.v2.2";
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
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
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
    },
    {
      element: "",
      text: `<div style="font-size:20px">Syntax</div>`,
    },
    {
      element: "",
      text: `<div style="text-align:left">
        <span>Years: <code>YY</code></span><br>
        <span>Months: <code>MO</code></span><br>
        <span>Weeks: <code>WK</code></span><br>
        <span>Days: <code>DD</code></span><br>
        <span>Hours: <code>HH</code></span><br>
        <span>Minutes: <code>MM</code></span><br>
        <span>Seconds: <code>SS</code></span><br>
        <span>Milliseconds: <code>MS</code></span><br>
      </div>`,
    },
    "-",
    {
      element: "store",
      storeAs: "convertedTime",
      name: "Store As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  script: (values) => {
    function refelm(skipAnimation) {
      if (values.data.outputUnit.type == "custom") {
        values.UI[3].element = "text";
        values.UI[4].element = "text";
      } else {
        values.UI[3].element = "";
        values.UI[4].element = "";
      }

      setTimeout(
        () => {
          values.updateUI();
        },
        skipAnimation ? 1 : values.commonAnimation * 100
      );
    }
    refelm(true);

    values.events.on("change", () => {
      refelm();
    });
  },

  subtitle: (values, constants, thisAction) => {
    let inputUnits = values.inputUnit.type;
    let outputUnits = values.outputUnit.type;

    let inputType = thisAction.UI.find((e) => e.element == "typedDropdown")
      .choices[values.inputUnit.type].name;

    let outputType;
    switch (outputUnits) {
      default:
        outputType = thisAction.UI.find((e) => e.element == "typedDropdown")
          .choices[values.outputUnit.type].name;
        break;

      case "custom":
        outputType = values.outputUnit.value;
        break;
    }

    return `Format ${values.timeInput} From ${inputType} To ${outputType}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let timeInput = bridge.transf(values.timeInput);
    let inputUnitType = bridge.transf(values.inputUnit.type);
    let outputUnitType = bridge.transf(values.outputUnit.type);
    let resultOutput;
    let msTimeBase;

    if (inputUnitType !== "custom") {
      timeInput = parseFloat(timeInput);
      if (isNaN(timeInput)) {
        console.error(`The given time input is not a number!`);
        bridge.store(values.convertedTime, undefined);
        return;
      }
    }

    switch (inputUnitType) {
      case "ms":
        msTimeBase = parseFloat(timeInput);
        break;

      case "sec":
        msTimeBase = parseFloat(timeInput) * 1000;
        break;

      case "min":
        msTimeBase = parseFloat(timeInput) * (1000 * 60);
        break;

      case "hour":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60);
        break;

      case "day":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24);
        break;

      case "week":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 7);
        break;

      case "month":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 30.44);
        break;

      case "years":
        msTimeBase = parseFloat(timeInput) * (1000 * 60 * 60 * 24 * 365.25);
        break;

      case "custom":
        const extractions = {
          year: {
            regex: /(\d+(?:\.\d+)?) ?(years?\b|yrs?\b|yy?\b)/gi,
            toMilli: 365.25 * 24 * 60 * 60 * 1000,
          },
          month: {
            regex: /(\d+(?:\.\d+)?) ?(mo(nths?)?\b|mths?\b)/gi,
            toMilli: 30.44 * 24 * 60 * 60 * 1000,
          },
          week: {
            regex: /(\d+(?:\.\d+)?) ?(weeks?\b|wks?\b|w\b)/gi,
            toMilli: 7 * 24 * 60 * 60 * 1000,
          },
          day: {
            regex: /(\d+(?:\.\d+)?) ?(days?\b|dd?\b)/gi,
            toMilli: 24 * 60 * 60 * 1000,
          },
          hour: {
            regex: /(\d+(?:\.\d+)?) ?(hours?\b|hrs?\b|hh?\b)/gi,
            toMilli: 60 * 60 * 1000,
          },
          minute: {
            regex: /(\d+(?:\.\d+)?) ?(minutes?\b|mins?\b|mm?\b)/gi,
            toMilli: 60 * 1000,
          },
          second: {
            regex: /(\d+(?:\.\d+)?) ?(seconds?\b|secs?\b|ss?\b)/gi,
            toMilli: 1000,
          },
          millisecond: {
            regex: /(\d+(?:\.\d+)?) ?(milliseconds?\b|ms\b)/gi,
            toMilli: 1,
          },
        };

        let extractedValues = {};
        for (let unit in extractions) {
          let matches = [...timeInput.matchAll(extractions[unit].regex)];

          if (matches.length > 0) {
            extractedValues[unit] = matches.reduce((sum, match) => {
              return sum + (parseFloat(match[1]) || 0);
            }, 0);
          } else {
            extractedValues[unit] = 0;
          }
        }

        msTimeBase = 0;
        for (let unit in extractedValues) {
          msTimeBase += extractedValues[unit] * extractions[unit].toMilli;
        }
        parseFloat(msTimeBase);
        break;
    }

    msTimeBase = Number(msTimeBase);

    switch (outputUnitType) {
      case "ms":
        resultOutput = msTimeBase;
        break;

      case "sec":
        resultOutput = msTimeBase / 1000;
        break;

      case "min":
        resultOutput = msTimeBase / (1000 * 60);
        break;

      case "hour":
        resultOutput = msTimeBase / (1000 * 60 * 60);
        break;

      case "day":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24);
        break;

      case "week":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 7);
        break;

      case "month":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 30.44);
        break;

      case "years":
        resultOutput = msTimeBase / (1000 * 60 * 60 * 24 * 365.25);
        break;

      case "custom":
        let format = bridge.transf(values.outputUnit.value);

        let years = Math.floor(msTimeBase / (1000 * 60 * 60 * 24 * 365.25));
        msTimeBase %= 1000 * 60 * 60 * 365.25;

        let months = Math.floor(msTimeBase / (1000 * 60 * 60 * 24 * 30.44));
        msTimeBase %= 1000 * 60 * 60 * 24 * 30.44;

        let weeks = Math.floor(msTimeBase / (1000 * 60 * 60 * 24 * 7));
        msTimeBase %= 1000 * 60 * 60 * 24 * 7;

        let days = Math.floor(msTimeBase / (1000 * 60 * 60 * 24));
        msTimeBase %= 1000 * 60 * 60 * 24;

        let hours = Math.floor(msTimeBase / (1000 * 60 * 60));
        msTimeBase %= 1000 * 60 * 60;

        let minutes = Math.floor(msTimeBase / (1000 * 60));
        msTimeBase %= 1000 * 60;

        let seconds = Math.floor(msTimeBase / 1000);
        msTimeBase %= 1000;

        let milliseconds = msTimeBase % 1000;

        if (!format.includes("YY")) {
          months += years * (365.25 / 30.44);
          years = 0;
        }
        if (!format.includes("MO")) {
          weeks += months * (30.44 / 7);
          months = 0;
        }
        if (!format.includes("WK")) {
          days += weeks * 7;
          weeks = 0;
        }
        if (!format.includes("DD")) {
          hours += days * 24;
          days = 0;
        }
        if (!format.includes("HH")) {
          minutes += hours * 60;
          hours = 0;
        }
        if (!format.includes("MM")) {
          seconds += minutes * 60;
          hours = 0;
        }
        if (!format.includes("SS")) {
          milliseconds += seconds * 1000;
          seconds = 0;
        }
        if (
          !format.includes("MS") &&
          !format.includes("SS") &&
          !format.includes("MM") &&
          !format.includes("HH") &&
          !format.includes("DD") &&
          !format.includes("WK") &&
          !format.includes("MO") &&
          !format.includes("YY")
        ) {
          console.error(`There is no format provided!`);
          resultOutput = undefined;
          return;
        }

        const components = {
          YY: String(years).padStart(2, "0"),
          MO: String(months).padStart(2, "0"),
          WK: String(weeks).padStart(2, "0"),
          DD: String(days).padStart(2, "0"),
          HH: String(hours).padStart(2, "0"),
          MM: String(minutes).padStart(2, "0"),
          SS: String(seconds).padStart(2, "0"),
          MS: String(milliseconds).padStart(3, "0"),
        };

        resultOutput = format.replace(
          /YY|MO|WK|DD|HH|MM|SS|MS/g,
          (match) => components[match] || match
        );
        break;
    }
    bridge.store(values.convertedTime, resultOutput);
  },
};
