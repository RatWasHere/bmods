module.exports = {
  category: "Objects",
  data: { name: "Create Object" },
  UI: [
    {
      element: "storageInput",
      storeAs: "object",
      name: "Store Object As",
    },
  ],

  subtitle: (data, constants) => {
    return `${constants.variable(data.object)}`;
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    bridge.store(values.object, {});
  },
};
