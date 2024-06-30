module.exports = {
  data: {
    name: "URL Shortener",
  },
  category: "Link Shortener",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat",
  },
  UI: [
    {
      element: "input",
      storeAs: "sourceURL",
      name: "URL To Shorten",
    },
    "_",
    {
      element: "dropdown",
      storeAs: "shortenType",
      name: "Shorten Type",
      extraField: "shortenedCode",
      choices: [{ name: "Randomize" }, { name: "Custom", field: true }],
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Shortened URL As",
    },
  ],

  async run(values, interaction, client, bridge) {
    await fetch("https://csclub.uwaterloo.ca/~phthakka/1pt-express", {
      body: {
        long: bridge.transf(values.sourceURL),
        short:
          values.shortenType == "Randomize"
            ? undefined
            : bridge.transf(values.shortenedCode),
      },
    }).then(async (response) => {
      let res = await response.json();
      let url = res[0].long;

      bridge.store(values.store, url);
    });
  },
};
