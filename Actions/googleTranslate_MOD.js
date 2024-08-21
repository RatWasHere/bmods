/*
  Google Translate mod by qschnitzel
  Licensed under MIT License

  native translate action isnt implemented, so here is mine™️
*/
module.exports = {
  data: {
    name: "Google Translate",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "Text",
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
  ],

  async run(values, interaction, client, bridge) {
    const isAuto = values.textType.type === "auto";
    const sourceLanguage = isAuto
      ? "auto"
      : bridge.transf(values.textType.value).trim();
    const translationLanguage = bridge
      .transf(values.translationType.value)
      .trim();
    const query = bridge.transf(values.input);

    await fetch(
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLanguage}&tl=${translationLanguage}&q=${query}`
    ).then(async (res) => {
      const response = await res.json();
      if (isAuto) {
        bridge.store(values.storeTranslation, response[0][0]);
      } else {
        bridge.store(values.storeTranslation, response[0]);
      }
    });
  },
};
