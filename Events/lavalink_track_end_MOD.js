module.exports = {
  name: "Lavalink Track End",
  nameSchemes: ["Store Player As", "Store Track As"],
  async initialize(client, data, run) {
    const sleep = require("util").promisify(setTimeout);
    // Wait for client.lavalink to be available.
    await sleep(3000);

    client.lavalink.on("trackEnd", (player, track) => {
      run([player, track], player, track);
    });
  },
};
