module.exports = {
  data: {
    name: "waifu.pics Random Image",
  },
  category: "Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "dropdown",
      storeAs: "category",
      name: "Category",
      choices: [
        { name: "waifu" },
        { name: "neko" },
        { name: "shinobu" },
        { name: "megumin" },
        { name: "bully" },
        { name: "cuddle" },
        { name: "cry" },
        { name: "hug" },
        { name: "awoo" },
        { name: "kiss" },
        { name: "lick" },
        { name: "pat" },
        { name: "smug" },
        { name: "bonk" },
        { name: "yeet" },
        { name: "blush" },
        { name: "smile" },
        { name: "wave" },
        { name: "highfive" },
        { name: "nom" },
        { name: "bite" },
        { name: "glomp" },
        { name: "slap" },
        { name: "kill" },
        { name: "happy" },
        { name: "wink" },
        { name: "poke" },
        { name: "dance" },
        { name: "cringe" },
      ],
    },
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Image URL As",
    },
  ],

  async run(values, interaction, client, bridge) {
    const api = `https://api.waifu.pics/sfw/${values.category}`;

    await fetch(api).then(async (response) => {
      let res = await response.json();
      bridge.store(values.store, res.url);
    });
  },
};
