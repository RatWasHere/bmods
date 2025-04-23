module.exports = {
  data: {
    name: "Canvas Generate Progress Bar",
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
      name: "Width",
    },
    {
      element: "input",
      storeAs: "height",
      name: "Height",
    },
    {
      element: "input",
      storeAs: "lineWidth",
      name: "Line Width",
    },
    {
      element: "typedDropdown",
      storeAs: "lineCap",
      name: "Line Cap",
      choices: {
        0: { name: "Square" },
        1: { name: "Round" },
      },
    },
    {
      element: "input",
      storeAs: "percent",
      name: "Percent",
    },
    {
      element: "input",
      storeAs: "color",
      name: "Color (Hex)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = await client.getMods().require("canvas");

    try {
      const width = Math.max(1, parseInt(bridge.transf(values.width), 10));
      const height = Math.max(1, parseInt(bridge.transf(values.height), 10));
      const percent = Math.min(
        100,
        Math.max(0, parseFloat(bridge.transf(values.percent)))
      );
      const lineWidth = Math.min(
        height,
        Math.max(1, parseInt(bridge.transf(values.lineWidth), 10))
      );
      const isRound = values.lineCap?.type === "1";

      const canvas = Canvas.createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background track
      ctx.beginPath();
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = lineWidth;
      ctx.lineCap = isRound ? "round" : "butt";

      if (isRound) {
        const offset = lineWidth / 2;
        ctx.moveTo(offset, height / 2);
        ctx.lineTo(width - offset, height / 2);
      } else {
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
      }
      ctx.stroke();

      // Draw progress
      ctx.beginPath();
      ctx.strokeStyle = bridge.transf(values.color) || "#ffffff";

      if (isRound) {
        const offset = lineWidth / 2;
        ctx.moveTo(offset, height / 2);
        ctx.lineTo(offset + (width - lineWidth) * (percent / 100), height / 2);
      } else {
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width * (percent / 100), height / 2);
      }
      ctx.stroke();

      const buffer = canvas.toBuffer();
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
