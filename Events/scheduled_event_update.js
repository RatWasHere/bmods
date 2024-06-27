module.exports = {
  name: "Scheduled Event Update",
  nameSchemes: ["Store Scheduled Before Update As", "Store Scheduled After Update As"],
  initialize(client, data, run) {
    client.on('guildScheduledEventUpdate', (event, oldEvent) => {
      run([oldEvent, event], { oldEvent, updatedEvent: event });
    });
  }
};
