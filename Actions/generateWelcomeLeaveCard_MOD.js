module.exports = {
  data: {
    name: "Generate Welcome/Leave Card",
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
      storeAs: "title",
      name: "Title",
    },
    {
      element: "input",
      storeAs: "description",
      name: "Description",
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
      placeholder: "0.3",
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

    function generateCard() {
      const Card = new canvafy.WelcomeLeave()
        .setAvatar(bridge.transf(values.avatarurl))
        .setBackground("image", bridge.transf(values.backgroundurl))
        .setTitle(bridge.transf(values.title))
        .setDescription(bridge.transf(values.description))
        .setBorder(bridge.transf(values.bordercolor))
        .setAvatarBorder(bridge.transf(values.avatarbordercolor))
        .setOverlayOpacity(Number(bridge.transf(values.overlayopacity)))
        .build();

      bridge.store(values.store, Card);
    }

    generateCard();
  },
};
