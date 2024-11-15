module.exports = {
  data: {
    name: "Tweet Card",
  },
  modules: ["canvafy"],
  category: "Canvafy Cards",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "default.io",
  },
  UI: [
    {
      element: "input",
      storeAs: "avatarurl",
      name: "Member Avatar Url",
    },
    {
      element: "input",
      storeAs: "username",
      name: "Member Username",
    },
    {
      element: "input",
      storeAs: "displayName",
      name: "Member Display",
    },
    {
      element: "toggle",
      storeAs: "verified",
      name: "Blue Tick?",
      true: "true",
      false: "false",
    },
    {
      element: "input",
      storeAs: "theme",
      name: "Set Theme (dark, light or dim)",
    },
    {
      element: "input",
      storeAs: "comment",
      name: "Set Comment",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store image as (PNG)",
    },
  ],

  async run(values, interaction, client, bridge) {
    const canvafy = require("canvafy");

    function generateTweetCard() {
      const tweetCard = new canvafy.Tweet()
        .setTheme(bridge.transf(values.theme))
        .setUser({
          displayName: bridge.transf(values.displayName),
          username: bridge.transf(values.username),
        })
        .setVerified(Boolean(values.verified))
        .setComment(bridge.transf(values.comment))
        .setAvatar(bridge.transf(values.avatarurl))
        .build();

      bridge.store(values.store, tweetCard);
    }

    generateTweetCard();
  },
};
