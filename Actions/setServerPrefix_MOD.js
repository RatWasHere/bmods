const modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Set Server Prefix",
  },
  category: "Server Management",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "input",
      name: "New Prefix",
      placeholder: "The new prefix for this server (e.g., !, ?, .)",
      storeAs: "prefixToSet",
    },
    {
      element: "storageInput",
      name: "Store Error Message As",
      placeholder: "Optional: Store any error message if it fails.",
      storeAs: "storeErrorAs",
    },
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If Error",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: (data) => {
    return `Set Prefix: ${data.prefixToSet}`;
  },

  async run(values, message, client, bridge) {
    try {
      if (!message.guildID) {
        const errorMessage = "This action can only be used in a server.";
        if (values.storeErrorAs) {
          bridge.store(values.storeErrorAs, errorMessage);
        }
        if (values.storeSuccessAs) {
          bridge.store(values.storeSuccessAs, false);
        }
        return;
      }

      const newPrefix = bridge.transf(values.prefixToSet);

      // Validate the prefix
      if (typeof newPrefix !== "string" || newPrefix.length === 0) {
        const errorMessage =
          "Invalid prefix provided. Prefix must be a non-empty string.";
        if (values.storeErrorAs) {
          bridge.store(values.storeErrorAs, errorMessage);
        }
        if (values.storeSuccessAs) {
          bridge.store(values.storeSuccessAs, false);
        }
        return;
      }

      // Get the current stored data
      const storedData = bridge.data.IO.get();

      // Ensure 'guildPrefixes' object exists
      if (!storedData.guildPrefixes) {
        storedData.guildPrefixes = {};
      }

      // Store the new prefix for this guild
      storedData.guildPrefixes[message.guildID] = newPrefix;

      // Write the updated data back to storedData.json
      bridge.data.IO.write(storedData);

      if (values.storeSuccessAs) {
        bridge.store(values.storeSuccessAs, true);
      }
    } catch (err) {
      const errorMessage = `Failed to set prefix: ${err.message}`;
      console.error(errorMessage, err);
      if (values.storeErrorAs) {
        bridge.store(values.storeErrorAs, errorMessage);
      }
      if (values.storeSuccessAs) {
        bridge.store(values.storeSuccessAs, false);
      }
    }
  },
};
