modVersion = "v1.0.2";

module.exports = {
  data: {
    name: "Control Music",
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
          placeholder: "Song Number",
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (values, constants, thisAction) => {
    return `Control Music - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.musicAction.type
      ].name
    }`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { useQueue, useHistory } = await client
      .getMods()
      .require("discord-player", "7.2.0-dev.2");
    const queue = useQueue(message.guild.id);

    switch (values.musicAction.type) {
      case "stopPlaying": {
        await queue.delete();
        break;
      }

      case "pauseMusic": {
        await queue.node.setPaused(true);
        break;
      }

      case "resumeMusic": {
        await queue.node.setPaused(false);
        break;
      }

      case "skipSong": {
        await queue.node.skip();
        break;
      }

      case "playPreviousSong": {
        const history = useHistory(msg.guild.id);
        await history.previous();
        break;
      }

      case "clearQueue": {
        await queue.clear();
        break;
      }

      case "shuffleQueue": {
        await queue.tracks.shuffle();
        break;
      }

      case "volume": {
        await queue.node.setVolume(
          Number(bridge.transf(values.musicAction.value))
        );
        break;
      }

      case "skipTo": {
        await queue.node.skipTo(
          Number(bridge.transf(values.musicAction.value)) - 1
        );
      }
    }
  },
};
