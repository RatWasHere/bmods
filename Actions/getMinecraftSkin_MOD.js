/*
  Get Minecraft Skin mod by qschnitzel
  Licensed under MIT License

  Get any Minecraft skin by its username.
*/
module.exports = {
  data: {
    name: "Get Minecraft Skin",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "Game",
  UI: [
    {
      element: "input",
      storeAs: "mcname",
      name: "Minecraft Username",
    },
    "-",
    {
      element: "dropdown",
      name: "Get Part",
      storeAs: "part",
      extraField: "part",
      choices: [
        { name: "avatar" },
        { name: "helm" },
        { name: "bust" },
        { name: "armor/bust" },
        { name: "body" },
        { name: "armor/body" },
        { name: "head" },
        { name: "headhelm" },
        { name: "skin" },
        {
          name: "Variable",
          field: true,
        },
      ],
    },
    "-",
    {
      element: "input",
      storeAs: "mcsize",
      placeholder: "180",
      name: "Image Size",
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const query = bridge.transf(values.part);
    const size = bridge.transf(values.mcsize);
    const name = bridge.transf(values.mcname);

    bridge.store(
      values.store,
      `https://mineskin.eu/${query}/${name}/${size}.png`
    );
  },
};
