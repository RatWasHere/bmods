/*
  MySQL Query with Stored Connection by candiedapple
  Licensed under MIT License

  Execute a MySQL query using a stored connection.
*/
module.exports = {
  data: {
    name: "MySQL Query",
  },
  category: "Global Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
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
    return new Promise((resolve, reject) => {
      // Retrieve stored connection
      const connection = bridge.get(values.storedConnection);

      if (!connection) {
        reject("MySQL connection not found.");
        return;
      }

      // Function to execute a query and get result
      function executeQuery(query) {
        return new Promise((resolve, reject) => {
          connection.query(query, (error, results) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(results);
          });
        });
      }

      // Executing the query
      const queryString = bridge.transf(values.query);
      executeQuery(queryString)
        .then((results) => {
          if (values.toggle) {
            const stringifiedResults = JSON.stringify(results);
            bridge.store(values.store, stringifiedResults);
            resolve(stringifiedResults);
          } else {
            bridge.store(values.store, results);
            resolve(results);
          }
          if (values.logToConsole) {
            console.log(results);
          }
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  },
};