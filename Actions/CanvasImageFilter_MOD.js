module.exports = {
  data: {
    name: "Canvas Image Filter",
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
  },
  UI: [
    {
      element: "variableInsertion",
      storeAs: "image",
      name: "Source Image",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "filter",
      name: "Filter",
      choices: {
        blur: { name: "Blur" },
        huerotate: { name: "Hue Rotate" },
        brightness: { name: "Brightness" },
        contrast: { name: "Contrast" },
        grayscale: { name: "Grayscale" },
        invert: { name: "Invert" },
        opacity: { name: "Opacity" },
        saturate: { name: "Saturate" },
        sepia: { name: "Sepia" },
      },
    },
    {
      element: "input",
      storeAs: "value",
      name: "Value (Percent)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = await client.getMods().require("canvas");
    const Filter = await client.getMods().require("imagedata-filters");
    const imageData = await bridge.getImage(values.image);

    if (!imageData) {
      console.error("Image data is undefined or null.");
      return;
    }

    // If imageData is a buffer, convert it to a base64 string
    const validImageData = Buffer.isBuffer(imageData)
      ? `data:image/png;base64,${imageData.toString("base64")}`
      : imageData;

    let value = parseFloat(bridge.transf(values.value));

    try {
      // Use Promise.all to load the image
      const [imagedata] = await Promise.all([Canvas.loadImage(validImageData)]);

      const canvas = Canvas.createCanvas(imagedata.width, imagedata.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imagedata, 0, 0);
      const imgdata = ctx.getImageData(0, 0, imagedata.width, imagedata.height);
      let imagedata2;

      switch (values.filter.type) {
        case "blur":
          value = (Number(value) / 100).toString();
          imagedata2 = Filter.blur(imgdata, { amount: value });
          break;
        case "huerotate":
          value = ((Number(value) / 180) * Math.PI).toString();
          imagedata2 = Filter.hueRotate(imgdata, { amount: value });
          break;
        case "brightness":
          value = ((100 - Number(value)) / 100).toString();
          imagedata2 = Filter.brightness(imgdata, { amount: value });
          break;
        case "contrast":
          value = ((100 - Number(value)) / 100).toString();
          imagedata2 = Filter.contrast(imgdata, { amount: value });
          break;
        case "grayscale":
          value = (Number(value) / 100).toString();
          imagedata2 = Filter.grayscale(imgdata, { amount: value });
          break;
        case "invert":
          value = (Number(value) / 100).toString();
          imagedata2 = Filter.invert(imgdata, { amount: value });
          break;
        case "opacity":
          value = ((100 - Number(value)) / 100).toString();
          imagedata2 = Filter.opacity(imgdata, { amount: value });
          break;
        case "saturate":
          value = ((100 - Number(value)) / 100).toString();
          imagedata2 = Filter.saturate(imgdata, { amount: value });
          break;
        case "sepia":
          value = (Number(value) / 100).toString();
          imagedata2 = Filter.sepia(imgdata, { amount: value });
          break;
        default:
          throw new Error("Unknown filter type");
      }

      ctx.putImageData(imagedata2, 0, 0);
      const buffer = canvas.toBuffer();
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Error during image processing:", error);
    }
  },
};
