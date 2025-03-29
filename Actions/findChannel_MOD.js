modVersion = "v1.0.0";

module.exports = {
  category: "Channels",
  data: {
    name: "Find Channel PLUS",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "dropdown",
      storeAs: "method",
      extraField: "value",
      name: "Find By",
      choices: [
        {
          name: "ID",
          field: true
        },
        {
          name: "Name",
          field: true
        },
        {
          name: "The channel name includes",
          field: true
        },
        {
          name: "Position",
          field: true
        },
        {
          name: "Topic",
          field: true
        },
        {
          name: "The channel's topics include",
          field: true
        },
        {
          name: "ID of the channel category",
          field: true
        }
      ]
    },
    {
      element: "toggleGroup",
      storeAs: ["text", "announcement"],
      nameSchemes: ["Text channel", "Announcement"],
    },
    {
      element: "toggleGroup",
      storeAs: ["forum", "voice"],
      nameSchemes: ["Forum", "Voice"],
    },
    {
      element: "toggleGroup",
      storeAs: ["stage", "thread"],
      nameSchemes: ["Trebuna", "Thread"],
    },
    {
      element: "toggleGroup",
      storeAs: ["privateThread", "post"],
      nameSchemes: ["Private Thread", "Post"],
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store"
    },
    "-",
    {
      element: "condition",
      storeAs: "ifexists",
      storeActionsAs: "ifexistsActions",
      name: "If it exists",
    },
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If not found",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `By ${values.method} (${values.value}) - Store As: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    const { ChannelTypes } = require("oceanic.js");

    let rawChannels = await bridge.guild.getChannels();
    const channels = new Map(rawChannels.map(channel => [channel.id, channel]));

    const filteredChannels = Array.from(channels.values()).filter((c) => {
      const allowedTypes = [];
    
      if (values.text === true) allowedTypes.push(ChannelTypes.GUILD_TEXT);
      if (values.announcement === true) allowedTypes.push(ChannelTypes.GUILD_NEWS);
      if (values.forum === true) allowedTypes.push(ChannelTypes.GUILD_FORUM);
      if (values.voice === true) allowedTypes.push(ChannelTypes.GUILD_VOICE);
      if (values.stage === true) allowedTypes.push(ChannelTypes.GUILD_STAGE_VOICE);
  
      const isAllowedType = allowedTypes.includes(c.type);
  
      const isThread = values.thread === true
      ? c.type === ChannelTypes.GUILD_PUBLIC_THREAD &&
        channels.get(c.parentID)?.type !== ChannelTypes.GUILD_FORUM
      : false;
  
        const isPrivateThread = values.privateThread === true
        ? c.type === ChannelTypes.GUILD_PRIVATE_THREAD &&
          channels.get(c.parentID)?.type !== ChannelTypes.GUILD_FORUM
        : false;
  
        const isPost = values.post === true
        ? [ChannelTypes.GUILD_PUBLIC_THREAD, ChannelTypes.GUILD_PRIVATE_THREAD].includes(c.type) &&
          channels.get(c.parentID)?.type === ChannelTypes.GUILD_FORUM
        : false;  
  
      return isAllowedType || isThread || isPrivateThread || isPost;
    });
  
    let toMatch = bridge.transf(values.value);
  
    let result;
    switch (values.method) {
      case "ID":
        result = filteredChannels.find((c) => c.id === toMatch);
        break;
      case "Name":
        result = filteredChannels.find((c) => c.name === toMatch);
        break;
      case "Topic":
        result = filteredChannels.find((c) => c.topic === toMatch);
        break;
      case "Position":
        const position = parseInt(toMatch, 10);
        result = filteredChannels.find((c) => c.position === position);
        break;
      case "ID of the channel category":
        result = filteredChannels.find((c) => c.parentID === toMatch);
        break;
      case "The channel name includes":
        result = filteredChannels.find((c) => c.name.includes(toMatch));
        break;
      case "The channel's topics include":
        result = filteredChannels.find((c) => c.topic?.includes(toMatch));
        break;
    }
  
    if (result !== undefined) {
      bridge.store(values.store, result);
      await bridge.call(values.ifexists, values.ifexistsActions);
    } else {
      await bridge.call(values.ifError, values.ifErrorActions);
    }
  }
};
