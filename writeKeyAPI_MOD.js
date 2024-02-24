module.exports = {
    data: {
      name: "Write (Gift) Key API ",
    },
    category: "WebAPIs",
    info: {
      source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
      creator: "tao"
    },
    UI: [
      {
        element: "input",
        storeAs: "key",
        name: "Your key",
      },
      "-",
      {
        element: "storageInput",
        storeAs: "store",
        name: "Store Server Result As"
      },
    ],
  
    async run(values, interaction, client, bridge) {
      const key = bridge.transf(values.key)
      const api = `https://api.kennycarson.space/writekey.php?key=${key}`
  
      await fetch(api).then(
        async (response) => {
          let res = await response.json();
          bridge.store(values.store, res.result);
        }
      );
    },
  };
  