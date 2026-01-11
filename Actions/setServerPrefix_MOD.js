modVersion = "v1.0.0";

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
      text: "Set a custom prefix for the current server. Leave empty to reset to global prefix.",
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

  run: async (data, interaction, client, bridge) => {
    try {
      const guildID = bridge.guild?.id;

      if (!guildID) {
        const errorMsg = "This command can only be used in a server!";
        console.error(errorMsg);
        return;
      }

      const setServerPrefix = bridge.getGlobal({
        class: "serverPrefix",
        name: "setServerPrefix",
      });

      if (!setServerPrefix) {
        const errorMsg =
          "Server Prefix Injection System not found! Make sure serverPrefixInject_MOD.js is loaded.";
        console.error(errorMsg);
        return;
      }

      const newPrefix = bridge.transf(data.serverPrefix || "");

      const success = setServerPrefix(guildID, newPrefix);

      if (!success) {
        console.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = `Error setting server prefix: ${error.message}`;
      console.error(errorMsg, error);
    }
  },
};
