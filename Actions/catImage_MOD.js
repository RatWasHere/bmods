/*
 Random cat mod by Regianus (TheKing1543/King)
 Based off of qshnitzel's "Random Meme" mod
*/
module.exports = {
  data: {
    name: "Random Cat Image URL",
  },
  category: "Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Regianus (TheKing1543) & qschnitzel",
  },
  UI: [
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    await fetch("https://api.thecatapi.com/v1/images/search").then(
      async (response) => {
        let res = await response.json();
        let preview = res[0].url;

        bridge.store(values.store, preview);
      }
    );
  },
};
