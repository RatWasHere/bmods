module.exports = {
  data: {
    name: "Calculate Expression",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
  },
  category: "Numbers",
  UI: [
    {
      element: "input",
      name: "Operation",
      storeAs: "operation",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
    "-",
    {
      element: "case",
      name: "If there is an error",
      storeAs: "noResults",
      storeActionsAs: "noResultsActions",
    },
  ],
  subtitle: (data, constants) => {
    return `${data.operation} - Store Result As ${constants.variable(
      data.store
    )}`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const { evaluate } = require("mathjs");

    try {
      let result = 0;
      result = evaluate(bridge.transf(values.operation));

      bridge.store(values.store, result);
    } catch (error) {
      bridge.call(values.noResults, values.noResultsActions);
    }
  },
};
