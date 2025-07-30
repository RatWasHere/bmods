module.exports = {
  data: {
    name: "Play Lavalink Music",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/ratWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "channel",
      name: "Voice Channel",
      storeAs: "voiceChannel",
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
      storeAs: "selfDeaf",
      name: "Self Deaf?",
    },
    "-",
    {
      element: "input",
      name: "Default Volume",
      storeAs: "defaultVolume",
      placeholder: "Leave blank for 100",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
    "-",
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If Error",
    },
  ],
  compatibility: ["Any"],

  subtitle: (data, constants) => {
    return `Play: ${data.query}`;
  },

  async run(values, message, client, bridge) {
    const voiceChannel = await bridge.getChannel(values.voiceChannel);
    const query = bridge.transf(values.query);

    if (!voiceChannel) {
      console.log("Voice channel not found or not specified.");
      return bridge.runner(values.ifError, values.ifErrorActions);
    }

    if (!client.lavalink.nodeManager.nodes.size) {
      console.log("No lavalink connection found, please connect first.");
      return bridge.runner(values.ifError, values.ifErrorActions);
    }

    try {
      let player = client.lavalink.getPlayer(message.guild.id);

      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: message.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: message.channel.id,
          selfDeaf: values.selfDeaf,
          selfMute: false,
        });
      }

      if (!player.connected) {
        await player.connect();
      }

      if (values.defaultVolume) {
        const volume = bridge.transf(values.defaultVolume);
        await player.setVolume(Number(volume));
      }

      const result = await player.search(
        {
          query,
          source: "ytsearch",
        },
        message.author || message.user
      );

      if (!result || !result.tracks || result.tracks.length === 0) {
        console.log("No tracks found for the query:", query);
        return bridge.runner(values.ifError, values.ifErrorActions);
      }

      if (result.loadType === "playlist") {
        await player.queue.add(result.tracks);
      } else {
        await player.queue.add(result.tracks[0]);
      }

      // Start playing if not already playing
      if (!player.playing && !player.paused) {
        await player.play();
      }

      return bridge.store(values.store, result);
    } catch (error) {
      console.log("Lavalink Music Error", error);
      bridge.runner(values.ifError, values.ifErrorActions);
    }
  },
};
