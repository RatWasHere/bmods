/*
  Mysql Query mod by candiedapple
  Licensed under MIT License

  Lets you send mysql query to your database on Bot Maker For Discord.
*/
module.exports = {
  data: {
    name: "MySQL Query",
  },
  category: "Global Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
  },
  UI: [
    {
      element: "input",
      name: "Host",
      storeAs: "host",
    },
    "-",
    {
      element: "input",
      name: "User",
      storeAs: "user",
    },
    "-",
    {
      element: "input",
      name: "Password",
      storeAs: "password",
    },
    "-",
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
      // Importing required modules
      const mysql = require("mysql");

      // MySQL connection configuration
      const connection = mysql.createConnection({
        host: bridge.transf(values.host),
        user: bridge.transf(values.user),
        password: bridge.transf(values.password),
        database: bridge.transf(values.database),
      });

      // Establishing connection to the database
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL database:", err);
          reject(err);
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
            // Closing connection when done
            connection.end((err) => {
              if (err) {
                console.error("Error closing MySQL connection:", err);
              }
            });
          });
      });
    });
  },
};
