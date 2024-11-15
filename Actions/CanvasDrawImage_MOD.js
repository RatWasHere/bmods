module.exports = {
  data: {
    name: "Canvas Draw Image on Image",
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
    {
      element: "variableInsertion",
      storeAs: "imageToDraw",
      name: "Image To Draw",
    },
    "-",
    {
      element: "input",
      name: "X Position",
      storeAs: "x",
    },
    {
      element: "input",
      name: "Y Position",
      storeAs: "y",
    },
    {
      element: "dropdown",
      name: "Draw Effect",
      storeAs: "drawEffect",
      choices: [
        {
          name: "Overlay",
        },
        {
          name: "Mask",
        },
      ],
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = require("canvas");
    const imageData = await bridge.getImage(values.image);
    const imageToDraw = await bridge.getImage(values.imageToDraw);

    let x = parseFloat(bridge.transf(values.x));
    let y = parseFloat(bridge.transf(values.y));
    const loadImage = Canvas.loadImage(imageData);
    const loadImage2 = Canvas.loadImage(imageToDraw);

    await Promise.all([loadImage, loadImage2])
      .then((results) => {
        const image = results[0];
        const image2 = results[1];
        const canvas = Canvas.createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);

        switch (values.drawEffect) {
          case "Mask":
            ctx.globalCompositeOperation = "destination-out";
            break;
          default:
            break;
        }

        ctx.drawImage(image2, x, y, image2.width, image2.height);

        const buffer = canvas.toBuffer();
        bridge.store(values.store, buffer);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
};
