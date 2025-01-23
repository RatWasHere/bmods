module.exports = {
  data: {
    name: "Canvas Create Background",
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
      storeAs: "width",
      name: "Width (px)",
    },
    {
      element: "input",
      storeAs: "height",
      name: "Height (px)",
    },
    {
      element: "input",
      storeAs: "color",
      name: "Color (HEX)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = await client.getMods().require("canvas");
    const width = parseInt(bridge.transf(values.width), 10);
    const height = parseInt(bridge.transf(values.height), 10);
    let color = bridge.transf(values.color);

    try {
      const canvas = Canvas.createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Ensure the color is valid
      if (!color.startsWith("#") && !/^rgb/.test(color)) {
        color = `#${color}`; // Add '#' if missing
      }

      ctx.fillStyle = color; // Assign the validated color
      ctx.fillRect(0, 0, width, height); // Use fillRect instead of rect + fill

      const buffer = canvas.toBuffer();
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Error during image processing:", error);
    }
  },
};
