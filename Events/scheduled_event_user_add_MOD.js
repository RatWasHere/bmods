module.exports = {
  name: "Scheduled Event User Add",
  nameSchemes: ["Store Scheduled Event ID As", "Store User As"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Events",
    creator: "nitiqt"
  },
  initialize(client, data, run) {
    client.on('guildScheduledEventUserAdd', (event, user) => {
      run([event, user], { event: event.id, user });
    });
  }
};
