modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Canvas Game Snake Generator",
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
      name: "GameId",
      storeAs: "gameId",
    },
    "-",
        {
      element: "typedDropdown",
      name: "Move",
      storeAs: "move",
      choices: {
        none: { name: "None" },
        left: { name: "Left" },
        right: { name: "Right" },
        up: { name: "Up" },
        down: { name: "Down" },
      }
    },
    "-",
    {
      element: "storageInput",
      storeAs: "canvas",
      name: "Canvas",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "newgameId",
      name: "New GameId",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "maxvalue",
      name: "Snake length",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "score",
      name: "Score",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "moves",
      name: "Moves",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  async run(values, interaction, client, bridge) {
      for (const moduleName of this.modules) {
          await client.getMods().require(moduleName);
      }

      const {
          createCanvas
      } = require("canvas");

      const COLORS = {
          background: "#789a46",
          snakeHead: "#000000",
          snakeBody: "#000000",
          food: "red",
          border: "#000000",
          text: "#ffffff",
          shadow: "rgba(0, 0, 0, 0.5)",
      };

      const BOARD_SIZE = 15;
      const TILE_SIZE = 20;
      const PADDING = 5;
      const BORDER_WIDTH = 2;

      function createEmptyBoard() {
          return Array.from({
              length: BOARD_SIZE
          }, () => Array(BOARD_SIZE).fill(0));
      }

      function startGame() {
          const board = createEmptyBoard();
          let snake = [
              [5, 5],
              [5, 4],
              [5, 3],
          ];
          let food = spawnFood(board, snake);

          const gameState = {
              board,
              snake,
              food,
              moves: 0,
              score: 0,
              gameOver: false,
          };

          placeSnakeAndFoodOnBoard(gameState);
          return encodeGameStateToGameId(gameState);
      }

      function placeSnakeAndFoodOnBoard(state) {
          const {
              board,
              snake,
              food
          } = state;

          for (let r = 0; r < BOARD_SIZE; r++) {
              for (let c = 0; c < BOARD_SIZE; c++) {
                  board[r][c] = 0;
              }
          }

          const [fx, fy] = food;
          board[fx][fy] = "food";

          for (let i = 0; i < snake.length; i++) {
              const [r, c] = snake[i];
              board[r][c] = i === 0 ? "head" : "body";
          }
      }

      function spawnFood(board, snake) {
          const occupied = new Set(snake.map(([r, c]) => `${r},${c}`));
          const emptyCells = [];

          for (let r = 0; r < BOARD_SIZE; r++) {
              for (let c = 0; c < BOARD_SIZE; c++) {
                  if (!occupied.has(`${r},${c}`)) {
                      emptyCells.push([r, c]);
                  }
              }
          }

          if (emptyCells.length === 0) return null;
          return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }

      function moveSnake(gameState, direction) {
          if (gameState.gameOver) return gameState;

          let {
              snake,
              food,
              moves,
              score
          } = gameState;
          const [headRow, headCol] = snake[0];

          let newRow = headRow;
          let newCol = headCol;

          switch (direction) {
              case "up":
                  newRow--;
                  break;
              case "down":
                  newRow++;
                  break;
              case "left":
                  newCol--;
                  break;
              case "right":
                  newCol++;
                  break;
              default:
                  return gameState;
          }

          if (
              newRow < 0 ||
              newRow >= BOARD_SIZE ||
              newCol < 0 ||
              newCol >= BOARD_SIZE ||
              snake.some(([r, c]) => r === newRow && c === newCol)
          ) {
              return {
                  ...gameState,
                  gameOver: true,
              };
          }

          const newSnake = [
              [newRow, newCol], ...snake
          ];
          const ateFood = newRow === food[0] && newCol === food[1];

          if (ateFood) {
              score += 1;
          } else {
              newSnake.pop();
          }

          const newFood = ateFood ? spawnFood(createEmptyBoard(), newSnake) : food;

          const updatedState = {
              ...gameState,
              snake: newSnake,
              food: newFood,
              moves: moves + 1,
              score,
              gameOver: false,
          };

          placeSnakeAndFoodOnBoard(updatedState);
          return updatedState;
      }

      function encodeGameStateToGameId(state) {
          return Buffer.from(JSON.stringify(state)).toString("base64");
      }

      function decodeGameIdToGameState(gameId) {
          try {
              const decodedString = Buffer.from(gameId, "base64").toString("utf-8");
              return JSON.parse(decodedString);
          } catch (e) {
              console.error("Incorrect format gameId");
              return null;
          }
      }

      function makeMove(gameId, direction) {
          const gameState = decodeGameIdToGameState(gameId);

          if (!gameState || gameState.gameOver) {
              return startGame();
          }

          const newGameState = moveSnake(gameState, direction);
          return encodeGameStateToGameId(newGameState);
      }

      async function renderBoardToImage(gameId) {
          const gameState = decodeGameIdToGameState(gameId);
          if (!gameState) throw new Error("Couldn't decode gameId");

          const {
              board,
              moves,
              score,
              gameOver
          } = gameState;

          const canvasSize =
              TILE_SIZE * BOARD_SIZE + PADDING * (BOARD_SIZE + 1) + 2 * BORDER_WIDTH;
          const canvas = createCanvas(canvasSize, canvasSize + 50);
          const ctx = canvas.getContext("2d");

          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(0, 0, canvas.width, 50);

          ctx.fillStyle = COLORS.shadow;
          ctx.font = "bold 30px Arial";
          ctx.textAlign = "center";

          const textPaddingTop = 10;

          ctx.fillStyle = COLORS.text;
          ctx.fillText(
              `Score: ${score} | Moves: ${moves}`,
              canvas.width / 2,
              25 + textPaddingTop,
          );

          const gameAreaY = 50;

          ctx.fillStyle = COLORS.background;
          ctx.fillRect(0, gameAreaY, canvas.width, canvas.height - gameAreaY);

          ctx.strokeStyle = COLORS.border;
          ctx.lineWidth = BORDER_WIDTH;
          ctx.strokeRect(
              BORDER_WIDTH / 2,
              gameAreaY + BORDER_WIDTH / 2,
              canvas.width - BORDER_WIDTH,
              canvas.height - gameAreaY - BORDER_WIDTH,
          );

          for (let row = 0; row < BOARD_SIZE; row++) {
              for (let col = 0; col < BOARD_SIZE; col++) {
                  const x = BORDER_WIDTH + PADDING + col * (TILE_SIZE + PADDING);
                  const y =
                      gameAreaY + BORDER_WIDTH + PADDING + row * (TILE_SIZE + PADDING);

                  if (board[row][col] === "head") {
                      ctx.fillStyle = COLORS.snakeHead;
                      ctx.strokeStyle = "#ffffff";
                      ctx.lineWidth = 2;
                      ctx.beginPath();
                      ctx.rect(x, y, TILE_SIZE, TILE_SIZE);
                      ctx.fill();
                      ctx.stroke();

                      ctx.fillStyle = "#ffffff";
                      ctx.beginPath();
                      ctx.arc(
                          x + TILE_SIZE / 4,
                          y + TILE_SIZE / 4,
                          TILE_SIZE / 10,
                          0,
                          Math.PI * 2,
                      );
                      ctx.fill();
                      ctx.beginPath();
                      ctx.arc(
                          x + (TILE_SIZE * 3) / 4,
                          y + TILE_SIZE / 4,
                          TILE_SIZE / 10,
                          0,
                          Math.PI * 2,
                      );
                      ctx.fill();

                      ctx.fillStyle = "#ffffff";
                      ctx.beginPath();
                      ctx.arc(
                          x + TILE_SIZE / 2,
                          y + (TILE_SIZE * 3) / 4,
                          TILE_SIZE / 10,
                          0,
                          Math.PI * 2,
                      );
                      ctx.fill();
                  } else if (board[row][col] === "body") {
                      ctx.fillStyle = COLORS.snakeBody;
                      ctx.strokeStyle = "#ffffff";
                      ctx.lineWidth = 2;
                      ctx.beginPath();
                      ctx.rect(x, y, TILE_SIZE, TILE_SIZE);
                      ctx.fill();
                      ctx.stroke();
                  } else if (board[row][col] === "food") {
                      ctx.save();

                      const gradient = ctx.createRadialGradient(
                          x + TILE_SIZE / 2,
                          y + TILE_SIZE / 2,
                          0,
                          x + TILE_SIZE / 2,
                          y + TILE_SIZE / 2,
                          TILE_SIZE / 2,
                      );
                      gradient.addColorStop(0, "#ff6347");
                      gradient.addColorStop(1, "#f05948");
                      ctx.fillStyle = gradient;
                      ctx.beginPath();
                      ctx.arc(
                          x + TILE_SIZE / 2,
                          y + TILE_SIZE / 2,
                          TILE_SIZE / 2,
                          0,
                          Math.PI * 2,
                      );
                      ctx.fill();

                      ctx.fillStyle = "green";
                      ctx.beginPath();
                      ctx.arc(
                          x + TILE_SIZE / 2,
                          y + TILE_SIZE / 4,
                          TILE_SIZE / 8,
                          0,
                          Math.PI * 2,
                      );
                      ctx.fill();

                      ctx.restore();
                  }
              }
          }

          if (gameOver) {
              ctx.fillStyle = "red";
              ctx.font = "bold 30px Arial";
              ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
          }

          return canvas.toBuffer();
      }

      function getMaxTile(gameState) {
          return gameState?.snake?.length || 0;
      }

      (async () => {
          let currentGameId = bridge.transf(values.gameId);

          if (!currentGameId) {
              currentGameId = startGame();
          }

          switch (values.move.type) {
              case "none":
                  break;
              case "left":
                  currentGameId = makeMove(currentGameId, "left");
                  break;
              case "right":
                  currentGameId = makeMove(currentGameId, "right");
                  break;
              case "up":
                  currentGameId = makeMove(currentGameId, "up");
                  break;
              case "down":
                  currentGameId = makeMove(currentGameId, "down");
                  break;
              default:
                  break;
          }

          const imageBuffer = await renderBoardToImage(currentGameId);

          bridge.store(values.canvas, imageBuffer);
          bridge.store(values.newgameId, currentGameId);
          bridge.store(
              values.maxvalue,
              getMaxTile(decodeGameIdToGameState(currentGameId)),
          );
          bridge.store(values.score, decodeGameIdToGameState(currentGameId)?.score);
          bridge.store(values.moves, decodeGameIdToGameState(currentGameId)?.moves);
      })();

  },
};
