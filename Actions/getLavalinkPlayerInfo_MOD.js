modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Get Lavalink Player Info",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "text",
      text: 'Leave player variable empty to use "current" player (fill in for events)',
    },
    "-",
    {
      element: "variable",
      name: "Player Variable",
      storeAs: "playerVariable",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "infoAction",
      name: "Info Action",
      choices: {
        exists: { name: "Exists" },
        guildId: { name: "Guild Id" },
        voiceChannelId: { name: "Voice Channel Id" },
        textChannelId: { name: "Text Channel Id" },
        isPlaying: { name: "Is Playing?" },
        isPaused: { name: "Is Paused?" },
        repeatMode: { name: "Repeat Mode" },
        volume: { name: "Volume" },
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
  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `Player Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.infoAction.type
      ].name
    }`;
  },

  async run(values, message, client, bridge) {
    let player = await bridge.get(values.playerVariable);
    let output;

    if (!player) {
      player = client.lavalink.getPlayer(message.guild.id);
    }

    if (!player) {
      return console.error("Player not found in Get Lavalink Player Info");
    }

    switch (values.infoAction.type) {
      case "exists": {
        output = !!player;
        break;
      }

      case "guildId": {
        output = player.guildId;
        break;
      }

      case "voiceChannelId": {
        output = player.voiceChannelId;
        break;
      }

      case "textChannelId": {
        output = player.textChannelId;
        break;
      }

      case "isPlaying": {
        output = player.playing;
        break;
      }

      case "isPaused": {
        output = player.paused;
        break;
      }

      case "repeatMode": {
        output = player.repeatMode;
        break;
      }

      case "volume": {
        output = player.volume;
        break;
      }
    }

    return bridge.store(values.store, output);
  },
};
