module.exports = {
  data: {
    name: "Canvas Captcha Generator",
  },
  modules: ["canvas", "captcha-generator-alphanumeric"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
  },
  UI: [
    {
      element: "storageInput",
      storeAs: "value",
      name: "Value",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "canvas",
      name: "Canvas",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Captcha = require("captcha-generator-alphanumeric").default;
    const Canvas = require("canvas");

    try {
      let result = new Captcha();

      const image = new Canvas.Image();
      image.src = result.dataURL;
      const canvas = Canvas.createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const canvas_file = canvas.toBuffer();

      bridge.store(values.value, result.value);
      bridge.store(values.canvas, canvas_file);
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
