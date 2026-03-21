modVersion = "v1.1.0";

module.exports = {
  data: {
    name: "Set Server Prefix",
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
      text: "Set a custom prefix for the a server. Leave empty to reset to global prefix.",
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
      element: "input",
      storeAs: "serverPrefix",
      name: "Server Prefix",
      placeholder: "Enter new prefix (e.g., !, ?, $, >)",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: (data) => {
    return `Set Server Prefix: "${data.serverPrefix || "Reset to Global"}"`;
  },

  run: async (values, interaction, client, bridge) => {
    try {
      let guildID;
      if (values.guildID && values.guildID.trim()) {
        guildID = bridge.transf(values.guildID);
      } else {
        guildID = bridge.guild?.id;
      }

      if (!guildID) {
        return console.error("Guild ID is required to set a server prefix!");
      }

      const setServerPrefix = bridge.getGlobal({
        class: "serverPrefix",
        name: "setServerPrefix",
      });

      if (!setServerPrefix) {
        return console.error(
          "Server Prefix Injection System not found! Make sure serverPrefixInject_MOD.js is loaded.",
        );
      }

      const newPrefix = bridge.transf(values.serverPrefix || "");

      const success = setServerPrefix(guildID, newPrefix);

      if (!success) {
        console.error(
          "Failed to set server prefix. Check console for details.",
        );
      }
    } catch (error) {
      console.error(`Error setting server prefix: ${error.message}`, error);
    }
  },
};
