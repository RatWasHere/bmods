module.exports = {
  data: {
    name: "Canvas Draw Text on Image",
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
      element: "input",
      name: "Local Font URL",
      storeAs: "fontURL",
    },
    {
      element: "input",
      name: "Font Color (Hex)",
      storeAs: "fontColor",
    },
    {
      element: "input",
      name: "Text",
      storeAs: "text",
    },
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
      name: "Alignment",
      storeAs: "alignment",
      choices: [
        {
          name: "Top Left",
        },
        {
          name: "Top Center",
        },
        {
          name: "Top Right",
        },
        {
          name: "Middle Left",
        },
        {
          name: "Middle Center",
        },
        {
          name: "Middle Right",
        },
        {
          name: "Bottom Left",
        },
        {
          name: "Bottom Center",
        },
        {
          name: "Bottom Right",
        },
      ],
    },
    {
      element: "input",
      name: "Font Size",
      storeAs: "fontSize",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = require("canvas");
    const opentype = require("opentype.js");

    const imageData = await bridge.getImage(values.image);
    const fontURL = bridge.transf(values.fontURL);
    const text = bridge.transf(values.text);
    let fontColor = bridge.transf(values.fontColor);
    if (!fontColor.startsWith("#")) {
      fontColor = `#${fontColor}`;
    }

    let x = parseFloat(bridge.transf(values.x));
    let y = parseFloat(bridge.transf(values.y));
    var fontSize = bridge.transf(values.fontSize);
    if (Number.isNaN(fontSize)) {
      fontSize = 10;
    }

    const loadImage = Canvas.loadImage(imageData);
    const loadFont = opentype.load(fontURL);

    await Promise.all([loadImage, loadFont])
      .then((results) => {
        const image = results[0];
        const font = results[1];
        const canvas = Canvas.createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const textpath = font.getPath(text, 0, 0, fontSize);
        const bounder = textpath.getBoundingBox();
        const width = bounder.x2 - bounder.x1;
        const height = bounder.y2 - bounder.y1;

        switch (values.alignment) {
          case "Top Center":
            x -= width / 2;
            break;
          case "Top Right":
            x -= width;
            break;
          case "Middle Left":
            y -= height / 2;
            break;
          case "Middle Center":
            x -= width / 2;
            y -= height / 2;
            break;
          case "Middle Right":
            x -= width;
            y -= height / 2;
            break;
          case "Bottom Left":
            y -= height;
            break;
          case "Bottom Center":
            x -= width / 2;
            y -= height;
            break;
          case "Bottom Right":
            x -= width;
            y -= height;
            break;
          default:
            break;
        }

        x -= bounder.x1;
        y -= bounder.y1;

        const Path = font.getPath(text, x, y, fontSize);
        Path.fill = fontColor;
        Path.draw(ctx);

        const buffer = canvas.toBuffer();
        bridge.store(values.store, buffer);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
};
