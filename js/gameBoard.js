const Chess = {
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
        .filter(_cell => !!_cell?.id)
        .filter(_cell => board.isOwnerCell(_cell, owner));
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
    queen: (owner, cell, board) => { return []; },
    king: (owner, cell, board) => { return []; },
  }
}


function GameBoard(rows, cols, cellSize) {
  let first_player, second_player;
  const playerMove = {
    white: true,
    black: false
  }
  const grid =
    createGrid(rows, cols, cellSize)
    .each(cell => {
      cell.yPos = cell.y * cell.size + settings.paddingY;
      cell.xPos = cell.x * cell.size + settings.paddingX;
      cell.color = (cell.x + cell.y) % 2 === 0 ?
        settings.fieldColors[0] : settings.fieldColors[1];
    });
  // set tiles data
  grid.each(cell => {
    // tile iconType: 0 - white, 1 - black
    cell.item = Object.assign({}, settings.emptyCellItem);
    if(cell.y <= 1) {
      // black figures
      cell.item.iconType = 1;
      cell.item.owner = settings.owners[0];
      cell.item.name = Chess.names[cell.y][cell.x];
      cell.item.tilePos = Chess.tilePos[cell.item.name][cell.item.iconType];
    }
    else if(cell.y >= 6) {
      // white figures
      cell.item.iconType = 0;
      cell.item.owner = settings.owners[1];
      cell.item.name = Chess.names[abs(7 - cell.y)][cell.x];
      cell.item.tilePos = Chess.tilePos[cell.item.name][cell.item.iconType];
    }
    else {
      cell.item.iconType = null;
      cell.item.icon = ''
      cell.item.name = ''
    }
  });
  // set game board on canvas sizes
  grid.width  = settings.paddingX + settings.cellSize * settings.cellsPerLine;
  grid.height = settings.paddingY + settings.cellSize * settings.cellsPerLine;

  grid.drawBorder = () => {
    fill(settings.boardBg);
    rect(settings.boardX, settings.boardY, settings.boardSize);
  }

  grid.drawCells = () => {
    grid.each((cell) => {
      strokeWeight(1);
      stroke('black');
      fill(cell.color);
      rect(cell.xPos, cell.yPos, cell.size);
      // draw names
      if(cell.x === 0) {
        // left cells name
        fill(settings.textColor)
        textSize(settings.textSize);
        text(Chess.rowNames[cell.y], cell.xPos - cell.size * 0.5, cell.yPos + cell.size * 0.6);
      }
      if(cell.y === settings.cellsPerLine-1) {
        // bottom cells name
        fill(settings.textColor)
        textSize(settings.textSize);
        text(Chess.columnNames[cell.x], cell.xPos + cell.size/2.5, cell.yPos + cell.size * 1.5);
      }
    });
  }

  grid.drawFigures = () => {
    grid.each((cell) => {
      if(cell.item.name) {
        // tileset, x, y, w, h, tileX, tileY, tileW, tileH
        image(
          chassesImg,
          cell.xPos, cell.yPos,
          cell.size, cell.size,
          cell.item.tilePos[0], cell.item.tilePos[1],
          Chess.tileWidth, Chess.tileHeight,
        );
      }
    });
  }

  grid.isEmptyCell = (cell) => cell && !cell?.item?.owner
  grid.isEnemyCell = (cell, owner) => {
    return cell && cell?.item?.owner && cell.item.owner !== owner;
  }
  grid.isOwnerCell = (cell = {}, owner) => cell?.item && cell?.item.owner === owner;

  grid.getPositionName = (cell) => Chess.rowNames[cell.y] + Chess.columnNames[cell.x];
  grid.start = (firstPlayer, secondPlayer) => {
    first_player = firstPlayer;
    second_player = secondPlayer
    // white or black
    firstPlayer.canMove = playerMove[firstPlayer.owner];
    secondPlayer.canMove = playerMove[secondPlayer.owner];
  }
  grid.nextPlayer = (prevPlayer) => {
    prevPlayer.canMove = false;
    if(first_player.owner === prevPlayer.owner) {
      second_player.canMove = true;
    } else {
      first_player.canMove = true;
    }
  }

  return grid;
}