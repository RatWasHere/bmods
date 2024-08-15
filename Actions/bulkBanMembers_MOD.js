module.exports = {
  data: {
    name: "Bulk Ban Members",
  },
  category: "Members",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "guild",
      storeAs: "guild",
    },
    "-",
    {
      element: "variable",
      storeAs: "members",
      name: "Members",
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason",
      placeholder: "Optional",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "deleteHistory",
      name: "Delete History",
      choices: {
        none: { name: "None" },
        60: { name: "1 Hour" },
        120: { name: "2 Hours" },
        240: { name: "4 Hours" },
        480: { name: "8 Hours" },
        1440: { name: "1 Day" },
        4320: { name: "3 Days" },
        10080: { name: "1 Week" },
        custom: { name: "Custom (Minutes)", field: true },
      },
    },
  ],
  subtitle: (values, constants) => {
    return `Members: ${constants.user(values.members)} - Reason: ${
      values.reason
    }`;
  },

  async run(values, message, client, bridge) {
    const membersVariable = await bridge.get(values.members);

    let userIDs = [];
    if (Array.isArray(membersVariable)) {
      for (let member of membersVariable) {
        if (typeof member === "string") {
          userIDs.push(member);
        } else if (typeof member === "object" && member.id) {
          userIDs.push(member.id);
        }
      }
    }

    let deleteMessageSeconds;
    if (values.deleteHistory.type !== "none") {
      if (values.deleteHistory.type !== "custom") {
        deleteMessageSeconds = Number(values.deleteHistory.type) * 60;
      } else {
        deleteMessageSeconds =
          Number(bridge.transf(values.deleteHistory.value)) * 60;
      }
    }

    const guild = await bridge.getGuild(values.guild);

    const bulkBanOptions = {
      reason: values.reason,
      userIDs,
      deleteMessageSeconds,
    };

    await guild.bulkBan(bulkBanOptions);
  },
};
