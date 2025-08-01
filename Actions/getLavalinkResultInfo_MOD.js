module.exports = {
  data: {
    name: "Get Lavalink Result Info",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "variable",
      name: "Result Variable",
      storeAs: "resultVariable",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "infoAction",
      name: "Information Action",
      choices: {
        loadType: { name: "Load Type" },
        playlist: { name: "Playlist" },
        tracks: { name: "Tracks" },
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
      text: '"Playlist" will be null if no playlist was loaded.',
    },
    {
      element: "text",
      text: 'Load type will be "search", "track", "playlist", or "error".',
    },
  ],
  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `Result Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.infoAction.type
      ].name
    }`;
  },

  async run(values, message, client, bridge) {
    const result = bridge.get(values.resultVariable);
    let output;

    switch (values.infoAction.type) {
      case "loadType": {
        output = result.loadType;
        break;
      }

      case "playlist": {
        output = result.playlist;
        break;
      }

      case "tracks": {
        output = result.tracks;
        break;
      }
    }

    return bridge.store(values.store, output);
  },
};
