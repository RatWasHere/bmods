modVersion = "v1.0.6";

module.exports = {
  data: {
    name: "Play Music",
  },
  category: "Discord-Player Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: [
    "discord-player",
    "@discord-player/extractors",
    "discord-player-youtubei",
  ],
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true,
    },
    "-",
    {
      element: "input",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "toggle",
      storeAs: "leaveOnEnd",
      name: "Leave On End?",
    },
    {
      element: "toggle",
      storeAs: "leaveOnEmpty",
      name: "Leave On Empty?",
    },
    {
      element: "toggle",
      storeAs: "leaveOnStop",
      name: "Leave On Stop?",
    },
    {
      element: "toggle",
      storeAs: "selfDeaf",
      name: "Self Deaf?",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Track As",
      storeAs: "store",
    },
    "-",
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
  subtitle: (data, constants) => {
    return `Play: ${data.query}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const channel = await bridge.getChannel(values.channel);
    const query = await bridge.transf(values.query);

    try {
      const { track } = await client.player.play(channel.id, query, {
        requestedBy: message.author?.id || message.user?.id,
        nodeOptions: {
          metadata: { channel: message.channel.id },
          leaveOnEnd: values.leaveOnEnd,
          leaveOnEmpty: values.leaveOnEmpty,
          leaveOnStop: values.leaveOnStop,
          selfDeaf: values.selfDeaf,
        },
      });

      return bridge.store(values.store, track);
    } catch (error) {
      console.log("Play Music Error", error);
      bridge.runner(values.ifError, values.ifErrorActions);
    }
  },

  startup: async (bridge, client) => {
    // discord.js is required for discord-player, but it is not used as the client at all.
    try {
      await client.getMods().require("discord.js", "14.17.3");
      const { Player, createOceanicCompat } = await client
        .getMods()
        .require("discord-player", "7.2.0-dev.2");
      const { DefaultExtractors } = await client
        .getMods()
        .require("@discord-player/extractor");
      // bgutils-js required for discord-player-youtubei, breaks if not loaded
      await client.getMods().require("bgutils-js");
      const { YoutubeiExtractor } = await client
        .getMods()
        .require("discord-player-youtubei", "1.4.6");

      client.player = new Player(createOceanicCompat(client));

      await client.player.extractors.loadMulti(DefaultExtractors);

      await client.player.extractors.register(YoutubeiExtractor, {});

      client.player.events
        .on("playerError", (queue, error) => {
          console.log("[Discord-Player] Player Error:", error);
        })
        .on("error", (queue, error) => {
          console.log("[Discord-Player] Error:", error);
        });

      /*
      client.player
        .on("debug", console.log)
        .events.on("debug", (queue, msg) =>
          console.log(`[${queue.guild.name}] ${msg}`)
        );
        */
    } catch (error) {
      console.error(error);
    }
  },
};
