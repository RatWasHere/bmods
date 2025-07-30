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
    const player = client.lavalink.getPlayer(bridge.guild.id);
    let output;

    if (!player) {
      return console.error("Player not found in Get Lavalink Queue Info");
    }

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
