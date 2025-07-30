module.exports = {
  data: {
    name: "Get Lavalink Track(s) Info",
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
      element: "variable",
      name: "Track(s) Variable",
      storeAs: "trackVariable",
    },
    "-",
    {
      element: "input",
      name: "Track Number",
      storeAs: "trackNumber",
      placeholder: "Only used for result or queue tracks (default: 0)",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "infoAction",
      name: "Info Action",
      choices: {
        title: { name: "Title" },
        author: { name: "Author" },
        duration: { name: "Duration" },
        artworkUrl: { name: "Artwork Url" },
        trackUrl: { name: "Track Url" },
        sourceName: { name: "Source Name" },
        isStream: { name: "Is Stream?" },
        requester: { name: "Requester" },
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
    return `Track Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.infoAction.type
      ].name
    }`;
  },

  async run(values, message, client, bridge) {
    const trackVariable = await bridge.get(values.trackVariable);
    let output;

    if (trackVariable.length && trackVariable.length > 1) {
      const trackNumber = Number(bridge.transf(values.trackNumber)) || 0;
      const track = trackVariable[trackNumber];

      if (!track) {
        throw new Error(
          `Track number ${trackNumber} does not exist in the provided variable.`
        );
      }

      switch (values.infoAction.type) {
        case "title": {
          output = track.info.title;
          break;
        }

        case "author": {
          output = track.info.author;
          break;
        }

        case "duration": {
          output = track.info.duration;
          break;
        }

        case "artworkUrl": {
          output = track.info.artworkUrl;
          break;
        }

        case "trackUrl": {
          output = track.info.uri;
          break;
        }

        case "sourceName": {
          output = track.info.sourceName;
          break;
        }

        case "isStream": {
          output = track.info.isStream;
          break;
        }

        case "requester": {
          output = track.requester;
          break;
        }
      }

      return bridge.store(values.store, output);
    }

    switch (values.infoAction.type) {
      case "title": {
        output = trackVariable.info.title;
        break;
      }

      case "author": {
        output = trackVariable.info.author;
        break;
      }

      case "duration": {
        output = trackVariable.info.duration;
        break;
      }

      case "artworkUrl": {
        output = trackVariable.info.artworkUrl;
        break;
      }

      case "trackUrl": {
        output = trackVariable.info.uri;
        break;
      }

      case "sourceName": {
        output = trackVariable.info.sourceName;
        break;
      }

      case "isStream": {
        output = trackVariable.info.isStream;
        break;
      }

      case "requester": {
        output = trackVariable.requester;
        break;
      }
    }

    return bridge.store(values.store, output);
  },
};
