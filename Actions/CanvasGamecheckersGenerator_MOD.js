modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Canvas Game Сheckers Generator",
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
        move: { name: "move" , field: true },
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
      storeAs: "player",
      name: "Player",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "moves",
      name: "Available Moves",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "errors",
      name: "Erorrs",
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
          empty: '#f0d9b5',
          black: '#000000',
          white: '#ffffff',
          kingBlack: '#1a1a1a',
          kingWhite: '#e0e0e0',
      };

      let errors = [];

      function createCheckersBoard() {
          const board = Array.from({
              length: 8
          }, () => Array(8).fill(0));
          for (let row = 0; row < 3; row++) {
              for (let col = (row % 2); col < 8; col += 2) {
                  board[row][col] = 2;
              }
          }
          for (let row = 5; row < 8; row++) {
              for (let col = (row % 2); col < 8; col += 2) {
                  board[row][col] = 1;
              }
          }
          return board;
      }

      function encodeGameStateToGameId(board, meta = {
          moves: 0,
          turn: 1
      }) {
          const state = {
              board,
              ...meta
          };
          return Buffer.from(JSON.stringify(state)).toString('base64');
      }

      function decodeGameIdToGameState(gameId) {
          try {
              const decodedString = Buffer.from(gameId, 'base64').toString('utf-8');
              return JSON.parse(decodedString);
          } catch (e) {
              errors.push("Incorrect format gameId");
              return null;
          }
      }

      function startCheckersGame() {
          const board = createCheckersBoard();
          return encodeGameStateToGameId(board, {
              moves: 0,
              turn: 1
          });
      }

      const COL_LETTERS = 'ABCDEFGH';

      function rowColToCoord(row, col) {
          return `${COL_LETTERS[col]}${8 - row}`;
      }

      function coordToCol(coordLetter) {
          return COL_LETTERS.indexOf(coordLetter.toUpperCase());
      }

      function coordToRow(coordNumber) {
          return 8 - parseInt(coordNumber);
      }

      function parseMove(moveStr) {
          if (!moveStr || typeof moveStr !== 'string') {
              errors.push(`Incorrect move format: ${moveStr}`);
              return null;
          }

          const separator = moveStr.includes('x') ? 'x' : '-';
          const [fromCoord, toCoord] = moveStr.split(separator);

          if (fromCoord.length !== 2 || toCoord.length !== 2) {
              errors.push(`Incorrect coordinates: ${moveStr}`);
              return null;
          }

          const fromCol = coordToCol(fromCoord[0]);
          const fromRow = coordToRow(fromCoord[1]);
          const toCol = coordToCol(toCoord[0]);
          const toRow = coordToRow(toCoord[1]);

          if ([fromCol, fromRow, toCol, toRow].some(isNaN)) {
              errors.push(`Error in parsing coordinates: ${moveStr}`);
              return null;
          }

          return {
              fromRow,
              fromCol,
              toRow,
              toCol,
              capture: separator === 'x'
          };
      }

      function getPossibleMovesList(board, player) {
          const moves = [];
          const directions = {
              1: [-1],
              2: [1],
              3: [-1, 1],
              4: [-1, 1],
          };

          let canCapture = false;

          for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                  const piece = board[row][col];
                  if ((player === 1 && [1, 3].includes(piece)) || (player === 2 && [2, 4].includes(piece))) {
                      for (let dir of directions[piece]) {
                          for (let step of [-1, 1]) {
                              const overRow = row + dir;
                              const overCol = col + step;
                              const toRow = row + dir * 2;
                              const toCol = col + step * 2;

                              if (
                                  toRow >= 0 && toRow < 8 &&
                                  toCol >= 0 && toCol < 8 &&
                                  board[toRow][toCol] === 0 &&
                                  board[overRow][overCol] !== 0 &&
                                  ((player === 1 && [2, 4].includes(board[overRow][overCol])) ||
                                      (player === 2 && [1, 3].includes(board[overRow][overCol])))
                              ) {
                                  moves.push(`${rowColToCoord(row, col)}x${rowColToCoord(toRow, toCol)}`);
                                  canCapture = true;
                              }
                          }
                      }
                  }
              }
          }

          if (canCapture) {
              return moves;
          }

          for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                  const piece = board[row][col];
                  if ((player === 1 && [1, 3].includes(piece)) || (player === 2 && [2, 4].includes(piece))) {
                      for (let dir of directions[piece]) {
                          for (let step of [-1, 1]) {
                              const newRow = row + dir;
                              const newCol = col + step;

                              if (
                                  newRow >= 0 && newRow < 8 &&
                                  newCol >= 0 && newCol < 8 &&
                                  board[newRow][newCol] === 0
                              ) {
                                  moves.push(`${rowColToCoord(row, col)}-${rowColToCoord(newRow, newCol)}`);
                              }
                          }
                      }
                  }
              }
          }

          return moves;
      }

      function makeMove(gameId, fromRow, fromCol, toRow, toCol) {
          const gameState = decodeGameIdToGameState(gameId);
          if (!gameState) return gameId;

          const {
              board,
              turn
          } = gameState;
          const piece = board[fromRow][fromCol];

          if (
              piece === 0 ||
              (turn === 1 && ![1, 3].includes(piece)) ||
              (turn === 2 && ![2, 4].includes(piece))
          ) {
              errors.push("Invalid move: The piece does not belong to the current player.");
              return gameId;
          }

          const possibleMoves = getPossibleMovesList(board, turn);
          const hasCaptures = possibleMoves.some(move => move.includes('x'));

          const isCaptureMove = Math.abs(toRow - fromRow) === 2;
          if (hasCaptures && !isCaptureMove) {
              errors.push("You can't make a simple move when there are moves in which to kill.");
              return gameId;
          }

          const isSimpleMove = Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 1;
          if (!isSimpleMove && !isCaptureMove) {
              errors.push("Invalid move: incorrect distance.");
              return gameId;
          }

          if (isCaptureMove) {
              const overRow = fromRow + (toRow - fromRow) / 2;
              const overCol = fromCol + (toCol - fromCol) / 2;
              const enemyPiece = board[overRow][overCol];

              if (
                  enemyPiece === 0 ||
                  (turn === 1 && ![2, 4].includes(enemyPiece)) ||
                  (turn === 2 && ![1, 3].includes(enemyPiece))
              ) {
                  errors.push("Unacceptable capture: there is no enemy between the positions.");
                  return gameId;
              }

              board[overRow][overCol] = 0;
          }

          board[toRow][toCol] = board[fromRow][fromCol];
          board[fromRow][fromCol] = 0;

          if (toRow === 0 && board[toRow][toCol] === 1) board[toRow][toCol] = 3;
          if (toRow === 7 && board[toRow][toCol] === 2) board[toRow][toCol] = 4;

          const canCaptureAgain = checkFurtherCaptures(board, toRow, toCol, turn);
          const newTurn = canCaptureAgain ? turn : turn === 1 ? 2 : 1;

          return encodeGameStateToGameId(board, {
              moves: gameState.moves + 1,
              turn: newTurn
          });
      }

      function checkFurtherCaptures(board, row, col, player) {
          const piece = board[row][col];
          const directions = {
              1: [-1],
              2: [1],
              3: [-1, 1],
              4: [-1, 1],
          };
          const dirs = directions[piece] || [];
          for (let dir of dirs) {
              for (let step of [-1, 1]) {
                  const overRow = row + dir;
                  const overCol = col + step;
                  const toRow = row + dir * 2;
                  const toCol = col + step * 2;

                  if (
                      overRow >= 0 && overRow < 8 &&
                      overCol >= 0 && overCol < 8 &&
                      toRow >= 0 && toRow < 8 &&
                      toCol >= 0 && toCol < 8
                  ) {
                      const enemyPiece = board[overRow][overCol];
                      const targetEmpty = board[toRow][toCol] === 0;
                      const isEnemy =
                          (player === 1 && [2, 4].includes(enemyPiece)) ||
                          (player === 2 && [1, 3].includes(enemyPiece));

                      if (enemyPiece !== 0 && targetEmpty && isEnemy) {
                          return true;
                      }
                  }
              }
          }
          return false;
      }

      async function renderBoardToImage(gameId) {
          const gameState = decodeGameIdToGameState(gameId);
          if (!gameState) throw new Error("Couldn't decode gameId");

          const {
              board
          } = gameState;
          const tileSize = 80;
          const padding = 5;
          const margin = 30;
          const canvasSize = tileSize * 8 + padding * 9;
          const totalWidth = canvasSize + margin * 2 + 15;
          const totalHeight = canvasSize + margin * 2 + 30;

          const canvas = createCanvas(totalWidth, totalHeight);
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = "#bbada0";
          ctx.fillRect(0, 0, totalWidth, totalHeight);

          for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                  const x = margin + padding + col * (tileSize + padding);
                  const y = margin + padding + row * (tileSize + padding);
                  ctx.fillStyle = (row + col) % 2 === 0 ? "#f0d9b5" : "#b58763";
                  ctx.fillRect(x, y, tileSize, tileSize);
                  const value = board[row][col];
                  if (value !== 0) {
                      ctx.beginPath();
                      ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 2 - 10, 0, Math.PI * 2);
                      ctx.closePath();

                      switch (value) {
                          case 1:
                              ctx.fillStyle = COLORS.white;
                              break;
                          case 2:
                              ctx.fillStyle = COLORS.black;
                              break;
                          case 3:
                              ctx.fillStyle = COLORS.kingWhite;
                              break;
                          case 4:
                              ctx.fillStyle = COLORS.kingBlack;
                              break;
                      }

                      ctx.fill();

                      if (value === 3 || value === 4) {
                          ctx.strokeStyle = "gold";
                          ctx.lineWidth = 3;
                          ctx.stroke();
                      }
                  }
              }
          }

          ctx.fillStyle = "#000";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          for (let col = 0; col < 8; col++) {
              const x = margin + padding + col * (tileSize + padding) + tileSize / 2;
              const topY = margin - 10;
              const bottomY = margin + padding * 2 + 8 * tileSize + 20 + 30;

              ctx.fillText(letters[col], x, topY);
              ctx.fillText(letters[col], x, bottomY);
          }

          for (let row = 0; row < 8; row++) {
              const yTop = margin + padding + row * (tileSize + padding) + tileSize / 2;
              const leftX = margin - 15;
              const rightX = margin + padding * 2 + 8 * tileSize + 50;

              ctx.fillText(String(8 - row), leftX, yTop);
              ctx.fillText(String(8 - row), rightX, yTop);
          }

          ctx.font = "bold 20px Arial";
          ctx.fillStyle = "#fff";
          ctx.fillText(`Move: ${gameState.turn === 1 ? "White" : "Blacks"}`, totalWidth / 2, totalHeight - 20);

          const possibleMoves = getPossibleMovesList(board, gameState.turn);
          if (possibleMoves.length === 0) {
              let gameOverText = "";
              if (gameState.turn === 1) {
                  gameOverText = "Black wins!";
              } else {
                  gameOverText = "White wins!";
              }

              const opponentMoves = getPossibleMovesList(board, gameState.turn === 1 ? 2 : 1);
              if (opponentMoves.length === 0) {
                  gameOverText = "Draw!";
              }

              ctx.font = "bold 48px Arial";
              ctx.fillStyle = "red";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(gameOverText, totalWidth / 2, totalHeight / 2);
          }

          return canvas.toBuffer();
      }

      (async () => {
          let currentGameId = bridge.transf(values.gameId);
          if (!currentGameId) {
              currentGameId = startCheckersGame();
          }

          if (values.move?.type === "move") {
              const parsedMove = parseMove(bridge.transf(values.move?.value));
              if (parsedMove) {
                  currentGameId = makeMove(
                      currentGameId,
                      parsedMove.fromRow,
                      parsedMove.fromCol,
                      parsedMove.toRow,
                      parsedMove.toCol
                  );
              }
          }

          const gameState = decodeGameIdToGameState(currentGameId);

          const imageBuffer = await renderBoardToImage(currentGameId);
          bridge.store(values.canvas, imageBuffer);
          bridge.store(values.newgameId, currentGameId);
          bridge.store(values.player, gameState.turn);
          bridge.store(values.moves, getPossibleMovesList(gameState.board, gameState.turn));
          bridge.store(values.errors, errors);
      })();

  },
};
