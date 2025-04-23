/*
  Roblox Ranking mod by scriptedCoke
  Licensed under MIT License

  Rank a roblox user in a roblox group.
  Must have noblox.js installed in the bmd directory. You also need a roblox bot cookie and they must be able to manage lower ranked members.

  Result will be inside a JSON object. If you want to send the pre-made success message then get it by using ${tempVars('resultvarname').message}
*/

module.exports = {
  data: {
    name: "Rank User in Group",
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
      element: "input",
      name: "Rank ID",
      storeAs: "rankId",
    },
    {
      element: "largeInput",
      name: "Roblox .ROBLOSECURITY Cookie",
      storeAs: "cookie",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result Object As",
      storeAs: "store",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result Status As",
      storeAs: "storestatus",
    },
  ],

  async run(values, message, client, bridge) {
    const noblox = await client.getMods().require("noblox.js");
    const username = bridge.transf(values.username);
    const groupId = parseInt(bridge.transf(values.groupId));
    const rankId = parseInt(bridge.transf(values.rankId));
    const cookie = bridge.transf(values.cookie);

    try {
      await noblox.setCookie(cookie);

      return noblox.getIdFromUsername(username)
        .then((userId) => {
          if (!userId) {
            throw new Error(`Failed to fetch user ID for username "${username}"`);
          }

          return noblox.setRank(groupId, userId, rankId)
            .then(() => {
              const successObj = {
                username: username,
                groupId: groupId,
                rankId: rankId,
                status: "Success",
                message: `User ${username} successfully ranked to rank ${rankId} in group ${groupId}`,
              };
              
              bridge.store(values.store, successObj);
              bridge.store(values.storestatus, "Success");
            });
        })
        .catch((err) => {
          const errorMsg = {
            status: "Failure",
            message: `${err.message}`,
          };
          
          bridge.store(values.store, errorMsg);
          bridge.store(values.storestatus, "Failure");
        });
    } catch (err) {
      const errorMsg = {
        status: "Failure",
        message: `${err.message}`,
      };
      
      bridge.store(values.store, errorMsg);
      bridge.store(values.storestatus, "Failure");
    }
  },
};