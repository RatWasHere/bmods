module.exports = {
  data: {
    name: "Generate Rank Card",
  },
  modules: ["canvacord", "canvas"],
  category: "Images",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  UI: [
    {
      element: "typedDropdown",
      name: "Card Style",
      storeAs: "cardStyle",
      choices: {
        canvacord: { name: "Canvacord" },
        lurkr: { name: "Lurkr" },
        arcane: { name: "Arcane" },
      },
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["username", "displayName"],
      nameSchemes: ["Username", "Display Name"],
    },
    "-",
    {
      element: "input",
      storeAs: "avatar",
      name: "Avatar URL",
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["current", "required"],
      nameSchemes: ["Current XP", "Required XP"],
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["level", "rank"],
      nameSchemes: ["Level", "Rank"],
    },
    // UI 9/10 "-" and Status
    "-",
    {
      element: "input",
      storeAs: "status",
      name: "Status (optional)",
    },
    "-",
    {
      element: "input",
      storeAs: "background",
      name: "Background Image URL (optional)",
    },
    // UI 13/14 "-" and Overlay Percent
    "-",
    {
      element: "input",
      storeAs: "overlay",
      name: "Overlay Percent (optional)",
    },
    // UI 15/16 "-" and Bar Color
    "-",
    {
      element: " ",
      storeAs: "barColor",
      name: "Progress Bar HEX (optional)",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Image As",
      storeAs: "store",
    },
  ],

  script: (values) => {
    try {
      function refreshElements() {
        type = values.data.cardStyle.type;

        switch (type) {
          case "lurkr": {
            // Display Name
            values.UI[2].element = "inputGroup";
            values.UI[2].storeAs = ["username", "displayName"];
            values.UI[2].nameSchemes = ["Username", "Display Name"];
            // Status
            values.UI[9] = " ";
            values.UI[10].element = " ";
            // Overlay Percent
            values.UI[13] = " ";
            values.UI[14].element = " ";
            // Bar Color
            values.UI[15] = "-";
            values.UI[16].element = "input";
            break;
          }

          case "canvacord": {
            // Display Name
            values.UI[2].element = "inputGroup";
            values.UI[2].storeAs = ["username", "displayName"];
            values.UI[2].nameSchemes = ["Username", "Display Name"];
            // Status
            values.UI[9] = "-";
            values.UI[10].element = "input";
            // Overlay Percent
            values.UI[13] = "-";
            values.UI[14].element = "input";
            // Bar Color
            values.UI[15] = " ";
            values.UI[16].element = " ";
            break;
          }

          case "arcane": {
            // Display Name
            values.UI[2].element = "input";
            values.UI[2].storeAs = "username";
            values.UI[2].name = "Username";
            // Status
            values.UI[9] = " ";
            values.UI[10].element = " ";
            // Overlay Percent
            values.UI[13] = " ";
            values.UI[14].element = " ";
          }
        }

        setTimeout(() => {
          values.updateUI();
        }, values.commonAnimation * 100);
      }

      refreshElements();

      values.events.on("change", () => {
        refreshElements();
      });
    } catch (err) {
      console.error(err);
    }
  },

  async run(values, interaction, client, bridge) {
    const canvacord = await client.getMods().require("canvacord");
    canvacord.Font.loadDefault();

    const type = values.cardStyle.type;

    try {
      let buffer;
      switch (type) {
        case "canvacord": {
          const rank = new canvacord.RankCardBuilder()
            .setAvatar(bridge.transf(values.avatar))
            .setCurrentXP(bridge.transf(values.current))
            .setRequiredXP(bridge.transf(values.required))
            .setRank(bridge.transf(values.rank))
            .setLevel(bridge.transf(values.level))
            .setUsername(bridge.transf(values.username))
            .setDisplayName(bridge.transf(values.displayName));

          if (values.status) {
            rank.setStatus(bridge.transf(values.status));
          }

          if (values.background) {
            rank.setBackground(bridge.transf(values.background));
          }

          if (values.overlay) {
            rank.setOverlay(Number(bridge.transf(values.overlay)));
          }

          buffer = await rank.build();
          break;
        }

        case "lurkr": {
          const { createCanvas, loadImage } = await client
            .getMods()
            .require("canvas");

          const width = 1600;
          const height = 400;

          let displayName = bridge.transf(values.displayName);
          if (
            !values.displayName ||
            !displayName ||
            displayName === "undefined"
          ) {
            displayName = bridge.transf(values.username);
          }

          const user = {
            username: displayName,
            avatar: bridge.transf(values.avatar),
            rank: bridge.transf(values.rank),
            level: bridge.transf(values.level),
            xp: bridge.transf(values.current),
            xpNeeded: bridge.transf(values.required),
          };

          const canvas = createCanvas(width, height);
          const ctx = canvas.getContext("2d");

          if (values.background) {
            const backgroundImage = await loadImage(
              bridge.transf(values.background)
            );

            ctx.drawImage(backgroundImage, 0, 0, width, height);
          } else {
            ctx.fillStyle = "#2f3136";
            ctx.fillRect(0, 0, width, height);
          }

          // Rounded avatar helper
          function drawRoundedImage(ctx, img, x, y, width, height, radius) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
          }

          // Load avatar and draw
          let avatar = await loadImage(user.avatar);

          const avatarX = 50;
          const avatarY = 50;
          const avatarSize = 300;
          const padding = 40;

          const barHeight = 70;
          const barRadius = 35;

          const barY = avatarY + avatarSize - barHeight;
          const barX = avatarX + avatarSize + padding;
          const barWidth = width - barX - 60;

          drawRoundedImage(
            ctx,
            avatar,
            avatarX,
            avatarY,
            avatarSize,
            avatarSize,
            50
          );

          const usernameX = avatarX + avatarSize + 40;
          const usernameY = barY - 30;

          let font = "sans-serif";

          ctx.font = `60px ${font}`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(user.username, usernameX, usernameY);

          const rankText = `RANK #${user.rank}`;
          const levelText = `LEVEL ${user.level}`;

          ctx.font = `60px ${font}`;
          const rankWidth = ctx.measureText(rankText).width;
          ctx.font = `80px ${font}`;
          const levelWidth = ctx.measureText(levelText).width;

          const rankLevelPadding = 30;
          const rankLevelTotalWidth = rankWidth + rankLevelPadding + levelWidth;
          const rankLevelStartX = width - rankLevelTotalWidth - 60;

          ctx.font = `60px ${font}`;
          ctx.fillStyle = "#f7a420";
          ctx.fillText(rankText, rankLevelStartX, 90);

          ctx.font = `80px ${font}`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(
            levelText,
            rankLevelStartX + rankWidth + rankLevelPadding,
            90
          );

          const xpLeftText = `${(
            user.xpNeeded - user.xp
          ).toLocaleString()} XP left`;
          const xpText = `${user.xp.toLocaleString()} XP`;

          ctx.font = `60px ${font}`;
          ctx.fillStyle = "#ffffff";
          const xpWidth = ctx.measureText(xpText).width;
          ctx.fillText(xpText, width - xpWidth - 60, barY - 25);

          ctx.font = `40px ${font}`;
          ctx.fillStyle = "#a9a9a9";
          const xpLeftWidth = ctx.measureText(xpLeftText).width;
          ctx.fillText(xpLeftText, width - xpLeftWidth - 60, barY - 90);

          const progress = user.xp / user.xpNeeded;
          const fillWidth = barWidth * progress;

          ctx.fillStyle = "#24242C";
          ctx.beginPath();
          ctx.roundRect(barX, barY, barWidth, barHeight, barRadius);
          ctx.fill();

          let fillColor = "#1e2124";
          if (values.barColor) {
            fillColor = bridge.transf(values.barColor);
          }

          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.roundRect(barX, barY, fillWidth, barHeight, barRadius);
          ctx.fill();

          buffer = canvas.toBuffer("image/png");
          break;
        }

        case "arcane": {
          const { createCanvas, loadImage } = require("canvas");

          const WIDTH = 800;
          const HEIGHT = 200;

          const user = {
            username: bridge.transf(values.username),
            avatarUrl: bridge.transf(values.avatar),
            rank: bridge.transf(values.rank),
            level: bridge.transf(values.level),
            currentXP: bridge.transf(values.current),
            requiredXP: bridge.transf(values.required),
          };

          const canvas = createCanvas(WIDTH, HEIGHT);
          const ctx = canvas.getContext("2d");

          // Colors
          const backgroundColor = "#1E2327";
          const accentColor = "#3FBEC2";
          const barBackground = "#ffffff";

          // Background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          // Diagonal accent
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.moveTo(WIDTH * 0.75, 0);
          ctx.lineTo(WIDTH, 0);
          ctx.lineTo(WIDTH, HEIGHT);
          ctx.closePath();
          ctx.fill();

          // Avatar
          const avatar = await loadImage(user.avatarUrl);
          const avatarSize = 100;
          const avatarX = 20;
          const avatarY = 20;
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            avatarX + avatarSize / 2,
            avatarY + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2
          );
          ctx.clip();
          ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
          ctx.restore();

          // Username
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 28px sans-serif";
          ctx.fillText(`@${user.username}`, 140, 60);

          // Underline
          const textWidth = ctx.measureText(`@${user.username}`).width;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(140, 65);
          ctx.lineTo(140 + textWidth, 65);
          ctx.stroke();

          // Stats text (Level, XP, Rank)
          ctx.font = "20px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(`Level: ${user.level}`, 140, 95);
          const xpText = `XP: ${user.currentXP} / ${user.requiredXP}`;
          ctx.fillText(xpText, 250, 95);
          const xpTextWidth = ctx.measureText(xpText).width;
          ctx.fillText(`Rank: ${user.rank}`, 260 + xpTextWidth + 10, 95);

          // XP Bar
          const barX = 10;
          const barY = 140;
          const triangleMargin = 100; // adjust this value based on triangle width
          const barWidth = WIDTH - 20 - triangleMargin;
          const barHeight = 30;
          const progress = user.currentXP / user.requiredXP;

          // Bar background
          ctx.fillStyle = barBackground;
          ctx.beginPath();
          ctx.moveTo(barX + barHeight / 2, barY);
          ctx.lineTo(barX + barWidth - barHeight / 2, barY);
          ctx.quadraticCurveTo(
            barX + barWidth,
            barY,
            barX + barWidth,
            barY + barHeight / 2
          );
          ctx.quadraticCurveTo(
            barX + barWidth,
            barY + barHeight,
            barX + barWidth - barHeight / 2,
            barY + barHeight
          );
          ctx.lineTo(barX + barHeight / 2, barY + barHeight);
          ctx.quadraticCurveTo(
            barX,
            barY + barHeight,
            barX,
            barY + barHeight / 2
          );
          ctx.quadraticCurveTo(barX, barY, barX + barHeight / 2, barY);
          ctx.closePath();
          ctx.fill();

          // Progress bar
          const filledWidth = (barWidth - 0) * progress;
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.moveTo(barX + barHeight / 2, barY);
          if (filledWidth >= barHeight) {
            ctx.lineTo(barX + filledWidth - barHeight / 2, barY);
            ctx.quadraticCurveTo(
              barX + filledWidth,
              barY,
              barX + filledWidth,
              barY + barHeight / 2
            );
            ctx.quadraticCurveTo(
              barX + filledWidth,
              barY + barHeight,
              barX + filledWidth - barHeight / 2,
              barY + barHeight
            );
            ctx.lineTo(barX + barHeight / 2, barY + barHeight);
            ctx.quadraticCurveTo(
              barX,
              barY + barHeight,
              barX,
              barY + barHeight / 2
            );
            ctx.quadraticCurveTo(barX, barY, barX + barHeight / 2, barY);
          } else {
            // Handle very low XP case
            ctx.lineTo(barX + filledWidth, barY);
            ctx.lineTo(barX + filledWidth, barY + barHeight);
            ctx.lineTo(barX, barY + barHeight);
            ctx.lineTo(barX, barY);
          }
          ctx.closePath();
          ctx.fill();

          buffer = canvas.toBuffer("image/png");
          break;
        }
      }

      bridge.store(values.store, buffer);
    } catch (error) {
      console.error("Generate Rank Card Error:", error);
    }
  },
};
