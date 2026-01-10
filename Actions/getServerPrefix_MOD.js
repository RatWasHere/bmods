modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Get Server Prefix",
  },
  category: "Servers",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  UI: [
    {
      element: "text",
      text: "Get the current server prefix. If no custom prefix is set, it will return the global prefix.",
    },
    "-",
    {
      element: "input",
      storeAs: "guildID",
      name: "Guild ID (Optional)",
      placeholder: "Leave empty for current server",
    },
    "-",
    {
      element: "store",
      storeAs: "outputVariable",
      name: "Store Prefix As",
      placeholder: "Variable to store the prefix",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: (values) => {
    return `Get Server Prefix → ${values.guildID || "Command Guild"}`;
  },

  run: async (values, interaction, client, bridge) => {
    try {
      let guildID;
      if (values.guildID && values.guildID.trim()) {
        guildID = bridge.transf(values.guildID);
      } else {
        guildID = bridge.guild?.id;
      }

      const getServerPrefix = bridge.getGlobal({
        class: "serverPrefix",
        name: "getServerPrefix",
      });

      if (!getServerPrefix) {
        console.error(
          "Server Prefix Injection System not found! Make sure serverPrefixInject_MOD.js is loaded."
        );
        return;
      }

      const effectivePrefix = getServerPrefix(guildID);

      if (values.outputVariable) {
        bridge.store(values.outputVariable, effectivePrefix);
      }
    } catch (error) {
      console.error("Error getting server prefix:", error);
    }
  },
};

