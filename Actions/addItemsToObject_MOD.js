module.exports = {
  data: {
    name: "Add Items to Object",
  },

  category: "Objects",

  UI: [
    {
      element: "variable",
      storeAs: "object",
      name: "Object",
    },
    "-",
    {
      element: "menu",
      storeAs: "keyValuePairs",
      name: "Key-Value Pairs",
      types: {
        keyValuePair: "keyValuePair",
      },
      max: 1000,
      UItypes: {
        keyValuePair: {
          data: {},
          name: "Key-Value Pair",
          preview:
            "`${option.data.keyValue ? `Key: ${option.data.key} | Value: ${option.data.keyValue}` : `Key: ${option.data.key} | Value: (Delete Key)`}`",
          UI: [
            {
              element: "input",
              storeAs: "key",
              name: "key",
            },
            "-",
            {
              element: "input",
              storeAs: "keyValue",
              name: "Value",
              placeholder: "An empty value deletes the key",
            },
          ],
        },
      },
    },
  ],

  subtitle: (values, constants, thisAction) => {
    return `Make ${values.keyValuePairs.length} Key-Value Pairs To Object ${constants.variable(values.object)}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const object = bridge.get(values.object);
    const directVariableTypes = {
      tempVars: "tempVar",
      serverVars: "serverVar",
      globalVars: "globVar",
    };

    for (const keyValuePair of values.keyValuePairs) {
      const keyValuePairData = keyValuePair.data;

      const key = bridge.transf(keyValuePairData.key);
      const valueInput = keyValuePairData.keyValue;
      const directVariable =
        typeof valueInput === "string" &&
        valueInput
          .trim()
          .match(
            /^\$\{\s*(tempVars|serverVars|globalVars)\(\s*(['"])(.*?)\2\s*\)\s*\}$/,
          );

      if (!key) continue;
      try {
        const value = directVariable
          ? bridge.get({
              type: directVariableTypes[directVariable[1]],
              value: directVariable[3],
            })
          : bridge.transf(valueInput ?? "");
        if (value === "") {
          delete object[key];
        } else {
          object[key] = value;
        }
      } catch (e) {
        console.error(e);
      }
    }

    bridge.store(values.object, object);
  },
};
