class PlayerEntity {
  constructor(name, ownerColor, board, uiTitle) {
    this.name = name;
    this.canMove = false;
    // black white
    this.owner = ownerColor;
    this.board = board;
    this.win = false;
    this.figures = 16; // TODO: impl logic for store figures which out
    this.target = {
      curr: null,
      variantMoves: []
    }

    uiTitle.innerText = `${this.name}: ${this.owner} figures`;
    uiTitle.classList.add(this.owner + 'Figures')
  }

  drawSelected = () => {
    if(this.target.curr) {
      fill(settings.targetCurrColor);
      rect(this.target.curr.xPos, this.target.curr.yPos, settings.cellSize);
    }
    if(this.target.variantMoves.length) {
      this.target.variantMoves.forEach(varCell => {
        if(varCell.item.owner) {
          fill(settings.enemyVariantColor);
        } else {
          fill(settings.targetCurrColor);
        }
        rect(varCell.xPos, varCell.yPos, settings.cellSize);
      })
    }
  }

  move() {
    if(!this.canMove) return;
    if(
      mouseX >= settings.paddingX && mouseX < gameBoard.width &&
      mouseY >= settings.paddingY && mouseY < gameBoard.height
    ) {
      const indexX = floor((mouseX - settings.paddingX) / settings.cellSize);
      const indexY = floor((mouseY - settings.paddingY) / settings.cellSize);
      const currCell = this.target.curr;
      const nextCell = gameBoard.getCell(indexY, indexX);
      const item = nextCell.item;
      // empty cell to empty cell
      if(!currCell && !item.owner) { return null; }
      // selected cell twice
      else if(currCell && currCell.id === nextCell.id) {
        this.target.curr = null;
        this.target.variantMoves = [];
      }
      // step 2: move
      else if(
        currCell && currCell.id !== nextCell.id &&
        (!item.owner || item.owner !== this.owner)
      ) {
        const currFigure = currCell.item.name[0].toUpperCase();
        const nextFigure = item.name ? nextCell.item.name[0].toUpperCase() : '';
        const currPosName = gameBoard.getPositionName(currCell);
        const nextPosName = gameBoard.getPositionName(nextCell);
        // check if is it existing cell for move
        if(!!this.target.variantMoves.find(c => c.id === nextCell.id)) {
          // check if nextFigure king
          if(item.name === 'king') {
            this.win = true;
          }
          // from - to
          const step = `${this.name}: ${currFigure}${currPosName} -> ${nextFigure}${nextPosName}`;
          // add in ui
          addHistoryItem(this.owner, step);
          // console.log(step); move item data to the next cell
          Object.assign(nextCell.item, currCell.item)
          // clear target curr cell.item to default emptyCellItem
          Object.assign(currCell.item, settings.emptyCellItem);
          // clear ref on a cell in a board
          this.target.curr = null;
          this.target.variantMoves = [];
          // move next player
          this.board.nextPlayer(this);
        }
      }
      // step 1 - select target cell
      else if(item.owner === this.owner) {
        // this.target.variantMoves = [];
        // this.target.curr = null;
        this.target.curr = nextCell;
        // get all variants for selected figure
        this.target.variantMoves = Chess.moves[item.name](this.owner, this.target.curr, this.board);
      }

    }
  }
}