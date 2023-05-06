const playerTitleUI = document.getElementById('playerTitleColor');
const cpuTitleUI = document.getElementById('cpuTitleColor');

const w = 680, h = 680;

const settings = {
  bg: "#fff", // rgb(162, 144, 214)
  fieldColors: ['#ebd1a6' , '#c2924a'],
  targetCurrColor: '#4ac252',
  enemyVariantColor: '#c24e4a',

  owners: ['black', 'white'],
  textColor: "black",

  textSize: 24,

  boardBg: "#fff",
  boardX: 0, // init setup
  boardY: 0, // init setup
  boardSize: 0, // init setup
  // cell template
  emptyCellItem: {
    iconType: null,
    owner: '',
    name: '',
    tilePos: []
  },
  cellSize: 72,
  cellsPerLine: 8,
  paddingX: 54,
  paddingY: 38,
}

let gameBoard = null;
let chassesImg = null;
let player = null, cpu = null;

function preload() {
  chassesImg = loadImage('./assets/chess2.png')
}

function setup() {
  let canv = createCanvas(w, h);
  canv.parent('app')
  frameRate(10);
  // pixelDensity(2);
  settings.boardX = settings.paddingX - settings.cellSize * 0.75;
  settings.boardY = settings.paddingY - settings.cellSize * 0.55;
  settings.boardSize = settings.cellsPerLine * settings.cellSize + settings.cellSize * 1.55;

  gameBoard = GameBoard(settings.cellsPerLine, settings.cellsPerLine, settings.cellSize)

  const ownersColors = shuffle(settings.owners);

  player = new PlayerEntity('dev', ownersColors[0], gameBoard, playerTitleUI);
  cpu = new PlayerEntity('cpu', ownersColors[1], gameBoard, cpuTitleUI);

  gameBoard.start(player, cpu)
}

function draw() {
  background(settings.bg);
  textFont('monospace');
  gameBoard.drawBorder();
  gameBoard.drawCells();
  // target
  player.drawSelected();
  cpu.drawSelected();

  gameBoard.drawFigures();

  // noLoop();
}

function mousePressed() {
  player.move();
  cpu.move();
}
