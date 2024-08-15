module.exports = {
  data: {
    name: "Randomize Text",
  },
  category: "Text",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "menu",
      storeAs: "cases",
      name: "Texts",
      types: {
        texts: "Text",
      },
      max: 200,
      UItypes: {
        texts: {
          name: "Text",
          preview: "`${option.data.text}`",
          data: { text: "" },
          UI: [
            {
              element: "largeInput",
              storeAs: "text",
              name: "Enter Text",
              placeholder: "Enter text here",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "storage",
      storeAs: "store",
      name: "Store Random Text As",
    },
  ],

  subtitle: (values, constants) => {
    let numTexts = values.cases.filter((c) => c.type === "texts").length;
    return `Randomizing Text from ${numTexts} provided texts`;
  },

  async run(values, message, client, bridge) {
    let texts = values.cases
      .filter((c) => c.type === "texts")
      .map((c) => c.data.text.trim())
      .filter((text) => text !== "");

    if (texts.length === 0) {
      bridge.store(values.store, "No texts available");
      return;
    }

    let randomText = texts[Math.floor(Math.random() * texts.length)];
    bridge.store(values.store, randomText);
  },
};
