module.exports = {
  data: {
    name: "Censorly AI",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Use an AI to check the text for bad words.",
  },
  category: "AI",
  modules: ["censorly"],
  UI: [
    {
      element: "largeInput",
      storeAs: "text",
      name: "Text",
    },
    "-",
    {
      element: "input",
      storeAs: "key",
      name: "API Key",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "flagged",
      name: "The status of the text for bad words.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "topics",
      name: "Array of main topics identified in the text.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "confidence",
      name: "Number from 0 to 1.0 indicating AI's certainty.",
    },
    {
      element: "storageInput",
      storeAs: "language",
      name: "Two-letter language code (e.g., en, es) or Unknown.",
    },
  ],

  async run(values, interaction, client, bridge) {
      for (const moduleName of this.modules) {
          await client.getMods().require(moduleName)
      }

      const {
          Censorly,
          analyzeMessage
      } = require('censorly');

      const censorly = new Censorly(bridge.transf(values.key));

      try {
          const result = await censorly.analyzeMessage(bridge.transf(values.text));
          bridge.store(values.flagged, result?.flagged);
          bridge.store(values.topics, result?.topics);
          bridge.store(values.confidence, result?.confidence);
          bridge.store(values.language, result?.language);
      } catch (error) {
          console.error('Error analyzing text:', error.message);
      }

  },
};