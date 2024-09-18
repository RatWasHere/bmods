module.exports = {
  modules: ["canvafy"],
  data: {
    name: "Generate Level Up Card",
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
      storeAs: "avatarbordercolor",
      name: "Avatar Border Color (HEXCODE)",
      placeholder: "#FFF",
    },
    {
      element: "input",
      storeAs: "overlayopacity",
      name: "Overlay Opacity",
    },
    {
      element: "input",
      storeAs: "oldlevel",
      name: "Old Level",
    },
    {
      element: "input",
      storeAs: "newlevel",
      name: "New Level",
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
      const Card = new canvafy.LevelUp()
        .setAvatar(bridge.transf(values.avatarurl))
        .setBackground("image", bridge.transf(values.backgroundurl))
        .setUsername(bridge.transf(values.username))
        .setBorder(bridge.transf(values.bordercolor))
        .setAvatarBorder(bridge.transf(values.avatarbordercolor))
        .setOverlayOpacity(Number(bridge.transf(values.overlayopacity)))
        .setLevels(
          Number(bridge.transf(values.oldlevel)),
          Number(bridge.transf(values.newlevel))
        )
        .build();

      bridge.store(values.store, Card);
    }

    generateRankCard();
  },
};
