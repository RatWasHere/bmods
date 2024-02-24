module.exports = {
    data: {
      name: "Insult Generator MOD",
    },
    category: "#Tao's Mods",
    info: {
      source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
      creator: "tao"
    },
    UI: [
      {
        element: "dropdown",
        storeAs: "language",
        name: "Language",
        choices: [
          { name: "ru" },
          { name: "en" },
          { name: "de" },
          { name: "cn" },
          { name: "el" },
          { name: "es" }

        ]
      },
      {
        element: "storageInput",
        storeAs: "store",
        name: "Store Result As"
      },
    ],
  
    async run(values, interaction, client, bridge) {
      const language = bridge.transf(values.language)
      const api = `https://evilinsult.com/generate_insult.php?lang=${language}&type=text`
  
      await fetch(api).then(
        async (response) => {
          let res = await response.text();
          bridge.store(values.store, res);
        }
      );
    },
  };
  