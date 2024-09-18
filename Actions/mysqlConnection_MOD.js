/*
  MySQL Connection mod by candiedapple
  Licensed under MIT License

  This module connects to a MySQL database and provides the connection for reuse in other modules.
*/

module.exports = {
  modules: ["mysql2"],
  data: {
    name: "MySQL Connection",
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
      element: "storageInput",
      name: "Store Connection As",
      storeAs: "connectionStore",
    },
  ],

  compatibility: ["Any"],
  run(values, message, client, bridge) {
    const mysql = require("mysql2");
    return new Promise((resolve, reject) => {
      // Check for missing required fields
      if (!values.host || !values.user || !values.password || !values.database) {
        return reject(new Error("Missing required fields"));
      }

      // Function to create and establish a MySQL connection
      const createConnection = () => {
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
            setTimeout(createConnection, 2000); // Retry after 2 seconds
            return;
          }

          // Store the connection for reuse
          bridge.store(values.connectionStore, connection);

          console.log("MySQL Connection established and stored for", values.host, values.database);
          resolve(connection);
        });

        // Handle connection errors and attempt to reconnect
        connection.on('error', (err) => {
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error("MySQL connection lost. Attempting to reconnect...");
            createConnection();
          } else {
            console.error("MySQL connection error:", err);
          }
        });
      };

      // Create the initial connection
      createConnection();
    });
  },
};