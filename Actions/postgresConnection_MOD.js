module.exports = {
  modules: ["pg"],
  data: {
    name: "PostGres Connection",
  },
  category: "Global Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "input",
      name: "Connection String",
      storeAs: "connectionString",
    },
    "-",
    {
      element: "input",
      name: "Max Retries",
      storeAs: "maxRetries",
    },
    {
      element: "toggle",
      name: "Ignore Self-Signed Cert Errors",
      storeAs: "ignoreCert",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Connection As",
      storeAs: "connectionStore",
    },
  ],

  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { Client } = await client.getMods().require("pg");

    return new Promise((resolve, reject) => {
      const connectionString = bridge.transf(values.connectionString);
      const maxRetries = parseInt(bridge.transf(values.maxRetries)) || 2;
      const ignoreCert = Boolean(values.ignoreCert);
      let retryCount = 0;

      const createConnection = () => {
        if (retryCount > maxRetries) {
          console.error("Maximum reconnection attempts reached. Aborting...");
          return reject(
            new Error(
              "Unable to connect to PostgreSQL database after multiple attempts."
            )
          );
        }

        const pgClient = new Client({
          connectionString,
          ssl: ignoreCert ? { rejectUnauthorized: false } : undefined,
        });

        pgClient.connect((err) => {
          if (err) {
            console.error(
              `Error connecting to PostgreSQL (attempt ${retryCount + 1}):`,
              err
            );
            retryCount++;
            setTimeout(createConnection, 2000);
            return;
          }

          console.log("PostgreSQL connection established.");
          bridge.store(values.connectionStore, pgClient);
          resolve(pgClient);
        });

        pgClient.on("error", (err) => {
          console.error("PostgreSQL client error:", err.message);
        });
      };

      createConnection();
    });
  },
};
