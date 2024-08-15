module.exports = {
  data: {
    name: "Variable Pattern",
  },
  category: "Variables",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "variable",
      storeAs: "variable",
      name: "Variable to Manipulate",
    },
    "-",
    {
      name: "Pattern Type",
      element: "dropdown",
      storeAs: "patternType",
      extraField: "patternValue",
      choices: [
        {
          name: "Repeat",
          field: true,
          placeholder: "Repeat Every N Characters",
        },
        { name: "Change", field: true, placeholder: "Change From Character" },
        { name: "Add To Front" },
        { name: "Add To End" },
        {
          name: "Add To Specific Position",
          field: true,
          placeholder: "Position Character",
        },
        { name: "Store From Front" },
        { name: "Store From End" },
        { name: "Store One Character" },
      ],
    },
    "_",
    {
      element: "input",
      storeAs: "inputValue",
      name: "Text or Number",
      field: true,
      placeholder: "Enter value or position",
    },
    "-",
    {
      element: "storage",
      storeAs: "resultStorage",
      name: "Store Result As",
    },
  ],

  subtitle: (values, constants) => {
    const patternTypes = {
      Repeat: "Repeat",
      Change: "Change",
      "Add To Front": "Add To Front",
      "Add To End": "Add To End",
      "Add To Specific Position": "Add To Specific Position",
      "Store From Front": "Store From Front",
      "Store From End": "Store From End",
      "Store One Character": "Store One Character",
    };

    const patternType = values.patternType || "Unknown";
    let subtitle = `Pattern Type: ${patternTypes[patternType] || patternType}`;

    if (values.patternValue && values.patternValue.trim() !== "") {
      subtitle += ` (${values.patternValue})`;
    }
    if (values.inputValue && values.inputValue.trim() !== "") {
      subtitle += ` - Text or Number: ${values.inputValue}`;
    }

    if (
      values.resultStorage &&
      typeof values.resultStorage === "object" &&
      values.resultStorage.value
    ) {
      subtitle += ` - Store As: ${constants.variable(values.resultStorage)}`;
    }

    return subtitle;
  },

  async run(values, client, message, bridge) {
    const variable = bridge.get(values.variable);
    const patternType = values.patternType;
    const patternValue = values.patternValue || "";
    const inputValue = values.inputValue || "";
    let result;

    if (!variable || typeof variable !== "string") {
      return;
    }

    switch (patternType) {
      case "Repeat": {
        const repeatInterval = parseInt(patternValue, 10) || 1;
        result = variable
          .split("")
          .map((char, idx) => {
            if ((idx + 1) % repeatInterval === 0) {
              return inputValue + char;
            }
            return char;
          })
          .join("");
        break;
      }
      case "Change": {
        result = variable.replace(new RegExp(patternValue, "g"), inputValue);
        break;
      }
      case "Add To Front": {
        result = `${inputValue}${variable}`;
        break;
      }
      case "Add To End": {
        result = `${variable}${inputValue}`;
        break;
      }
      case "Add To Specific Position": {
        const position = parseInt(patternValue, 10) || 0;
        result = `${variable.slice(0, position)}${inputValue}${variable.slice(
          position
        )}`;
        break;
      }
      case "Store From Front": {
        const position = parseInt(inputValue, 10) || 0;
        result = variable.slice(0, position);
        break;
      }
      case "Store From End": {
        const position = parseInt(inputValue, 10) || 0;
        result = variable.slice(-position);
        break;
      }
      case "Store One Character": {
        const position = parseInt(inputValue, 10) || 0;
        result = variable.charAt(position);
        break;
      }
      default:
        result = variable;
        break;
    }

    if (
      values.resultStorage &&
      typeof values.resultStorage === "object" &&
      values.resultStorage.value
    ) {
      bridge.store(values.resultStorage, result);
    }
  },
};
