module.exports = {
  data: {
    name: "Get Scheduled Event",
  },
  category: "Scheduled Events",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "guild",
      storeAs: "guild",
      name: "Guild",
    },
    "-",
    {
      element: "input",
      storeAs: "eventID",
      name: "Event ID",
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store",
    },
  ],

  subtitle: (values, constants, thisAction) => {
    return `Scheduled Event ${values.eventID} of ${constants.guild(
      values.guild
    )} - Store As: ${constants.variable(values.store)}`;
  },

  async run(values, message, client, bridge) {
    let eventID = bridge.transf(values.eventID);
    let guild = await bridge.getGuild(values.guild);
    let event = await guild.getScheduledEvent(eventID);
    bridge.store(values.store, event);
  },
};
