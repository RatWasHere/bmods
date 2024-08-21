/*
  Random Meme mod by qschnitzel
  Licensed under MIT License

  Fetches a random meme from Reddit using Meme_Api by D3vd.
*/
module.exports = {
  data: {
    name: "Random Meme",
  },
  category: "Memes",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  UI: [
    {
      element: "input",
      storeAs: "suffix",
      name: "Suffix",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    await fetch("https://meme-api.com/gimme/" + (values.suffix ?? "")).then(
      async (response) => {
        let res = await response.json();
        let preview = res.preview[res.preview.length - 1];

        bridge.store(values.store, preview);
      }
    );
  },
};
