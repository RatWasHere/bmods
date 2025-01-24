modVersion = "v1.0.4";

module.exports = {
  data: {
    name: "Store Track Info",
  },
  category: "Discord-Player Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["discord-player"],
  UI: [
    {
      element: "var",
      storeAs: "track",
      name: "Track",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "trackInfo",
      name: "Track Info",
      choices: {
        title: { name: "Title" },
        description: { name: "Description" },
        author: { name: "Author" },
        url: { name: "URL" },
        thumbnail: { name: "Thumbnail" },
        duration: { name: "Duration" },
        requestedBy: { name: "Requested By" },
        playlist: { name: "Playlist" },
        live: { name: "Is Live?" },
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
  subtitle: (values, constants, thisAction) => {
    return `Store Track Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.trackInfo.type
      ].name
    }`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let track = await bridge.get(values.track);
    track = track[0] ? track[0] : track;

    let result;
    switch (values.trackInfo.type) {
      case "title": {
        result = track.title;
        break;
      }

      case "description": {
        result = track.description;
        break;
      }

      case "author": {
        result = track.author;
        break;
      }

      case "url": {
        result = track.url;
        break;
      }

      case "thumbnail": {
        result = track.thumbnail;
        break;
      }

      case "duration": {
        result = track.duration;
        break;
      }

      case "requestedBy": {
        result = track.requestedBy.id;
        break;
      }

      case "playlist": {
        result = track.playlist;
        break;
      }

      case "live": {
        result = track.live;
        break;
      }
    }

    bridge.store(values.store, result);
  },
};
