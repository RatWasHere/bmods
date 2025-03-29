modVersion = "v1.1.0";

module.exports = {
  data: {
    name: "Canvas Captcha Generator",
    length: "8",
    Width: "300",
    Height: "150"
  },
  modules: ["canvas"],
  category: "Canvas Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "input",
      name: "Length",
      storeAs: "length",
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["Width", "Height"],
      nameSchemes: ["Width (px)", "Height (px)"]
    },
    "-",
    {
      element: "storageInput",
      storeAs: "value",
      name: "Value",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "canvas",
      name: "Canvas",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  async run(values, interaction, client, bridge) {
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const { createCanvas } = require('canvas');

    try {
      const width = parseInt(bridge.transf(values.Width));
      const height = parseInt(bridge.transf(values.Height));
      const length = parseInt(bridge.transf(values.length));
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      const text = Array.from({ length: length }, () => 
          String.fromCharCode(
              Math.random() > 0.6 
                  ? Math.random() * 26 + 65  // A-Z
                  : Math.random() * 10 + 48   // 0-9
          )
      ).join('');
      
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#e0e0e0');
      gradient.addColorStop(1, '#f5f5f5');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      for (let i = 0; i < 150; i++) {
          ctx.fillStyle = `hsla(${Math.random() * 360}, 50%, ${Math.random() * 30 + 50}%, ${Math.random() * 0.3 + 0.2})`;
          ctx.beginPath();
          ctx.arc(
              Math.random() * width,
              Math.random() * height,
              Math.random() * 3,
              0, Math.PI * 2
          );
          ctx.fill();
      }
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < text.length; i++) {
          ctx.save();
          
          const fontSize = Math.random() * 15 + 45;
          const rotate = (Math.random() - 0.5) * Math.PI / 4;
          const yOffset = (Math.random() - 0.5) * 30;
          const color = `hsl(${Math.random() * 360}, 50%, 40%)`;
          
          ctx.font = `${fontSize}px Arial`;
          ctx.translate(
              (width / (text.length + 1)) * (i + 1),
              height/2 + yOffset
          );
          ctx.rotate(rotate);
          
          ctx.beginPath();
          ctx.moveTo(-fontSize/2, 0);
          
          const waveLength = fontSize * 1.2;
          const amplitude = fontSize * 0.2;
          for (let x = -fontSize/2; x < fontSize/2; x += 10) {
              ctx.quadraticCurveTo(
                  x + 5, 
                  Math.sin(x / waveLength * Math.PI * 2) * amplitude,
                  x + 10,
                  Math.sin((x + 10) / waveLength * Math.PI * 2) * amplitude
              );
          }
          
          ctx.fillStyle = color;
          ctx.fill();
          
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 3;
          ctx.fillText(text[i], 0, 0);
          ctx.shadowColor = 'transparent';
          
          if (Math.random() > 0.5) {
              ctx.globalAlpha = 0.3;
              ctx.fillRect(-fontSize/2, -fontSize/2, fontSize, fontSize);
              ctx.globalAlpha = 1;
          }
          
          ctx.restore();
      }
      
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.bezierCurveTo(
              Math.random() * width, Math.random() * height,
              Math.random() * width, Math.random() * height,
              Math.random() * width, Math.random() * height
          );
          ctx.stroke();
      }
      
      for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
          ctx.fillRect(
              Math.random() * width,
              Math.random() * height,
              Math.random() * 100 + 50,
              Math.random() * 30 + 10
          );
      }

      const buffer = canvas.toBuffer();
      bridge.store(values.canvas, buffer);
      bridge.store(values.value, text);
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
