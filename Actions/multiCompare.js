module.exports = {
  data: {
    name: "Multiple Comparisons",
  },
  category: "Control",

  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods/QOL%20Edits",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  
  UI: [
    {
      element: "input",
      storeAs: "input",
      name: "Input Value"
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "Comparisons",
      types: {
        comparison: "Comparison"
      },
      max: 200,
      UItypes: {
        comparison: {
          data: {},
          name: "Comparison",
          preview: "`${option.data.comparator} ${option.data.value}`",
          UI: [
            {
              element: "dropdown",
              storeAs: "comparator",
              name: "Comparator",
              choices: [
                {
                  name: "="
                },
                {
                  name: "!="
                },
                {
                  name: "<"
                },
                {
                  name: ">"
                }
              ]
            },
            "_",
            {
              element: "input",
              storeAs: "value",
              name: "Compare Input Value To"
            },
            "-",
            {
              element: "condition",
              storeAs: "true",
              storeActionsAs: "trueActions",
              name: "If True"
            },
            "-",
            {
              element: "condition",
              storeAs: "false",
              storeActionsAs: "falseActions",
              name: "If False"
            }
          ]
        }
      }
    },
  ],

  subtitle: (data) => {
    return `Compare: ${data.input} To ${data.cases.length} Cases`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {

    let firstValue = bridge.transf(values.input);

    for (let c in values.cases) {
      let comparison = values.cases[c].data;
      let secondValue = bridge.transf(comparison.value);
      let matchesCriteria = false;

      switch (comparison.comparator) {
        case "!=":
          matchesCriteria = firstValue != secondValue;
          break;

        case "=":
          matchesCriteria = firstValue == secondValue;
          break;

        case ">":
          matchesCriteria = firstValue > secondValue;
          break;

        case "<":
          matchesCriteria = firstValue < secondValue;
          break;
      }


      if (matchesCriteria == true) {
        await bridge.call(comparison.true, comparison.trueActions)
      } else {
        await bridge.call(comparison.false, comparison.falseActions)
      }
    }
  },
};
