module.exports = {
  data: {
    name: "Generate Random Word(s)",
  },

  UI: [
    {
      element: "inputGroup",
      nameSchemes: ["Minimum Range", "Maximum Range"],
      storeAs: ["min", "max"],
      placeholder: ["1", "1"],
    },
    "-",
    {
      element: "input",
      name: "Words Per String",
      storeAs: "wps",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
  ],
  subtitle: "Min: $[min]$ - Max: $[max]$ - WPS: $[wps]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const min = parseInt(bridge.transf(values.min));
    const max = parseInt(bridge.transf(values.max));
    const wordsPerString = parseInt(bridge.transf(values.wps));

    const randomWords = await client.getMods().require("random-words", "1.3.0");

    const words = randomWords({ min, max, wordsPerString });
    bridge.store(values.store, words);
  },
};
