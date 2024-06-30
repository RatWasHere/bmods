module.exports = {
  data: { name: "Get Members by Data Name" },
  category: "Member Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Nitiqt",
  },
  UI: [
    {
      element: "guild",
      storeAs: "guild",
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        ids: { name: "IDs" },
        mentions: { name: "Mentions" },
      },
    },
    "-",
    {
      element: "input",
      name: "Data Name",
      storeAs: "dataName",
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
  ],
  subtitle: (values, constants) => {
    return `Server: ${constants.guild(values.guild)} - Get: ${
      values.get.type
    } - Data Name: ${values.dataName} - Store As: ${constants.variable(
      values.store
    )}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let membersWithData = [];

    let guild = await bridge.getGuild(values.guild);
    if (!guild) return;

    const guildId = guild.id;

    for (const memberId in storedData.members) {
      if (storedData.members.hasOwnProperty(memberId)) {
        const memberData = storedData.members[memberId];

        if (memberData[bridge.transf(values.dataName)]) {
          if (memberId.startsWith(guildId)) {
            let output;
            if (values.get.type === "ids") {
              const memberIdWithoutServer = memberId.slice(guildId.length);
              membersWithData.push(memberIdWithoutServer);
            } else if (values.get.type === "mentions") {
              const memberIdWithoutServer = memberId.slice(guildId.length);
              const mention = `<@${memberIdWithoutServer}>`;
              membersWithData.push(mention);
            }
          }
        }
      }
    }

    bridge.store(values.store, membersWithData);
  },
};
