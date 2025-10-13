modVersion = "v1.0.0"
module.exports = {
  data: { name: "Get All Global Data" },
  category: "Global Data",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia"
  },

  UI: [
    {
      element: "store",
      storeAs: "store",
      name: "Store As"
    },
    {
      element: "text",
      text: modVersion
    }
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
