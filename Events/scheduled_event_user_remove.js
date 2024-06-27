module.exports = {
  name: "Scheduled Event User Remove",
  nameSchemes: ["Store Scheduled Event ID As", "Store User As"],
  initialize(client, data, run) {
    client.on('guildScheduledEventUserRemove', (event, user) => {
      run([event.id, user], { event: event.id, user });
    });
  }
};
