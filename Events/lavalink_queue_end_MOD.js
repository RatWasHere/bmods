module.exports = {
  name: "Lavalink Queue End",
  nameSchemes: ["Store Player As"],
  async initialize(client, data, run) {
    const sleep = require("util").promisify(setTimeout);
    // Wait for client.lavalink to be available.
    await sleep(3000);

    client.lavalink.on("queueEnd", (player) => {
      run([player], player);
    });
  },
};
