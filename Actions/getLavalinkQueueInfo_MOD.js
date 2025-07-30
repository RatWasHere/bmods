modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Get Lavalink Queue Info",
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
        tracks: { name: "Tracks" },
        previousTracks: { name: "Previous Tracks" },
        currentTrack: { name: "Current Track" },
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
    return `Queue Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.infoAction.type
      ].name
    }`;
  },

  async run(values, message, client, bridge) {
    let player;
    if (values.playerVariable) {
      player = await bridge.get(values.playerVariable);
    }

    if (!player) {
      player = client.lavalink.getPlayer(message.guild.id);
    }

    if (!player) {
      return console.error("Player not found in Get Lavalink Queue Info");
    }

    let output;

    switch (values.infoAction.type) {
      case "tracks": {
        output = player.queue.tracks;
        break;
      }

      case "previousTracks": {
        output = player.queue.previous;
        break;
      }

      case "currentTrack": {
        output = player.queue.current;
        break;
      }
    }

    return bridge.store(values.store, output);
  },
};
