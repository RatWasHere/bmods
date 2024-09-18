/*
  Recognize Text From Image Mod by candiedapple
  Licensed under MIT License

  For support ping me on BMD Discord server.
*/

module.exports = {
  modules: ["tesseract"],
  data: {
    name: "Recognize Text From Image",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  category: "Images",
  UI: [
    {
      element: "image",
      storeAs: "image",
      name: "Image",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Recognized Text As",
    },
  ],

  async run(values, interaction, client, bridge) {
    const { createWorker } = require("tesseract");

    await (async () => {
      const worker = await createWorker();
      const ret = await worker.recognize(await bridge.getImage(values.image));
      bridge.store(values.store, ret.data.text);
      await worker.terminate();
    })();
  },
};
