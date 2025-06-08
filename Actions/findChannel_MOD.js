modVersion = "v1.1.0";

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
          field: true,
        },
        {
          name: "Name",
          field: true,
        },
        {
          name: "The channel name includes",
          field: true,
        },
        {
          name: "Position",
          field: true,
        },
        {
          name: "Topic",
          field: true,
        },
        {
          name: "The channel's topics include",
          field: true,
        },
        {
          name: "ID of the channel category",
          field: true,
        },
      ],
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
      storeAs: "store",
      name: "Store Channel As",
    },
    {
      element: "store",
      storeAs: "storeerorr",
      name: "Store List Failed Types (Erorr)"
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
    return `By ${values.method} (${
      values.value
    }) - Store As: ${constants.variable(values.store)}`;
  },

  async run(values, interaction, client, bridge) {
      const {
          ChannelTypes
      } = require("oceanic.js");
      
      let rawChannels = await bridge.guild.getChannels();
      const channels = new Map(rawChannels.map((channel) => [channel.id, channel]));
      
      let toMatch = bridge.transf(values.value);
      let result;
      
      switch (values.method) {
          case "ID":
              result = Array.from(channels.values()).find((c) => c.id === toMatch);
              break;
          case "Name":
              result = Array.from(channels.values()).find((c) => c.name === toMatch);
              break;
          case "Topic":
              result = Array.from(channels.values()).find((c) => c.topic === toMatch);
              break;
          case "Position":
              const position = parseInt(toMatch, 10);
              result = Array.from(channels.values()).find((c) => c.position === position);
              break;
          case "ID of the channel category":
              result = Array.from(channels.values()).find((c) => c.parentID === toMatch);
              break;
          case "The channel name includes":
              result = Array.from(channels.values()).find((c) => c.name.includes(toMatch));
              break;
          case "The channel's topics include":
              result = Array.from(channels.values()).find((c) => c.topic?.includes(toMatch));
              break;
      }
      
      if (!result) {
          bridge.store(values.storeerorr, ["not_found"]);
          await bridge.call(values.ifError, values.ifErrorActions);
          return;
      }
      
      const selectedTypes = [];
      
      const typeResults = {
          text: null,
          announcement: null,
          forum: null,
          voice: null,
          stage: null,
          thread: null,
          privateThread: null,
          post: null,
      };
      
      for (const key of Object.keys(typeResults)) {
          if (values[key] === true) {
              selectedTypes.push(key);
          }
      }
      
      for (const typeKey of selectedTypes) {
          switch (typeKey) {
              case "text":
                  typeResults.text = result.type === ChannelTypes.GUILD_TEXT;
                  break;
              case "announcement":
                  typeResults.announcement = result.type === ChannelTypes.GUILD_NEWS;
                  break;
              case "forum":
                  typeResults.forum = result.type === ChannelTypes.GUILD_FORUM;
                  break;
              case "voice":
                  typeResults.voice = result.type === ChannelTypes.GUILD_VOICE;
                  break;
              case "stage":
                  typeResults.stage =
                      result.type === ChannelTypes.GUILD_STAGE_VOICE;
                  break;
              case "thread":
                  typeResults.thread =
                      result.type === ChannelTypes.GUILD_PUBLIC_THREAD &&
                      channels.get(result.parentID)?.type !== ChannelTypes.GUILD_FORUM;
                  break;
              case "privateThread":
                  typeResults.privateThread =
                      result.type === ChannelTypes.GUILD_PRIVATE_THREAD &&
                      channels.get(result.parentID)?.type !== ChannelTypes.GUILD_FORUM;
                  break;
              case "post":
                  typeResults.post = [
                          ChannelTypes.GUILD_PUBLIC_THREAD,
                          ChannelTypes.GUILD_PRIVATE_THREAD,
                      ].includes(result.type) &&
                      channels.get(result.parentID)?.type === ChannelTypes.GUILD_FORUM;
                  break;
          }
      }
      
      const isMatchingType = selectedTypes.some(
          (typeKey) => typeResults[typeKey] === true
      );
      
      if (!isMatchingType && selectedTypes.length > 0) {
          const failedFilters = selectedTypes.filter(
              (typeKey) => typeResults[typeKey] === false
          );
          bridge.store(values.storeerorr, failedFilters);
          await bridge.call(values.ifError, values.ifErrorActions);
      } else {
          bridge.store(values.store, result);
          
          const failedFilters = selectedTypes.filter(
              (typeKey) => typeResults[typeKey] === false
          );
          
          if (failedFilters.length > 0) {
              bridge.store(values.storeerorr, failedFilters);
          }
          
          await bridge.call(values.ifexists, values.ifexistsActions);
      }
  },
};
