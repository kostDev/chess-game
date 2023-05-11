const w = 680, h = 680;

const settings = {
  bg: "#fff", // rgb(162, 144, 214)
  fieldColors: ['#ebd1a6' , '#c2924a'],
  targetCurrColor: '#4ac252',
  enemyVariantColor: '#c24e4a',

  owners: ['black', 'white'],
  textColor: "black",
  textSize: 24,
  textFont: 'monospace',

  boardBg: "#fff",
  boardX: 0, // init setup
  boardY: 0, // init setup
  boardSize: 0, // init setup
  // cell item template
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

const Chess = {
  firstMove: {
    white: true,
    black: false
  },
  tileWidth: 106.5,
  tileHeight: 106.5,
  tilePos: {
    // name  white[x,y] - black [x,y]
    pawn:   [[533.0, 0], [533.0, 106.5]],
    rook:   [[426.4, 0], [426.4, 106.5]],
    knight: [[319.7, 0], [319.7, 106.5]],
    bishop: [[213.2, 0], [213.2, 106.5]],
    queen:  [[106.6, 0], [106.6, 106.5]],
    king:   [[0,     0], [0,     106.5]],
  },
  names: [
    ['rook','knight','bishop','queen', 'king', 'bishop', 'knight','rook'],
    ['pawn','pawn','pawn','pawn','pawn','pawn','pawn','pawn']
  ],
  rowNames: '87654321'.split(''),
  columnNames: 'abcdefgh'.toUpperCase().split(''),
  moves: {
    pawn: (owner, cell, board) => {
      const moveList = []
      const direction =  owner === 'white' ? -1 : 1;
      const nextCell = board.getCell(cell.y + direction, cell.x);
      // diagonals move
      const nextCellD1 = board.getCell(cell.y + direction, cell.x+direction);
      const nextCellD2 = board.getCell(cell.y + direction, cell.x-direction);

      if(board.isEmptyCell(nextCell)) {
        moveList.push(nextCell);
      }
      if(board.isEnemyCell(nextCellD1, owner)) {
        moveList.push(nextCellD1);
      }
      if(board.isEnemyCell(nextCellD2, owner)) {
        moveList.push(nextCellD2);
      }

      return moveList;
    },
    rook: (owner, cell, board) => {
      const moveList = [];
      // let y = cell.y, x = cell.x;
      // vertical y +-
      for(let y = cell.y+1; y <= settings.cellsPerLine-1; y++) {
        const nextCell = board.getCell(y, cell.x)
        if(board.isEmptyCell(nextCell)) {
          moveList.push(nextCell);
        }
        else if(board.isEnemyCell(nextCell, owner)) {
          moveList.push(nextCell);
          break;
        }
        else break;
      }
      for(let y = cell.y-1; y >= 0; y--) {
        const nextCell = board.getCell(y, cell.x)
        if(board.isEmptyCell(nextCell)) {
          moveList.push(nextCell);
        }
        else if(board.isEnemyCell(nextCell, owner)) {
          moveList.push(nextCell);
          break;
        }
        else break;
      }
      // horizontal x +-
      for(let x = cell.x+1; x <= settings.cellsPerLine-1; x++) {
        const nextCell = board.getCell(cell.y, x)
        if(board.isEmptyCell(nextCell)) {
          moveList.push(nextCell);
        }
        else if(board.isEnemyCell(nextCell, owner)) {
          moveList.push(nextCell);
          break;
        }
        else break;
      }
      for(let x = cell.x-1; x >= 0; x--) {
        const nextCell = board.getCell(cell.y, x)
        if(board.isEmptyCell(nextCell)) {
          moveList.push(nextCell);
        }
        else if(board.isEnemyCell(nextCell, owner)) {
          moveList.push(nextCell);
          break;
        }
        else break;
      }

      return moveList;
    },
    knight: (owner, cell, board) => {
      const { y, x } = cell;
      // Г L pattern move
      return [
        //mid-left  top-left    top-right   mid-right
        [y-1, x-2], [y-2, x-1], [y-2, x+1], [y-1, x+2],
        //mid-bt-left  bt-left  bt-right  mid-bt-right,
        [y+1, x-2], [y+2, x-1], [y+2, x+1], [y+1, x+2]
      ]
        .map(([yIndex, xIndex]) => board.getCell(yIndex, xIndex))
        .filter(_cell => _cell && !board.isOwnerCell(_cell, owner));
    },
    bishop: (owner, cell, board) => {
      const moves = [];
      const { y, x } = cell;
      // [y,x, yDir, xDir]
      const startPosArr = [
        // diagonals left, right, bt-left, bt-right
        [y-1, x-1, -1, -1], [y-1, x+1, -1, 1],
        [y+1, x-1,  1, -1], [y+1, x+1,  1, 1]
      ];
      startPosArr.forEach(([_y, _x, yDir, xDir]) => {
        // let _y = yIndex, _x = xIndex;
        while(true) {
          const isOutFromStartPos = _y < 0 || _x < 0;
          const isOutFromEndPos = _y >= settings.cellsPerLine || _x >= settings.cellsPerLine;
          const currCell = board.getCell(_y, _x);

          if(isOutFromStartPos || isOutFromEndPos || board.isOwnerCell(currCell, owner)) break;
          if(board.isEmptyCell(currCell)) {
            moves.push(currCell);
          }
          else if (board.isEnemyCell(currCell, owner)) {
            moves.push(currCell);
            break;
          }
          // ------------------------------------
          _y += yDir;
          _x += xDir;
        }
        // end cells loop
      });
      return moves;
    },
    queen: (owner, cell, board) => {
      const fromRookMoveSet = Chess.moves.rook(owner, cell, board);
      const fromBishopMoveSet = Chess.moves.bishop(owner, cell, board);
      return [...fromRookMoveSet, ...fromBishopMoveSet];
    },
    king: (owner, cell, board) => {
      const { y, x } = cell;
      return [
        [y-1, x-1], [y-1, x], [y-1, x+1],
        [y,   x-1] /*[y,x]*/, [y,   x+1],
        [y+1, x-1], [y+1, x], [y+1, x+1]
      ]
        .map(([yIndex, xIndex]) => board.getCell(yIndex, xIndex))
        .filter(_cell => board.isEmptyCell(_cell) || board.isEnemyCell(_cell, owner));
    },
  }
}