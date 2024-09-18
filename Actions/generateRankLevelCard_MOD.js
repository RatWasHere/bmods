module.exports = {
  modules: ["canvafy"],
  data: {
    name: "Generate Rank/Level Card",
  },
  category: "Canvafy Cards",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      storeAs: "avatarurl",
      name: "Member Avatar Url",
    },
    {
      element: "input",
      storeAs: "backgroundurl",
      name: "Card Background Url",
    },
    {
      element: "input",
      storeAs: "username",
      name: "Member Username",
    },
    {
      element: "input",
      storeAs: "bordercolor",
      name: "Border Color (HEXCODE)",
      placeholder: "#FFF",
    },
    {
      element: "input",
      storeAs: "statuscolor",
      name: "Status Color (HEXCODE)",
      placeholder: "#FFF",
    },
    {
      element: "input",
      storeAs: "level",
      name: "Level",
    },
    {
      element: "input",
      storeAs: "rank",
      name: "Rank",
    },
    {
      element: "input",
      storeAs: "currentxp",
      name: "Current Exp",
    },
    {
      element: "input",
      storeAs: "requiredxp",
      name: "Required Exp",
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

    function generateRankCard() {
      const rankCard = new canvafy.Rank()
        .setAvatar(bridge.transf(values.avatarurl))
        .setBackground("image", bridge.transf(values.backgroundurl))
        .setUsername(bridge.transf(values.username))
        .setBorder(bridge.transf(values.bordercolor))
        .setCustomStatus(bridge.transf(values.statuscolor))
        .setLevel(Number(bridge.transf(values.level)))
        .setRank(Number(bridge.transf(values.rank)))
        .setCurrentXp(Number(bridge.transf(values.currentxp)))
        .setRequiredXp(Number(bridge.transf(values.requiredxp)))
        .build();

      bridge.store(values.store, rankCard);
    }

    generateRankCard();
  },
};
