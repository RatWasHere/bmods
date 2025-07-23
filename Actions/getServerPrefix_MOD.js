const modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Get Server Prefix",
  },
  category: "Server Management",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "storageInput",
      name: "Store Prefix As",
      storeAs: "storePrefixAs",
    },
    {
      element: "storageInput",
      name: "Store Error Message As",
      placeholder: "Optional: Store any error message if it fails.",
      storeAs: "storeErrorAs",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    try {
      const data = require("../data.json");

      if (!message.guildID) {
        const errorMessage = "This action can only be used in a server";
        if (values.storeErrorAs) {
          bridge.store(values.storeErrorAs, errorMessage);
        }
        // Fallback to default if not in a guild
        if (values.storePrefixAs) {
          bridge.store(values.storePrefixAs, data.prefix); // data.prefix is the global default
        }
        return;
      }

      // Get the current stored data
      const storedData = bridge.data.IO.get();

      // Retrieve the prefix for this guild
      let currentPrefix = storedData.guildPrefixes?.[message.guildID];

      // If no custom prefix is set, use the global default
      if (typeof currentPrefix !== "string" || currentPrefix.length === 0) {
        currentPrefix = data.prefix; // Fallback to global default prefix
      }

      if (values.storePrefixAs) {
        bridge.store(values.storePrefixAs, currentPrefix);
      }
    } catch (err) {
      const errorMessage = `Failed to get prefix: ${err.message}`;
      console.error(errorMessage, err);
      if (values.storeErrorAs) {
        bridge.store(values.storeErrorAs, errorMessage);
      }
      // Always store default prefix on error if variable is provided
      if (values.storePrefixAs) {
        bridge.store(values.storePrefixAs, data.prefix);
      }
    }
  },
};
