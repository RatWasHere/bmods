module.exports = {
	data: { name: "Get all global data" },
	category: "Global Data",
	UI: [
    {
      element: "store",
      storeAs: "store",
    }
  ],
  
  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`
  },
  
  compatibility: ["Any"],
  async run(values, message, client, bridge) {

    var storedData = bridge.data.IO.get();
    bridge.store(values.store, storedData.lists);
  }

}