module.exports = {
  data: {
    name: "Delete Scheduled Event",
  },
  category: "Scheduled Events",
  UI: [
    {
      element: "variable",
      storeAs: "eventVariable",
      name: "Event Variable",
    },
  ],
  compatibility: ["Any"],
  subtitle: (values, constants, thisAction) => {
    return `Delete Scheduled Event - Event: ${constants.variable(values.eventVariable)}`;
  },

  async run(values, message, client, bridge) {
    let event = bridge.variables[values.eventVariable.value];
    await event.deleteScheduledEvent();
  },
};
