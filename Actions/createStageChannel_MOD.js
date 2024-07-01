const { ChannelTypes, Permissions, Client, OverwriteTypes } = require("oceanic.js");

module.exports = {
  category: "Channels",
  data: {
    name: "Create Stage Channel",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt"
  },
  UI: [
    {
      element: "input",
      name: "Channel Name",
      storeAs: "channelName",
    },
    "-",
    {
      element: "toggle",
      name: "Visibility",
      true: "Private",
      false: "Public",
      storeAs: "private"
    },
    {
      element: "toggle",
      name: "NSFW",
      true: "Yes",
      false: "No",
      storeAs: "nsfw"
    },
    "-",
    {
      element: "category",
      storeAs: "category",
      optional: true
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "position",
      choices: {
        unset: { name: "Default" },
        set: { name: "Custom", field: true }
      },
      name: "Position"
    },
    "-",
    {
      element: "largeInput",
      storeAs: "topic",
      name: "Channel Topic"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "rateLimitPerUser",
      choices: {
        "0": { name: "None" },
        "1": { name: "5 seconds" },
        "2": { name: "10 seconds" },
        "3": { name: "15 seconds" },
        "4": { name: "30 seconds" },
        "5": { name: "1 minute" },
        "6": { name: "5 minutes" },
        "7": { name: "10 minutes" },
        "8": { name: "15 minutes" },
        "9": { name: "30 minutes" },
        "10": { name: "1 hour" },
        "11": { name: "2 hours" },
        "12": { name: "6 hours" },
        custom: { name: "Custom (seconds)", field: true }
      },
      name: "Slowmode"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "userLimit",
      choices: {
        "0": { name: "Infinite" },
        custom: { name: "Custom", field: true }
      },
      name: "User Limit"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "bitrate",
      choices: {
        Default: { name: "Default" },
        "1": { name: "8kbps" },
        "2": { name: "16kbps" },
        "3": { name: "32kbps" },
        "4": { name: "64kbps" },
        custom: { name: "Custom (kbps)", field: true }
      },
      name: "Bitrate"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "videoQualityMode",
      choices: {
        auto: { name: "Auto" },
        full: { name: "Full" }
      },
      name: "Video Quality Mode"
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason",
      placeholder: "Optional"
    },
    "-",
    {
      element: "storage",
      name: "Store Channel As",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Name: ${values.channelName} - Store As: ${constants.variable(values.store)}`;
  },
  compatibility: ["Any"],

  /**
   * @param {Client} client
   * @returns {Promise<void>}
   */
  async run(values, message, client, bridge) {
    let channel;

    let channelOptions = {
      name: bridge.transf(values.channelName),
      reason: values.reason ? bridge.transf(values.reason) : undefined,
      topic: bridge.transf(values.topic),
      permissionOverwrites: [],
      type: ChannelTypes.GUILD_STAGE_VOICE,
      position: values.position?.type === 'set' ? parseInt(values.position.value) : null
    };

    if (values.category) {
      const categoryChannel = await bridge.getChannel(values.category);
      if (categoryChannel) {
        channelOptions.parentID = categoryChannel.id;
      }
    }

    if (values.private) {
      let roleID = bridge.guild.roles.find(r => r.position == 0).id;

      channelOptions.permissionOverwrites = [{
        deny: Permissions.VIEW_CHANNEL,
        type: OverwriteTypes.ROLE,
        id: roleID
      }];
    }

    if (values.bitrate) {
      if (values.bitrate.type === 'custom') {
        let customBitrate = parseInt(values.bitrate.value);
        if (!isNaN(customBitrate)) {
          channelOptions.bitrate = customBitrate * 1000; // Convertir kbps en bps
        }
      } else if (values.bitrate.type !== 'Default') {
        let selectedBitrate = parseInt(values.bitrate.type);
        switch (selectedBitrate) {
          case 1:
            channelOptions.bitrate = 8000;
            break;
          case 2:
            channelOptions.bitrate = 16000;
            break;
          case 3:
            channelOptions.bitrate = 32000;
            break;
          case 4:
            channelOptions.bitrate = 64000;
            break;
          default:
            break;
        }
      }
    }

    if (values.rateLimitPerUser) {
      if (values.rateLimitPerUser.type !== 'custom' && values.rateLimitPerUser.type !== '0') {
        let selectedSlowmode = parseInt(values.rateLimitPerUser.type);
        switch (selectedSlowmode) {
          case 1:
            channelOptions.rateLimitPerUser = 5;
            break;
          case 2:
            channelOptions.rateLimitPerUser = 10;
            break;
          case 3:
            channelOptions.rateLimitPerUser = 15;
            break;
          case 4:
            channelOptions.rateLimitPerUser = 30;
            break;
          case 5:
            channelOptions.rateLimitPerUser = 60;
            break;
          case 6:
            channelOptions.rateLimitPerUser = 300;
            break;
          case 7:
            channelOptions.rateLimitPerUser = 600;
            break;
          case 8:
            channelOptions.rateLimitPerUser = 900;
            break;
          case 9:
            channelOptions.rateLimitPerUser = 1800;
            break;
          case 10:
            channelOptions.rateLimitPerUser = 3600;
            break;
          case 11:
            channelOptions.rateLimitPerUser = 7200;
            break;
          case 12:
            channelOptions.rateLimitPerUser = 21600;
            break;
          default:
            break;
        }
      } else if (values.rateLimitPerUser.type === 'custom') {
        let customSlowmode = parseInt(values.rateLimitPerUser.value);
        if (!isNaN(customSlowmode)) {
          channelOptions.rateLimitPerUser = customSlowmode;
        }
      }
    }

    if (values.nsfw !== undefined) {
      channelOptions.nsfw = values.nsfw;
    }

    if (values.userLimit) {
      if (values.userLimit.type === 'custom') {
        let customUserLimit = parseInt(values.userLimit.value);
        if (!isNaN(customUserLimit)) {
          channelOptions.userLimit = customUserLimit;
        }
      } else if (values.userLimit.type !== '0') {
      }
    }

    if (values.videoQualityMode) {
      switch (values.videoQualityMode.type) {
        case 'auto':
          channelOptions.videoQualityMode = 1;
          break;
        case 'full':
          channelOptions.videoQualityMode = 2;
          break;
        default:
          break;
      }
    }

    channel = await bridge.guild.createChannel(ChannelTypes.GUILD_STAGE_VOICE, channelOptions);
    
    bridge.store(values.store, channel);
  },
};
