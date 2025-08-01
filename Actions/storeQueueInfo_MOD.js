modVersion = "v1.0.5";

module.exports = {
  data: {
    name: "Store Queue Info",
  },
  category: "Discord-Player Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  modules: ["discord-player"],
  UI: [
    {
      element: "typedDropdown",
      storeAs: "queueInfo",
      name: "Queue Info",
      choices: {
        tracks: { name: "Tracks" },
        previousTrack: { name: "Previous Track" },
        repeatMode: { name: "Repeat Mode" },
        progressBar: { name: "Progress Bar" },
        currentTrack: { name: "Current Track" },
        isPlaying: { name: "Is Playing?" },
        queueObject: { name: "Queue Object" },
        queueSize: { name: "Queue Size" },
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
    return `Store Queue Info - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.queueInfo.type
      ].name
    }`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { useQueue, useHistory } = await client
      .getMods()
      .require("discord-player", "7.2.0-dev.2");
    const queue = useQueue(message.guild.id);
    const history = useHistory(message.guild.id);

    let result;
    switch (values.queueInfo.type) {
      case "tracks": {
        result = queue.tracks.data;
        break;
      }

      case "previousTrack": {
        result = history.previousTrack;
        break;
      }

      case "repeatMode": {
        result = queue.repeatMode;
        break;
      }

      case "progressBar": {
        result = queue.node.createProgressBar({ timecodes: true });
        break;
      }

      case "currentTrack": {
        result = queue.currentTrack;
        break;
      }

      case "isPlaying": {
        result = queue.node.isPlaying();
        break;
      }

      case "queueObject": {
        result = queue;
        break;
      }

      case "queueSize": {
        result = queue.tracks.size;
        break;
      }
    }

    bridge.store(values.store, result);
  },
};
