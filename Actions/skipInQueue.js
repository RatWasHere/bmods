modVersion = "s.v1.0 | AceFix";
module.exports = {
  data: {
    name: "Skip In Queue",
    skip: 1,
  },
  UI: [
    {
      element: "input",
      name: "Skip Over # Songs",
      placeholder: "Number (#)",
      storeAs: "skip",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],
  category: "Music",
  subtitle: (data, constants) => {
    return `Skip: ${data.skip}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    utilities.queue.splice(0, Number(bridge.transf(values.skip)) - 1);
    utilities.forgiveIdling = true;
    utilities.player.stop();
    // if (utilities.queue[0]) {
    //   utilities.player.play(utilities.queue[0].audio);
    //   utilities.nowPlaying = utilities.queue[0];
    //   utilities.queue.splice(0,1)
    // }

    // if (utilities.queue.length == 0) {
    //   client.emit('queueEnd', bridge.guild, utilities.channel)
    // }
  },
};
