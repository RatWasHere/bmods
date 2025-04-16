modVersion = "s.v1.0";
module.exports = {
  data: {
    name: "Extract Steam Summary",
  },
  aliases: [],
  modules: [],
  category: "Steam",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "steamSummary",
      name: "Steam Summary",
    },
    "-",
    {
      element: "store",
      storeAs: "steamId",
      name: "Store Steam ID As",
    },
    "-",
    {
      element: "store",
      storeAs: "visibilityState",
      name: "Store Profile Visibility State As",
    },
    {
      element: "store",
      storeAs: "profileState",
      name: "Store Profile Config State As",
    },
    {
      element: "store",
      storeAs: "personaState",
      name: "Store Current Status As (Online/Offline/Away etc)",
    },
    // {
    //   element: "store",
    //   storeAs: "personaStateFlags",
    //   name: "Store Account Flags As",
    // },
    "-",
    {
      element: "store",
      storeAs: "displayName",
      name: "Store Display Name As",
    },
    {
      element: "store",
      storeAs: "realName",
      name: "Store Real Name As",
    },
    {
      element: "store",
      storeAs: "profileUrl",
      name: "Store Profile URL As",
    },
    {
      element: "store",
      storeAs: "steamAvatar",
      name: "Store Avatar URL As (Object, Use .base/medium/full/hash. eg: ${tempVars('avatar').full})",
    },
    {
      element: "store",
      storeAs: "primaryClanId",
      name: "Store Primary Clan Id As",
    },
    {
      element: "store",
      storeAs: "commentPermission",
      name: "Store Profile Comment Permission As",
    },
    "-",
    {
      element: "store",
      storeAs: "profileCreationTs",
      name: "Store Account Creation Timestamp As",
    },
    {
      element: "store",
      storeAs: "lastOnlineTs",
      name: "Store Last Offline Timestamp As",
    },
    "-",
    {
      element: "store",
      storeAs: "countryCode",
      name: "Store Country Code As",
    },
    {
      element: "store",
      storeAs: "stateCode",
      name: "Store State Code As",
    },
    {
      element: "store",
      storeAs: "cityCode",
      name: "Store City Code As",
    },
    "-",
    {
      element: "store",
      storeAs: "currentGame",
      name: "Store Current Playing Game As",
    },
    {
      element: "store",
      storeAs: "currentGameId",
      name: "Store Current Playing Game ID As",
    },
    {
      element: "store",
      storeAs: "currentGameServerIp",
      name: "Store Current Playing Game Server IP As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) => {
    return `Extract Steam Summary Of ${values.steamSummary.type}(${values.steamSummary.value})`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let steamSummary = bridge.get(values.steamSummary);

    if (typeof steamSummary == "object" && steamSummary?.steamid != undefined) {
      bridge.store(values.steamId, steamSummary.steamid || "Unknown");

      const communityVisibilityStates = {
        1: "Private",
        2: "Friends Only",
        3: "Public",
        4: "Unknown",
      };
      bridge.store(
        values.visibilityState,
        communityVisibilityStates[steamSummary.communityvisibilitystate] ||
          "Unknown"
      );

      const profileStates = {
        0: "Profile Not Configured",
        1: "Profile Configured",
      };
      bridge.store(
        values.profileState,
        profileStates[steamSummary.profilestate] || "Unknown"
      );

      const personaStates = {
        0: "Offline",
        1: "Online",
        2: "Busy",
        3: "Away",
        4: "Snoozing",
        5: "Looking To Trade",
        6: "Looking To Play",
      };
      bridge.store(
        values.personaState,
        personaStates[steamSummary.personastate] || "Unknown"
      );

      // const bitFlag = parseInt(steamSummary.personastateflags).toString(2).padStart(7, 0).split("").reverse().join("")
      // const bitMeanings = {
      //   0: "Trade Banned",
      //   1: "Running Game Server",
      //   2: "Logged In On Steam Web",
      //   3: "Logged In On Steam Mobile",
      //   4: "On Steam Big Picture Mode",
      //   5: "Logged In On A Tablet",
      //   6: "Streaming"
      // }
      // let activeFlags = []
      // for (let bitIndex = 0; bitIndex < bitFlag.length; bitIndex++){
      //   if (bitFlag[bitIndex] === "1"){
      //     activeFlags.push(bitMeanings[bitIndex] || "Unknown")
      //   }
      // }
      // if (activeFlags.length = 0){activeFlags.push("No Profile State Flags")}
      // bridge.store(values.personaStateFlags, activeFlags)

      bridge.store(values.displayName, steamSummary.personaname || "Unknown");
      bridge.store(values.profileUrl, steamSummary.profileurl || "Unknown");

      const avatarObj = {
        base: steamSummary.avatar || "Unknown",
        medium: steamSummary.avatarmedium || "Unknown",
        full: steamSummary.avatarfull || "Unknown",
        hash: steamSummary.avatarhash || "Unknown",
      };
      bridge.store(values.steamAvatar, avatarObj);

      bridge.store(values.realName, steamSummary.realname || "Unknown");
      bridge.store(
        values.primaryClanId,
        steamSummary.primaryclanid || "Unknown"
      );

      const commentPermissionStates = {
        0: "Public",
        1: "Friends Only",
        2: "Private",
        3: "Blocked",
      };
      bridge.store(
        values.commentPermission,
        commentPermissionStates[steamSummary.commentpermission] || "Unknown"
      );

      bridge.store(
        values.profileCreationTs,
        steamSummary.timecreated || "Unknown"
      );
      bridge.store(values.lastOnlineTs, steamSummary.lastlogoff || "Unknown");
      bridge.store(
        values.countryCode,
        steamSummary.loccountrycode || "Unknown"
      );
      bridge.store(values.stateCode, steamSummary.locstatecode || "Unknown");
      bridge.store(values.cityCode, steamSummary.loccityid || "Unknown");
      bridge.store(values.currentGame, steamSummary.gameextrainfo || "Unknown");
      bridge.store(values.currentGameId, steamSummary.gameid || "Unknown");
      bridge.store(
        values.currentGameServerIp,
        steamSummary.gameserverip || "Unknown"
      );
    }
  },
};
