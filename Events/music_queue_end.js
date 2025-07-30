module.exports = {
  name: "Music Queue End",
  nameSchemes: ["Store Queue As"],
  async initialize(client, data, run) {
    const sleep = require("util").promisify(setTimeout);
    // Wait for client.player to be available.
    await sleep(3000);

    client.player.events.on("emptyQueue", (queue) => {
      run([queue], queue);
    });
  },
};
