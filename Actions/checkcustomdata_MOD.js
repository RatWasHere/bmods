modVersion = "v1.0.1";

module.exports = {
  modules: ["edit-json-file"],
  data: {
    name: "Check Custom Data",
  },
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "input",
      name: "Database",
      storeAs: "database",
    },
    "-",
    {
      element: "input",
      storeAs: "Path",
      name: "Path",
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "comparator",
      extraField: "compareValue",
      name: "Comparison Type",
      choices: [
        {
          name: "Equals",
          field: true,
          placeholder: "Equals To",
        },
        {
          name: "Equals Exactly",
          field: true,
        },
        {
          name: "Doesn't Equal",
          field: true,
        },
        {
          name: "Exists",
        },
        {
          name: "Less Than",
          field: true,
        },
        {
          name: "Greater Than",
          field: true,
        },
        {
          name: "Equal Or Less Than",
          field: true,
        },
        {
          name: "Equal Or Greater Than",
          field: true,
        },
        {
          name: "Is Number",
        },
        {
          name: "Matches Regex",
          field: true,
          placeholder: "Regex",
        },
        {
          name: "Exactly includes",
          field: true,
          placeholder: "Text",
        },
      ],
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
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (data, constants) => {
    let variable = data.Path;

    switch (data.comparator) {
      case "Equals":
        return `${variable} Equals ${data.compareValue}`;
        break;

      case "Equals Exactly":
        return `${variable} Equals ${data.compareValue}`;
        break;

      case "Doesn't Equal":
        return `${variable} Doesn't Equal ${data.compareValue}`;
        break;

      case "Exists":
        return `${variable} Exists`;
        break;

      case "Less Than":
        return `${variable} Is Less Than ${data.compareValue}`;
        break;

      case "Greater Than":
        return `${variable} Is Greater Than ${data.compareValue}`;
        break;

      case "Equal Or Less Than":
        return `${variable} Is Equal Or Less Than ${data.compareValue}`;
        break;

      case "Equal Or Greater Than":
        return `${variable} Is Equal Or Greater Than ${data.compareValue}`;
        break;

      case "Is Number":
        return `${variable} Is A Number`;
        break;

      case "Matches Regex":
        return `${variable} Matches Regex (${data.compareValue})`;
        break;

      case "Exactly includes":
        return `${variable} Exactly includes (${data.compareValue})`;
        break;
    }
  },

  async run(values, message, client, bridge) {
    let dbPath = bridge.file(values.database);

    const editJsonFile = await client.getMods().require("edit-json-file");

    let file = editJsonFile(dbPath, {
      autosave: true,
    });
    let matchesCriteria = false;

    let variable = file.get(bridge.transf(values.Path));
    let secondValue = bridge.transf(values.compareValue);

    switch (values.comparator) {
      case "Equals":
        if (`${variable}` == `${secondValue}`) {
          matchesCriteria = true;
        }
        break;

      case "Doesn't Equal":
        if (variable != secondValue) {
          matchesCriteria = true;
        }
        break;

      case "Exists":
        matchesCriteria = variable != null || variable != undefined;
        break;

      case "Equals Exactly":
        if (variable === secondValue) {
          matchesCriteria = true;
        }
        break;

      case "Greater Than":
        if (Number(variable) > Number(secondValue)) {
          matchesCriteria = true;
        }
        break;

      case "Less Than":
        if (Number(variable) < Number(secondValue)) {
          matchesCriteria = true;
        }
        break;

      case "Equal Or Greater Than":
        if (Number(variable) >= Number(secondValue)) {
          matchesCriteria = true;
        }
        break;

      case "Equal Or Less Than":
        if (Number(variable) <= Number(secondValue)) {
          matchesCriteria = true;
        }
        break;

      case "Is Number":
        if (
          typeof parseInt(variable) == "number" &&
          `${parseInt(variable)}` != `NaN`
        ) {
          matchesCriteria = true;
        }
        break;

      case "Matches Regex":
        matchesCriteria = Boolean(
          variable.match(new RegExp("^" + secondValue + "$", "i"))
        );
        break;

      case "Exactly includes":
        if (typeof variable?.toString().includes === "function") {
          matchesCriteria = variable.toString().includes(secondValue);
        }
        break;
    }

    if (matchesCriteria == true) {
      await bridge.call(values.true, values.trueActions);
    } else {
      await bridge.call(values.false, values.falseActions);
    }
  },
};
