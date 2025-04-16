module.exports = {
  data: {
    name: "Get Scheduled Event Info",
  },
  category: "Scheduled Events",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "variable",
      storeAs: "event",
      name: "Event Variable",
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        creator: { name: "Creator" },
        event_id: { name: "ID" },
        guild: { name: "Server" },
        name: { name: "Name" },
        description: { name: "Description" },
        createdAt: { name: "Created At Timestamp" },
        scheduled_start_time: { name: "Scheduled Start Time Timestamp" },
        scheduled_end_time: { name: "Scheduled End Time Timestamp" },
        image: { name: "Image URL" },
        channel: { name: "Channel" },
        status: { name: "Status" },
        entity_type: { name: "Entity Type" },
      },
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store",
    },
  ],

  subtitle: (values, constants, thisAction) => {
    const selectedChoice = thisAction.UI.find(
      (e) => e.element === "typedDropdown"
    ).choices[values.get.type];
    return `${
      selectedChoice ? selectedChoice.name : "Unknown"
    } of Event - Store As: ${constants.variable(values.store)}`;
  },

  async run(values, message, client, bridge) {
    const event = bridge.variables[values.event.value];
    let output = null;

    switch (values.get.type) {
      case "creator":
        output = event.creator;
        break;
      case "event_id":
        output = event.id;
        break;
      case "guild":
        output = event.guildID;
        break;
      case "name":
        output = event.name;
        break;
      case "description":
        output = event.description;
        break;
      case "createdAt":
        output = event.createdAt ? Date.parse(event.createdAt) : null;
        break;
      case "scheduled_start_time":
        output = event.scheduledStartTime
          ? Date.parse(event.scheduledStartTime)
          : null;
        break;
      case "scheduled_end_time":
        output = event.scheduledEndTime
          ? Date.parse(event.scheduledEndTime)
          : null;
        break;
      case "image":
        output = event.image
          ? `https://cdn.discordapp.com/guild-events/${event.id}/${event.image}.png?size=4096&ignore=true`
          : null;
        break;
      case "channel":
        output = event.channel;
        break;
      case "status":
        output =
          {
            1: "SCHEDULED",
            2: "ACTIVE",
            3: "COMPLETED",
            4: "CANCELED",
          }[event.status] || "UNKNOWN";
        break;
      case "entity_type":
        output =
          {
            1: "STAGE_INSTANCE",
            2: "VOICE",
            3: "EXTERNAL",
          }[event.entityType] || "UNKNOWN";
        break;
      default:
        return;
    }

    bridge.store(values.store, output);
  },
};
