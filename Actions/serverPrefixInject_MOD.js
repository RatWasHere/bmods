modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Server Prefix Injection",
  },
  category: "Server Management",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "text",
      text: "Server prefix injection system that allows setting custom prefixes for each server.",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: () => {
    return `Server Prefix Injection System (Auto-Setup)`;
  },

  startup: async (bridge, client) => {
    console.log(`Initializing Server Prefix Injection System ${modVersion}...`);

    const mainData = require(require("path").join(__dirname, "../data.json"));

    const getEffectivePrefix = (guildID) => {
      try {
        const storedData = bridge.data.IO.get();
        const guildPrefix = storedData?.guildPrefixes?.[guildID];

        if (
          guildPrefix &&
          typeof guildPrefix === "string" &&
          guildPrefix.length > 0
        ) {
          return guildPrefix;
        } else {
          return mainData.prefix; // Fallback to global prefix
        }
      } catch (e) {
        console.error("Error fetching custom prefix:", e);
      }

      return mainData.prefix;
    };

    client.prependListener("messageCreate", async (msg) => {
      if (msg.author.id === client.application.id) return;

      if (!msg.guildID) return;

      const customPrefix = getEffectivePrefix(msg.guildID);
      const defaultPrefix = mainData.prefix;

      if (customPrefix === defaultPrefix) return;

      if (msg.content.startsWith(customPrefix)) {
        const modifiedContent =
          defaultPrefix + msg.content.substring(customPrefix.length);
        msg.content = modifiedContent;
      } else if (msg.content.startsWith(defaultPrefix)) {
        msg.content = "BLOCKED_DEFAULT_PREFIX" + msg.content;
      }
    });

    bridge.createGlobal({
      class: "serverPrefix",
      name: "setServerPrefix",
      value: (guildID, prefix) => {
        try {
          const storedData = bridge.data.IO.get() || {};
          if (!storedData.guildPrefixes) storedData.guildPrefixes = {};

          if (prefix && prefix.length > 0) {
            storedData.guildPrefixes[guildID] = prefix;
          } else {
            delete storedData.guildPrefixes[guildID];
          }

          bridge.data.IO.write(storedData);
          return true;
        } catch (error) {
          console.error("Error setting server prefix:", error);
          return false;
        }
      },
    });

    bridge.createGlobal({
      class: "serverPrefix",
      name: "getServerPrefix",
      value: getEffectivePrefix,
    });

    bridge.createGlobal({
      class: "serverPrefix",
      name: "removeServerPrefix",
      value: (guildID) => {
        try {
          const storedData = bridge.data.IO.get() || {};
          if (storedData.guildPrefixes?.[guildID]) {
            delete storedData.guildPrefixes[guildID];
            bridge.data.IO.write(storedData);
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error removing server prefix:", error);
          return false;
        }
      },
    });

    bridge.createGlobal({
      class: "serverPrefix",
      name: "getAllServerPrefixes",
      value: () => {
        try {
          return bridge.data.IO.get()?.guildPrefixes || {};
        } catch (error) {
          console.error("Error getting all server prefixes:", error);
          return {};
        }
      },
    });

    console.log("Server Prefix Injection System loaded successfully!");
  },

  run: async (data, interaction, client, bridge) => {
    console.log("Server Prefix Injection System is already active!");
  },
};
