modVersion = "u.v1.0";
module.exports = {
  data: {
    name: "Object Conversions",
  },
  aliases: ["JSON Conversions", "JSON Magic"],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "JSON",
  UI: [
    {
      element: "variable",
      storeAs: "originalObj",
      name: "JSON Object / JSON String",
    },
    {
      element: "typedDropdown",
      storeAs: "convType",
      name: "Conversion",
      choices: {
        JSONstringify: { name: "JSON to String", field: false },
        JSONparse: { name: "String to JSON", field: false },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Converted Object As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `${values.convType.type} | Stored as: ${constants.variable(
      values.store
    )}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let toConv = bridge.get(values.originalObj);
    let conversionType = bridge.transf(values.convType.type);
    let convertedObj;

    function isJSONObject(obj) {
      return (
        obj !== null && typeof obj === "object" && obj.constructor === Object
      );
    }

    switch (conversionType) {
      case "JSONstringify":
        if (isJSONObject(toConv) == true) {
          convertedObj = JSON.stringify(toConv);
        } else {
          convertedObj = toConv;
          console.log(`${toConv} is not a object and can't be stringified!`);
        }

      case "JSONparse":
        obj = JSON.parse(toConv);
        if (isJSONObject(obj) == true) {
          convertedObj = obj;
        } else {
          convertedObj = toConv;
          console.log(
            `${toConv} is not a valid JSON and has not been turned into a object!`
          );
        }
    }

    bridge.store(values.store, convertedObj);
  },
};
