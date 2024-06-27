module.exports = {
  name: "Scheduled Event Create",
  nameSchemes: ["Store Scheduled Event As"],
  initialize(client, data, run) {
    client.on('guildScheduledEventCreate', (event) => {
      run([event], { event });
    });
  }
};
