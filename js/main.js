const historyUI = document.getElementById('gameHistory');
const playerTitleUI = document.getElementById('player1TitleColor');
const cpuTitleUI = document.getElementById('player2TitleColor');

const addHistoryItem = (owner, stepStr) => {
  const span = document.createElement('span');
  span.classList.add(owner+'Figures');
  span.innerText = stepStr;
  historyUI.prepend(span);
}

let gameBoard = null;
let chassesImg = null;
let player1 = null, player2 = null;

function preload() {
  chassesImg = loadImage('./assets/chess2.png')
}

function setup() {
  const canv = createCanvas(w, h);
  canv.parent('app')
  frameRate(10);
  // pixelDensity(2);
  settings.boardX = settings.paddingX - settings.cellSize * 0.75;
  settings.boardY = settings.paddingY - settings.cellSize * 0.55;
  settings.boardSize = settings.cellsPerLine * settings.cellSize + settings.cellSize * 1.55;

  gameBoard = GameBoard(settings.cellsPerLine, settings.cellsPerLine, settings.cellSize)

  const [figureColor1, figureColor2] = shuffle(settings.owners);

  player1 = new PlayerEntity('dev', figureColor1, gameBoard, playerTitleUI);
  player2 = new PlayerEntity('cpu', figureColor2, gameBoard, cpuTitleUI);

  gameBoard.start(player1, player2)
}

function draw() {
  background(settings.bg);
  textFont(settings.textFont);
  gameBoard.drawBorder();
  gameBoard.drawCells();
  // TODO: rewrite: call from gameBoard
  player1.drawSelected();
  player2.drawSelected();

  gameBoard.drawFigures();

  gameBoard.checkWinner((winner) => {
    const str = `👑 ${winner.name} win!`;
    fill('rgba(199,199,199,0.82)');
    rect(0, 0, w, h);
    textSize(66);
    fill('#000');
    text(str, w/2-(str.length*20), h/2)
    noLoop();
  });
}

function mousePressed() {
  // TODO: rewrite: call from gameBoard
  player1.move();
  player2.move();
}
