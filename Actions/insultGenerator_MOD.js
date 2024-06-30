module.exports = {
  data: {
    name: "Insult Generator",
  },
  category: "Text",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "tao",
  },
  UI: [
    {
      element: "typedDropdown",
      storeAs: "language",
      name: "Language",
      choices: {
        en: { name: "English" },
        ru: { name: "Russian" },
        de: { name: "German" },
        cn: { name: "Chinese" },
        es: { name: "Spanish" },
      },
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Result As",
    },
  ],

  async run(values, interaction, client, bridge) {
    const language = values.language.type;
    const api = `https://evilinsult.com/generate_insult.php?lang=${language}&type=text`;

    await fetch(api).then(async (response) => {
      let res = await response.text();
      bridge.store(values.store, res);
    });
  },
};
