module.exports = {
  data: { name: "Set Bot Activity" },
  category: "Bot",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt"
  },
  UI: [
    {
      element: "dropdown",
      storeAs: "status",
      name: "Status",
      choices: [
        { name: "Online" },
        { name: "Do Not Disturb" },
        { name: "Idle" },
        { name: "Invisible" }
      ]
    },
    "-",
    {
      element: "dropdown",
      name: "Activity",
      extraField: "activityName",
      storeAs: "activity",
      choices: [
        { name: "Custom", field: true, placeholder: "Status Text" },
        { name: "Playing", field: true, placeholder: "Game Name" },
        { name: "Watching", field: true, placeholder: "Movie Name" },
        { name: "Competing", field: true, placeholder: "In Game" },
        { name: "Listening", field: true, placeholder: "Song" },
        { name: "Streaming", field: true, placeholder: "Live Name" },
        { name: "None" }
      ]
    },
    {
      element: "input",
      name: "Streaming URL",
      storeAs: "streamingURL",
      placeholder: "Enter streaming URL (required if streaming)",
      optional: true
    }
  ],

  subtitle: (values) => {
    if (values.activity === 'Streaming' && values.streamingURL) {
      return `Streaming on ${values.streamingURL}`;
    }
    if (values.activity === 'Custom') {
      return `${values.activityName}`;
    } else {
      return `${values.activity} ${values.activityName}`;
    }
  },

  async run(values, message, client, bridge) {
    const { ActivityTypes } = require('oceanic.js');

    const statuses = {
      Online: "online",
      "Do Not Disturb": "dnd",
      Idle: "idle",
      Invisible: "invisible"
    };

    const activities = {
      Custom: ActivityTypes.CUSTOM,
      Playing: ActivityTypes.PLAYING,
      Watching: ActivityTypes.WATCHING,
      Competing: ActivityTypes.COMPETING,
      Listening: ActivityTypes.LISTENING,
      Streaming: ActivityTypes.STREAMING,
      None: null
    };

    const status = statuses[values.status];
    const activityType = activities[values.activity];

    const activityOptions = {
      name: bridge.transf(values.activityName),
      type: activityType
    };

    if (activityType === ActivityTypes.STREAMING && values.streamingURL) {
      activityOptions.url = bridge.transf(values.streamingURL);
    } else if (activityType === ActivityTypes.CUSTOM) {
      activityOptions.state = bridge.transf(values.activityName);
    }

    if (activityType) {
      client.editStatus(status, [activityOptions]);
    } else {
      client.editStatus(status);
    }
  }
};
