module.exports = {
  data: {
    name: "Multiple Regex Comparisons",
  },
  category: "Control",

  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "ko-fi.com/slothyacedia"
  },

  UI: [
    {
      element: "input",
      storeAs: "input",
      name: "Value To Compare",
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "List of Regex(es)",
      types: {
        comparison: "Comparison",
      },
      max: 1000,
      UItypes: {
        comparison: {
          data: {},
          name: "Regex:",
          preview: "`${option.data.value}`",
          UI: [
            {
              element: "input",
              storeAs: "value",
              name: "Regex Term",
            },
            "-",
            {
              element: "condition",
              storeAs: "true",
              storeActionsAs: "trueActions",
              name: "If True",
            },
            "-",
            {
              element: "condition",
              storeAs: "false",
              storeActionsAs: "falseActions",
              name: "If False",
            },
          ],
        },
      },
    },
  ],

  subtitle: (data) => {
    return `Compare ${data.input} To ${data.cases.length} Regex Terms`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let firstValue = bridge.transf(values.input);
    let matchesCriteria = false;
    let comparison = null;

    for (let c in values.cases) {
      comparison = values.cases[c].data;
      let secondValue = bridge.transf(comparison.value);

      matchesCriteria = Boolean(
        firstValue.match(new RegExp("^" + secondValue + "$", "i"))
      );

      if (matchesCriteria) {
        break;
      }
    }

    if (matchesCriteria) {
      await bridge.call(comparison.true, comparison.trueActions);
    } else {
      await bridge.call(comparison.false, comparison.falseActions);
    }
  },
};
