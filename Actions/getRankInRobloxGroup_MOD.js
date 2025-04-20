/*
  Get Roblox Rank mod by scriptedCoke
  Licensed under MIT License

  Get the roblox rank number (eg. 245) in a roblox group.
  Must have noblox.js installed in the bmd directory.
*/

module.exports = {
  data: {
    name: "Get User's Rank ID in Group",
  },
  modules: ["noblox.js"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "scriptedCoke",
  },
  category: "Roblox",
  UI: [
    {
      element: "input",
      name: "Roblox Username",
      storeAs: "username",
    },
    {
      element: "input",
      name: "Group ID",
      storeAs: "groupId",
    },
    {
      element: "store",
      name: "Store Result As",
      storeAs: "store",
    },
  ],

  async run(values, message, client, bridge) {
    const noblox = await client.getMods().require("noblox.js");
    const username = bridge.transf(values.username);
    const groupId = parseInt(bridge.transf(values.groupId));
    const resultStore = bridge.transf(values.store);

    try {
      const userId = await noblox.getIdFromUsername(username);
      const rankId = await noblox.getRankInGroup(groupId, userId);
      bridge.store(values.store, rankId);
    } catch (err) {
      const errorMsg = `❌ Error: ${err.message}`;
      bridge.store(values.store, errorMsg);
    }
  },
};
