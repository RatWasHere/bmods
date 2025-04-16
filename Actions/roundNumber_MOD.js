module.exports = {
  data: {
    name: "Round Number",
  },
  category: "Numbers",
  UI: [
    {
      element: "input",
      name: "Number To Round",
      storeAs: "number",
    },
    "-",
    {
      element: "typedDropdown",
      name: "Rounding Method",
      storeAs: "roundType",
      choices: {
        normal: { name: "Round To Nearest Whole Number" },
        ceil: { name: "Round Up To Whole Number (Ceiling)" },
        floor: { name: "Round Down To Whole Number (Floor)" },
        decimal: { name: "Round To Specific Decimal Places" },
      },
    },
    "-",
    {
      element: "input",
      name: "Decimal Places (for 'Decimal' method)",
      storeAs: "decimalPlaces",
      placeholder: "Enter 0 for whole number",
      type: "number",
      min: 0,
    },
    "-",
    {
      element: "storageInput",
      name: "Store Rounded Number As",
      storeAs: "store",
    },
  ],
  subtitle: (data, constants) => {
    let operationText = "";
    switch (data.roundType?.type) {
      case "normal":
        operationText = "Round Nearest Whole";
        break;
      case "ceil":
        operationText = "Round Up Whole";
        break;
      case "floor":
        operationText = "Round Down Whole";
        break;
      case "decimal":
        operationText = `Round To ${data.decimalPlaces || 0} Decimals`;
        break;
      default:
        operationText = "Round";
        break;
    }
    return `${
      data.number || "Input Number"
    } ${operationText} - Store As ${constants.variable(data.store)}`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const numberInput = bridge.transf(values.number);
    let number = Number(numberInput);

    if (isNaN(number)) {
      console.error(`Invalid input number: "${numberInput}". Could not round.`);
      bridge.store(values.store, undefined);
      return;
    }

    let result;
    const roundMethod = values.roundType?.type;
    let decimalPlaces = parseInt(bridge.transf(values.decimalPlaces), 10);

    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
      decimalPlaces = 0;
    }

    switch (roundMethod) {
      case "normal":
        result = Math.round(number);
        break;
      case "ceil":
        result = Math.ceil(number);
        break;
      case "floor":
        result = Math.floor(number);
        break;
      case "decimal":
        result = parseFloat(number.toFixed(decimalPlaces));
        break;
      default:
        console.warn(
          `Unknown rounding method: "${roundMethod}". Defaulting to normal round.`
        );
        result = Math.round(number);
        break;
    }

    bridge.store(values.store, result);
  },
};
