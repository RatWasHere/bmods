module.exports = {
  name: "Scheduled Event User Add",
  nameSchemes: ["Store Scheduled Event ID As", "Store User As"],
  initialize(client, data, run) {
    client.on('guildScheduledEventUserAdd', (event, user) => {
      run([event.id, user], { event: event.id, user });
    });
  }
};
