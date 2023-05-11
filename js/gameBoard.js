


function GameBoard(rows, cols, cellSize) {
  let player1, player2;
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

  grid.isEmptyCell = (c) => c && !c?.item?.owner
  grid.isEnemyCell = (c, owner) => c && c?.item?.owner && c.item.owner !== owner;
  grid.isOwnerCell = (c, owner) => c && c?.item && c?.item.owner === owner;

  grid.getPositionName = (cell) => Chess.rowNames[cell.y] + Chess.columnNames[cell.x];
  grid.start = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    // ['white'] or ['black']
    player1.canMove = Chess.firstMove[player1.owner];
    player2.canMove = Chess.firstMove[player2.owner];
  }
  grid.nextPlayer = (prevPlayer) => {
    prevPlayer.canMove = false;
    if(player1.owner === prevPlayer.owner) {
      player2.canMove = true;
    } else {
      player1.canMove = true;
    }
  }

  grid.checkWinner = (drawWinner) => {
    if(player1.win) {
      player1.winCounter++;
      drawWinner(player1)
    }
    else if(player2.win) {
      player2.winCounter++;
      drawWinner(player2)
    }
  }

  return grid;
}