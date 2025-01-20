modVersion = "v1.0";

module.exports = {
  data: {
    name: "Store Playlist Info",
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
      storeAs: "playlist",
      name: "Playlist",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "playlistInfo",
      name: "Playlist Info",
      choices: {
        title: { name: "Title" },
        tracks: { name: "Tracks" },
        description: { name: "Description" },
        thumbnail: { name: "Thumbnail" },
        source: { name: "Source" },
        author: { name: "Author" },
        url: { name: "URL" },
        length: { name: "Length" },
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
    return `Store Playlist Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.playlistInfo.type
      ].name
    }`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const playlist = await bridge.get(values.playlist);

    let result;
    switch (values.playlistInfo.type) {
      case "title": {
        result = playlist.title;
        break;
      }

      case "tracks": {
        result = playlist.tracks;
        break;
      }

      case "description": {
        result = playlist.description;
      }

      case "thumbnail": {
        result = playlist.thumbnail;
        break;
      }

      case "source": {
        result = playlist.source;
        break;
      }

      case "author": {
        result = playlist.author;
        break;
      }

      case "url": {
        result = playlist.url;
        break;
      }

      case "length": {
        result = playlist.videos?.length || playlist.tracks?.length || 0;
        break;
      }
    }

    bridge.store(values.store, result);
  },
};
