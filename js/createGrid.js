function createGrid(ROWS = 1, COLS = 1, CellSize = 32) {
  const _type = 'Grid'
  const _totalCells = ROWS * COLS;
  const _data = [];
  // create grid data set
  for(let y = 0, id = 0; y < ROWS; y++) {
    _data.push([]);
    for(let x = 0; x < COLS; x++, id++) {
      _data[y].push({ id, y, x, size: CellSize });
    }
  }

  const BODY = {
    clone: () => {
      return createGrid(ROWS, COLS, CellSize);
    },
    print: () => {
      console.log(_data);
      return BODY;
    },
    getCell: (y, x) => {
      if(y < 0 || x < 0 || y >= ROWS || x >= COLS) return {};
      return _data[y][x];
    },
    size: () => [ROWS, COLS], // [y, x]
    total: () => _totalCells,
    type: () => _type,
    each: (cb) => {
      _data.forEach(row => {
        row.forEach(cb)
      });
      return BODY;
    },
    each2D: (eachFnY, eachFnX) => {
      for(let y = 0; y < ROWS; y++) {
        eachFnY && eachFnY(y, _data[y]);
        for(let x = 0; x < COLS; x++) {
          eachFnX && eachFnX(x, _data[y][x])
        }
      }
    },
    use: (cb) => {
      cb(_data);
      return BODY;
    }
  }
  return BODY;
}
