module.exports = {
  data: {
    name: "Canvas Captcha Generator",
  },
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
      storeAs: "file",
      name: "PNG file",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "canvas",
      name: "Canvas url",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Captcha = require("captcha-generator-alphanumeric").default;

    try {

      let result = new Captcha();

      bridge.store(values.file, result.PNGStream);
      bridge.store(values.file, result.value);
      bridge.store(values.canvas, result.dataURL);
    } catch (error) {
      console.error("Error:", error);
    }
  },
};