modVersion = "v1.0";
module.exports = {
  name: "Music Player Start",
  nameSchemes: ["Store Queue As", "Store Track As"],
  async initialize(client, data, run) {
    const sleep = require("util").promisify(setTimeout);
    // Wait for client.player to be available.
    await sleep(3000);

    client.player.events.on("playerStart", (queue, track) => {
      run([queue, track], queue, track);
    });
  },
};
