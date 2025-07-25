modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Control Lavalink Music",
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
      storeAs: "musicAction",
      name: "Music Action",
      choices: {
        stopPlaying: { name: "Stop Playing" },
        pauseMusic: { name: "Pause Music" },
        resumeMusic: { name: "Resume Music" },
        skipSong: { name: "Skip Song" },
        playPreviousSong: { name: "Play Previous Song" },
        clearQueue: { name: "Clear Queue" },
        shuffleQueue: { name: "Shuffle Queue" },
        volume: { name: "Set Volume", field: true },
        skipTo: {
          name: "Skip To",
          field: true,
          placeholder: "Track Number",
        },
        removeTrack: {
          name: "Remove Track",
          field: true,
          placeholder: "Track Number",
        },
        repeatMode: { name: "Set Repeat Mode" },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "repeatMode",
      name: "Repeat Mode",
      choices: {
        off: { name: "Off" },
        track: { name: "Track" },
        queue: { name: "Queue" },
      },
    },
    "-",
    {
      element: "text",
      text: "Will do nothing if no music is playing, no previous track or incorrect track numbers.",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  script: (values) => {
    function refreshElements() {
      type = values.data.musicAction.type;
      switch (type) {
        case "repeatMode":
          values.UI[1].element = "typedDropdown";
          break;

        default:
          values.UI[1].element = " ";
          break;
      }

      setTimeout(() => {
        values.updateUI();
      }, values.commonAnimation * 100);
    }

    refreshElements();

    values.events.on("change", () => {
      refreshElements();
    });
  },

  subtitle: (values, constants, thisAction) => {
    return `Control Music - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.musicAction.type
      ].name
    }`;
  },

  async run(values, message, client, bridge) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player) return;

    switch (values.musicAction.type) {
      case "stopPlaying": {
        await player.destroy();
        break;
      }

      case "pauseMusic": {
        await player.pause();
        break;
      }

      case "resumeMusic": {
        await player.resume();
        break;
      }

      case "skipSong": {
        await player.skip();
        break;
      }

      case "playPreviousSong": {
        const previousTrack = await player.queue.shiftPrevious();
        if (!previousTrack) {
          break;
        }

        await player.play({ clientTrack: previousTrack });
        break;
      }

      case "clearQueue": {
        await player.queue.tracks.splice(0);
        break;
      }

      case "shuffleQueue": {
        await player.queue.shuffle();
        break;
      }

      case "volume": {
        await player.setVolume(Number(bridge.transf(values.musicAction.value)));
        break;
      }

      case "skipTo": {
        const trackNumber = Number(bridge.transf(values.musicAction.value)) - 1;

        if (!player.queue[index]) {
          break;
        }

        await player.queue.splice(0, trackNumber);
        await player.skip();
        break;
      }

      case "removeTrack": {
        const ql = player.queue.tracks.length;
        const trackNumber = Number(bridge.transf(values.musicAction.value)) - 1;

        if (trackNumber < 0 || trackNumber >= ql || !player.queue[index]) {
          break;
        }

        await player.queue.remove(trackNumber);
        break;
      }

      case "repeatMode": {
        switch (values.repeatMode.type) {
          case "off": {
            await player.setRepeatMode("off");
            break;
          }
          case "track": {
            await player.setRepeatMode("track");
            break;
          }
          case "queue": {
            await player.setRepeatMode("queue");
            break;
          }
        }
      }
    }
  },
};
