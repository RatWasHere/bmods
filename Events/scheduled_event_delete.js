module.exports = {
  name: "Scheduled Event Delete",
  nameSchemes: ["Store Scheduled Event As"],
  initialize(client, data, run) {
    client.on('guildScheduledEventDelete', (event) => {
      run([event], { event });
    });
  }
};
