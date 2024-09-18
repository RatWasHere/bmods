module.exports = {
  modules: ["sqlite3"],
  data: {
    name: "SQLite Query",
  },
  category: "Global Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      name: "Database",
      storeAs: "database",
    },
    "-",
    {
      element: "largeInput",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "toggle",
      name: "Stringify Result",
      storeAs: "toggle",
    },
    {
      element: "toggle",
      name: "Log Result to Console", // Toggle to log results to console
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
      const sqlite3 = require("sqlite3").verbose(); // Require sqlite3 module

      const dbPath = bridge.file(values.database);
      // Open the database file
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("Error opening SQLite database:", err);
          reject(err);
          return;
        }

        // Function to execute a query and get result
        function executeQuery(query) {
          return new Promise((resolve, reject) => {
            db.all(query, (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(results);
            });
          });
        }

        // Sample query
        const queryString = bridge.transf(values.query);

        // Executing the query
        executeQuery(queryString)
          .then((results) => {
            if (values.toggle) {
              const stringifiedResults = JSON.stringify(results); // Stringify the results
              bridge.store(values.store, stringifiedResults); // Store the stringified results
              resolve(stringifiedResults); // Resolve with the stringified results
            } else {
              bridge.store(values.store, results); // Store the non-stringified results
              resolve(results); // Resolve with the non-stringified results
            }
            if (values.logToConsole) {
              // Check if logging to console is enabled
              console.log(results); // Log the results to console
            }
          })
          .catch((error) => {
            console.error("Error executing query:", error);
            reject(error);
          })
          .finally(() => {
            // Close the database connection
            db.close((err) => {
              if (err) {
                console.error("Error closing SQLite connection:", err);
              }
            });
          });
      });
    });
  },
};
