modVersion = "v1.0.1";

module.exports = {
  data: {
    name: "Canvas Game 2048 Generator",
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
      name: "Max value",
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
      } = require('canvas');

      const COLORS = {
          0: '#cdc1b4',
          2: '#eee4da',
          4: '#ede0c8',
          8: '#f2b179',
          16: '#f59563',
          32: '#f67c5f',
          64: '#f65e3b',
          128: '#edcf72',
          256: '#edcc61',
          512: '#edc850',
          1024: '#edc53f',
          2048: '#edc22e',
          default: '#3c3a32'
      };

      function createEmptyBoard() {
          return Array.from({
              length: 4
          }, () => Array(4).fill(0));
      }

      function addRandomTile(board) {
          const emptyCells = [];
          for (let r = 0; r < 4; r++) {
              for (let c = 0; c < 4; c++) {
                  if (board[r][c] === 0) emptyCells.push([r, c]);
              }
          }
          if (emptyCells.length === 0) return;
          const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          board[r][c] = Math.random() < 0.9 ? 2 : 4;
      }

      function moveRowLeft(row) {
          const newRow = row.filter(val => val !== 0);
          for (let i = 0; i < newRow.length - 1; i++) {
              if (newRow[i] === newRow[i + 1]) {
                  newRow[i] *= 2;
                  newRow[i + 1] = 0;
              }
          }
          return newRow.filter(val => val !== 0).concat(Array(4 - newRow.filter(val => val !== 0).length).fill(0));
      }

      function move(board, direction) {
          let newBoard = JSON.parse(JSON.stringify(board));

          if (direction === 'left') {
              newBoard = newBoard.map(row => moveRowLeft(row));
          } else if (direction === 'right') {
              newBoard = newBoard.map(row => moveRowLeft(row.reverse()).reverse());
          } else if (direction === 'up') {
              newBoard = transpose(newBoard).map(row => moveRowLeft(row));
              newBoard = transpose(newBoard);
          } else if (direction === 'down') {
              newBoard = transpose(newBoard).map(row => moveRowLeft(row.reverse()).reverse());
              newBoard = transpose(newBoard);
          }

          return newBoard;
      }

      function transpose(matrix) {
          return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
      }

      function encodeGameStateToGameId(board, moves = 0) {
          const state = {
              board,
              moves
          };
          return Buffer.from(JSON.stringify(state)).toString('base64');
      }

      function decodeGameIdToGameState(gameId) {
          try {
              const decodedString = Buffer.from(gameId, 'base64').toString('utf-8');
              return JSON.parse(decodedString);
          } catch (e) {
              console.error("Incorrect format gameId");
              return null;
          }
      }

      function startGame() {
          const board = createEmptyBoard();
          addRandomTile(board);
          addRandomTile(board);
          return encodeGameStateToGameId(board, 0);
      }

      function makeMove(gameId, direction) {
          const gameState = decodeGameIdToGameState(gameId);
          if (!gameState) return gameId;

          const {
              board,
              moves
          } = gameState;

          const oldBoard = board;
          const newBoard = move(oldBoard, direction);

          if (!arraysEqual(oldBoard.flat(), newBoard.flat())) {
              addRandomTile(newBoard);
              return encodeGameStateToGameId(newBoard, moves + 1);
          }

          return encodeGameStateToGameId(newBoard, moves);
      }

      function arraysEqual(a, b) {
          return a.every((val, i) => val === b[i]);
       }

      function getMaxTile(board) {
          return Math.max(...board.flat())
       }

      async function renderBoardToImage(gameId) {
          const gameState = decodeGameIdToGameState(gameId);
          if (!gameState) throw new Error("Couldn't decode gameId");

          const {
              board,
              moves
          } = gameState;

          const tileSize = 100;
          const padding = 10;
          const canvasSize = tileSize * 4 + padding * 5;
          const canvas = createCanvas(canvasSize, canvasSize);
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = "#bbada0";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          for (let row = 0; row < 4; row++) {
              for (let col = 0; col < 4; col++) {
                  const value = board[row][col];
                  const color = COLORS[value] || COLORS.default;
                  const x = padding + col * (tileSize + padding);
                  const y = padding + row * (tileSize + padding);

                  ctx.fillStyle = color;
                  ctx.fillRect(x, y, tileSize, tileSize);

                  if (value !== 0) {
                      ctx.fillStyle = value > 4 ? "white" : "black";
                      ctx.font = "bold 40px Arial";
                      ctx.textAlign = "center";
                      ctx.textBaseline = "middle";
                      ctx.fillText(value.toString(), x + tileSize / 2, y + tileSize / 2);
                  }
              }
          }

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(canvasSize - 150, 10, 140, 40);

          ctx.fillStyle = "#333";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`Moves: ${moves}`, canvasSize - 75, 30);

          return canvas.toBuffer();
      }

      (async () => {
          let currentGameId = bridge.transf(values.gameId);

          if (!currentGameId) {
              currentGameId = startGame();
          }


          switch (values.move.type) {
              case "none":
                  break
              case "left":
                  currentGameId = makeMove(currentGameId, 'left');
                  break
              case "right":
                  currentGameId = makeMove(currentGameId, 'right');
                  break;
              case "up":
                  currentGameId = makeMove(currentGameId, 'up');
                  break;
              case "down":
                  currentGameId = makeMove(currentGameId, 'down');
                  break;
              default:
                  break
          }

          const imageBuffer = await renderBoardToImage(currentGameId);

          bridge.store(values.canvas, imageBuffer)
          bridge.store(values.newgameId, currentGameId)
          bridge.store(values.maxvalue, getMaxTile(decodeGameIdToGameState(currentGameId).board))
      })();

  },
};
