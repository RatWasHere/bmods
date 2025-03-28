module.exports = {
  data: {
    name: "Canvas Create Image",
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon , lik_rus",
  },
  UI: [
    {
      element: "input",
      storeAs: "url",
      name: "Local/Web URL",
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["Width", "Height"],
      nameSchemes: ["Width (px or %)", "Height (px or %)"]
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    }
  ],

  async run(values, interaction, client, bridge) {
    const Canvas = await client.getMods().require("canvas");
    try {
      const image = await Canvas.loadImage(bridge.transf(values.url));
      var scalex = bridge.transf(values.Width)
      var scaley = bridge.transf(values.Height)
      if (scalex == '') { scalex = "100%" }
      if (scaley == '') { scaley = "100%" }
      let imagew = image.width
      let imageh = image.height
      let scalew = 1
      let scaleh = 1
      scale(scalex, scaley)
      const canvas = Canvas.createCanvas(imagew, imageh);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, imagew, imageh);
      const result = canvas.toBuffer();
      bridge.store(values.store, result);

      function scale(w, h) {
        if (w.endsWith('%')) {
          const percent = w.replace('%', '')
          scalew = parseInt(percent) / 100
        } else {
          scalew = parseInt(w) / imagew
        }
        if (h.endsWith('%')) {
          const percent = h.replace('%', '')
          scaleh = parseInt(percent) / 100
        } else {
          scaleh = parseInt(h) / imageh
        }
        imagew *= scalew
        imageh *= scaleh
      }
    } catch (error) {
        console.error("Error:", error);
      }
  },
};
