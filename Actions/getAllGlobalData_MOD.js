module.exports = {
  data: { name: "Get All Global Data" },
  category: "Global Data",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "ko-fi.com/slothyacedia"
  },

  UI: [
    {
      element: "store",
      storeAs: "store",
      name: "Store As"
    },
  ],

  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();
    bridge.store(values.store, storedData.lists);
  },
};
