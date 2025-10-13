module.exports = {
  data: {
    name: "Canvas Create Progress Circle",
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  UI: [
    {
      element: "input",
      storeAs: "percent",
      name: "Progress Percent",
    },
    "-",
    {
      element: "input",
      storeAs: "size",
      name: "Circle Size (px)",
    },
    "-",
    {
      element: "input",
      storeAs: "lineWidth",
      name: "Line Width (px)",
    },
    "-",
    {
      element: "input",
      storeAs: "rotate",
      name: "Rotation Degree (optional)",
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["backgroundHEX", "percentageHEX"],
      nameSchemes: ["Background HEX", "Percentage HEX"],
    },
    "-",
    {
      element: "toggle",
      name: "Show Percentage?",
      storeAs: "showPercentage",
    },
    {
      element: " ",
      name: "Percentage Text HEX",
      storeAs: "percentageTextHEX",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  script: (values) => {
    function refreshElements() {
      type = String(values.data.showPercentage);

      switch (type) {
        case "true":
          values.UI[11].element = "input";
          break;

        default:
          values.UI[11].element = " ";
          break;
      }

      setTimeout(() => {
        values.updateUI();
      }, values.commonAnimation * 100);
    }

    refreshElements();

    values.events.on("change", () => {
      refreshElements();
    });
  },

  async run(values, interaction, client, bridge) {
    try {
      const { createCanvas } = await client.getMods().require("canvas");
      let rotate = 0;

      if (values.rotate) {
        rotate = Number(bridge.transf(values.rotate));
      }

      const options = {
        percent: Number(bridge.transf(values.percent)),
        size: Number(bridge.transf(values.size)),
        lineWidth: Number(bridge.transf(values.lineWidth)),
        rotate,
      };

      const canvas = createCanvas(options.size, options.size);
      const ctx = canvas.getContext("2d");

      ctx.translate(options.size / 2, options.size / 2);
      ctx.rotate((-0.5 + options.rotate / 180) * Math.PI);

      const radius = (options.size - options.lineWidth) / 2;

      function drawCircle(color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent || 1), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      drawCircle(bridge.transf(values.backgroundHEX), options.lineWidth, 1);
      drawCircle(
        bridge.transf(values.percentageHEX),
        options.lineWidth,
        options.percent / 100
      );

      if (values.showPercentage) {
        ctx.save();

        ctx.rotate((0.5 - options.rotate / 180) * Math.PI);

        ctx.font = `${options.size * 0.2}px sans-serif`;
        ctx.fillStyle = bridge.transf(values.percentageTextHEX);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${options.percent}%`, 0, 0);

        ctx.restore();
      }

      const buffer = canvas.toBuffer("image/png");
      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Canvas Create Progress Circle Error:", error);
    }
  },
};
