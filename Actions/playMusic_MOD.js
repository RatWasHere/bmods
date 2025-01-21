modVersion = "v1.0.1";

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
      element: "typedDropdown",
      storeAs: "leaveOnEnd",
      name: "Leave On End?",
      choices: {
        true: { name: "True" },
        false: { name: "False" },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "leaveOnEmpty",
      name: "Leave On Empty?",
      choices: {
        true: { name: "True" },
        false: { name: "False" },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "leaveOnStop",
      name: "Leave On Stop?",
      choices: {
        true: { name: "True" },
        false: { name: "False" },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "selfDeaf",
      name: "Self Deaf?",
      choices: {
        true: { name: "True" },
        false: { name: "False" },
      },
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
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
        requestedBy: message.author.id,
        nodeOptions: {
          metadata: { channel: message.channel.id },
          leaveOnEnd: !!bridge.transf(values.leaveOnEnd.value),
          leaveOnEmpty: !!bridge.transf(values.leaveOnEmpty.value),
          leaveOnStop: !!bridge.transf(values.leaveOnStop.value),
          selfDeaf: !!bridge.transf(values.selfDeaf.value),
        },
      });

      return bridge.store(values.store, track);
    } catch (error) {
      // noop
    }
  },

  startup: async (bridge, client) => {
    // discord.js is required for discord-player, but it is not used as the client at all.
    await client.getMods().require("discord.js", "14.17.3");
    const { Player, createOceanicCompat } = await client
      .getMods()
      .require("discord-player", "7.2.0-dev.0");
    const { DefaultExtractors } = await client
      .getMods()
      .require("@discord-player/extractor");
    const { YoutubeiExtractor } = await client
      .getMods()
      .require("discord-player-youtubei");

    client.player = new Player(createOceanicCompat(client));

    await client.player.extractors.loadMulti(DefaultExtractors);

    await client.player.extractors.register(YoutubeiExtractor, {});
  },
};
