module.exports = {
  name: "Music Tracks Added",
  nameSchemes: ["Store Queue As", "Store Tracks As"],
  async initialize(client, data, run) {
    const sleep = require("util").promisify(setTimeout);
    // Wait for client.player to be available.
    await sleep(3000);

    client.player.events.on("audioTracksAdd", (queue, tracks) => {
      run([queue, tracks], queue, tracks);
    });
  },
};
