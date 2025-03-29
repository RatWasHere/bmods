module.exports = {
  data: {
    name: "Canvas Create Background",
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon , lik_rus",
  },
  UI: [
    {
      element: "inputGroup",
      storeAs: ["width", "height"],
      nameSchemes: ["Width (px)", "Height (px)"]
    },
    "-",
    {
      element: "dropdown", 
      storeAs: "status",
      extraField: "color",
      name: "Color mode", 
      choices: [ 
      { name: "Color (HEX)", field: true, placeholder: "#ff0000" },
      { name: "Gradient color / EVAL", field: false },
      { name: "Gradient Color / Selection", field: false }
       ]
     },
     "_",
    {
      element: "largeInput",
      name: "Gradient color / EVAL",
      storeAs: "coloreval",
      max: 1000
    },
    {
      element: "dropdown", 
      storeAs: "direction",
      name: "Direction", 
      choices: [ 
      { name: "Up and down" },
      { name: "Diagonal left from top to bottom" },
      { name: "From right to left" },
      { name: "Diagonal from top to bottom" },
      { name: "Bottom to top" },
      { name: "Left diagonal from bottom to top" },
      { name: "From left to right" },
      { name: "Diagonal from bottom to top" }
       ]
     },
    {
      element: "menu",
      storeAs: "colorselect",
      name: "Gradient",
      types: {
        data: "Data",
      },
      max: 200,
      UItypes: {
        data: {
          name: "Gradient",
          preview: "`Position: ${option.data.position} | Color: ${option.data.color}`",
          data: { position: "", color: "" },
          UI: [
            {
              element: "input",
              storeAs: "position",
              name: "Position",
            },
            "-",
            {
              element: "input",
              storeAs: "color",
              name: "Color (HEX)",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  script: (data) => {
    function refreshElements() {
      if (data.data.status == 'Color (HEX)') {
        data.UI[4].element = ' '
        data.UI[5].element = ' '
        data.UI[6].element = ' '
      } else if (data.data.status == 'Gradient color / EVAL') {
        data.UI[4].element = 'largeInput'
        data.UI[5].element = ' '
        data.UI[6].element = ' '
      } else if (data.data.status == 'Gradient Color / Selection') {
        data.UI[4].element = ' '
        data.UI[5].element = 'dropdown'
        data.UI[6].element = 'menu'
      }

      setTimeout(() => {
        data.updateUI();
      }, data.commonAnimation * 100);
    }

    refreshElements();
    data.events.on("change", () => {
      refreshElements();
    });
  },

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

      switch (values.status) {
        case "Color (HEX)":
        ctx.fillStyle = color; // Assign the validated color
        ctx.fillRect(0, 0, width, height); // Use fillRect instead of rect + fill
        break;
        case "Gradient color / EVAL":
        eval(String(bridge.transf(values.coloreval)))
        break;
        case "Gradient Color / Selection":
          if(values.direction == "Up and down"){var gradientx = ctx.createLinearGradient(0, 0, 0, height)}
          if(values.direction == "Diagonal left from top to bottom"){var gradientx = ctx.createLinearGradient(0, 0, width, height)}
          if(values.direction == "From right to left"){var gradientx = ctx.createLinearGradient(0, 0, width, 0)}
          if(values.direction == "Diagonal from top to bottom"){var gradientx = ctx.createLinearGradient(width, 0, 0, height)}
          if(values.direction == "4Bottom to top"){var gradientx = ctx.createLinearGradient(0, height, 0, 0)}
          if(values.direction == "Left diagonal from bottom to top"){var gradientx = ctx.createLinearGradient(width, height, 0, 0)}
          if(values.direction == "From left to right"){var gradientx = ctx.createLinearGradient(width, 0, 0, 0)}
          if(values.direction == "Diagonal from bottom to top"){var gradientx = ctx.createLinearGradient(0, height, width, 0)}

          if (Array.isArray(values.colorselect)) {
            for (const dataCase of values.colorselect) {
              if (dataCase.type !== "data") continue;
              let position = bridge.transf(dataCase.data.position);
              var position1 = (position / 100)
              let color = bridge.transf(dataCase.data.color);
              gradientx.addColorStop(position1, color)
            }
          }

          ctx.fillStyle = gradientx;
          ctx.fillRect(0, 0, width, height);
        break;
    }
      const buffer = canvas.toBuffer();
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Error during image processing:", error);
    }
  },
};
