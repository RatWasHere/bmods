modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Bing Translate",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Action to translate text using the Bing Api",
  },
  category: "Text",
  modules: ["bing-translate-api"],
  UI: [
    {
      element: "largeInput",
      storeAs: "input",
      name: "Text To Translate",
    },
    {
      element: "typedDropdown",
      storeAs: "textType",
      choices: {
        auto: { name: "Auto Detect" },
        iso: { name: "ISO", field: true },
      },
      name: "Source Language",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "translationType",
      choices: {
        iso: { name: "ISO", field: true },
      },
      name: "New Language",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "storeTranslation",
      name: "Store translation",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  async run(values, interaction, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName);
    }

    const { translate } = require('bing-translate-api');

    const isAuto = values.textType.type === "auto";
    const sourceLanguage = isAuto
      ? "auto-detect"
      : bridge.transf(values.textType.value).trim();
    const translationLanguage = bridge
      .transf(values.translationType.value)
      .trim();
    const query = bridge.transf(values.input);

    const translated = await translate(query, sourceLanguage, translationLanguage);

    bridge.store( 
      values.storeTranslation,
      translated?.translation
    );
  },
};
