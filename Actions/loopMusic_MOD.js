modVersion = "v1.0.5";

module.exports = {
  data: {
    name: "Loop Music",
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
      name: "Loop Action",
      choices: {
        off: { name: "Off" },
        track: { name: "Loop Current Track" },
        queue: { name: "Loop Current Queue" },
        autoplay: { name: "Autoplay" },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (values, constants, thisAction) => {
    return `LoopMusic - ${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.musicAction.type
      ].name
    }`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { useQueue, QueueRepeatMode } = await client
      .getMods()
      .require("discord-player", "7.2.0-dev.2");
    const queue = useQueue(message.guild.id);

    switch (values.musicAction.type) {
      case "off": {
        await queue.setRepeatMode(QueueRepeatMode.OFF);
        break;
      }

      case "track": {
        await queue.setRepeatMode(QueueRepeatMode.TRACK);
        break;
      }

      case "queue": {
        await queue.setRepeatMode(QueueRepeatMode.QUEUE);
        break;
      }

      case "autoplay": {
        await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        break;
      }
    }
  },
};
