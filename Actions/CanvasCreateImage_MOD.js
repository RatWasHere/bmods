module.exports = {
  data: {
    name: "Canvas Create Image",
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
  },
  UI: [
    {
      element: "input",
      storeAs: "url",
      name: "Local/Web URL",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = require("canvas");
    try {
      const image = await Canvas.loadImage(bridge.transf(values.url));
      const canvas = Canvas.createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const result = canvas.toBuffer();
      bridge.store(values.store, result);
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
