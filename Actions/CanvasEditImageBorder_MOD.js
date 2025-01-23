module.exports = {
  data: {
    name: "Canvas Edit Image Border",
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
      storeAs: "circleinfo",
      name: "Circle?",
      choices: {
        yes: { name: "Yes" },
        no: { name: "No" },
      },
    },
    {
      element: "input",
      storeAs: "radius",
      name: "Round Corner Radius",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = await client.getMods().require("canvas");
    const imageData = await bridge.getImage(values.image);

    if (!imageData) {
      console.error("Image data is undefined or null.");
      return;
    }

    // Convert imageData to a valid format if needed
    const validImageData = Buffer.isBuffer(imageData)
      ? `data:image/png;base64,${imageData.toString("base64")}`
      : imageData;

    try {
      // Load the image
      const [imagedata] = await Promise.all([Canvas.loadImage(validImageData)]);

      const canvas = Canvas.createCanvas(imagedata.width, imagedata.height);
      const ctx = canvas.getContext("2d");

      const radius = parseInt(bridge.transf(values.radius), 10) || 0;
      const circleinfo = values.circleinfo === "yes"; // Convert dropdown choice to boolean

      // Function to clip as a circle
      function circle() {
        ctx.beginPath();
        ctx.arc(
          imagedata.width / 2,
          imagedata.height / 2,
          Math.min(imagedata.width, imagedata.height) / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
      }

      // Function to clip with rounded corners
      function corner(r) {
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(imagedata.width - r, 0);
        ctx.quadraticCurveTo(imagedata.width, 0, imagedata.width, r);
        ctx.lineTo(imagedata.width, imagedata.height - r);
        ctx.quadraticCurveTo(
          imagedata.width,
          imagedata.height,
          imagedata.width - r,
          imagedata.height
        );
        ctx.lineTo(r, imagedata.height);
        ctx.quadraticCurveTo(0, imagedata.height, 0, imagedata.height - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();
      }

      // Apply circle or corner clipping
      if (circleinfo && imagedata.width === imagedata.height) {
        circle();
      } else if (radius > 0) {
        corner(radius);
      }

      // Draw the image
      ctx.drawImage(imagedata, 0, 0);

      // Export the canvas as a buffer
      const buffer = canvas.toBuffer();
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Error during image processing:", error);
    }
  },
};
