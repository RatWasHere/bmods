module.exports = {
  data: {
    name: "PostGres Query",
  },
  category: "Global Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  UI: [
    {
      element: "largeInput",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "variable",
      name: "Use Connection",
      storeAs: "storedConnection",
    },
    "-",
    {
      element: "toggle",
      name: "Stringify Result",
      storeAs: "toggle",
    },
    {
      element: "toggle",
      name: "Log Result to Console",
      storeAs: "logToConsole",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
  ],

  compatibility: ["Any"],
  run(values, message, client, bridge) {
    return new Promise(async (resolve, reject) => {
      const pgClient = bridge.get(values.storedConnection);

      if (!pgClient) {
        return reject("PostgreSQL connection not found.");
      }

      const queryString = bridge.transf(values.query);

      try {
        const result = await pgClient.query(queryString);
        const finalResult = values.toggle
          ? JSON.stringify(result.rows)
          : result.rows;

        if (values.logToConsole) {
          console.log(finalResult);
        }

        bridge.store(values.store, finalResult);
        resolve(finalResult);
      } catch (err) {
        console.error("Error executing PostgreSQL query:", err);
        reject(err);
      }
    });
  },
};
