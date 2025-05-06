modVersion = "s.v1.0"
module.exports = {
  name: "Queue Start",
  nameSchemes: ["Store Voice Channel As"],
  initialize(client, data, run) {
    client.on('queueStart', (guild, channel) => {
        run([
          channel
        ], {guild})
    })
  }
};