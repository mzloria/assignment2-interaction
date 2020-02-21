var canvas;
var ctx;
var gameGrid; 
var numColumns;
var numRows;
var resolution = 20;
var framesPerSecond = 4;

window.onload = function () {
  canvas = document.getElementById("gameoflife");
  ctx = canvas.getContext('2d');
  ctx.canvas.addEventListener("click", function (e) {
    if(gameGrid[Math.floor((e.clientX - 10)/ resolution)][Math.floor((e.clientY - 10) / resolution)] === 1) {
      gameGrid[Math.floor((e.clientX - 10) / resolution)][Math.floor((e.clientY - 10) / resolution)] = 0;
    } else {
      gameGrid[Math.floor((e.clientX - 10) / resolution)][Math.floor((e.clientY - 10) / resolution)] = 1;
    }
  }, false);
  setUpGameGrid();
  drawFrame();
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  setTimeout(() => {requestAnimationFrame(() => drawFrame())}, 1000 / framesPerSecond);
}

function setUpGameGrid() {
  numColumns = canvas.width / resolution;
  numRows = canvas.height / resolution;
  console.log(numColumns);
  console.log(numRows);
  gameGrid = generateArray(numColumns, numRows);
  for (var i = 0; i < numColumns; i++) {
    for(var j = 0; j < numRows; j++) {
      gameGrid[i][j] = Math.floor(Math.random() * 2);
    }
  }
}

function generateArray(cols, rows) {
  var tempArray = new Array(cols);
  for(var i = 0; i < tempArray.length; i++) {
    tempArray[i] = new Array(rows);
  }
  return tempArray;
}

function draw() {
  ctx.fillStyle = "#4b2e83";
  ctx.strokeStyle = "#85754d";
  for (var i = 0; i < numColumns; i++) {
    for(var j = 0; j < numRows; j++) {
      var x = i * resolution;
      var y = j * resolution;
      if(gameGrid[i][j] === 1) {
        ctx.fillRect(x, y, resolution, resolution);
      }
      ctx.strokeRect(x, y, resolution, resolution);
    }
  }

  var nextGeneration = generateArray(numColumns, numRows);
  for (var i = 0; i < numColumns; i++) {
    for(var j = 0; j < numRows; j++) {
      var state = gameGrid[i][j];
      var neighbors = countNeighbors(gameGrid, i, j);

      if(state === 0 && neighbors === 3) {
        nextGeneration[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGeneration[i][j] = 0;
      } else {
        nextGeneration[i][j] = state;
      }

    }
  }
  gameGrid = nextGeneration;
}

function countNeighbors(array, x, y) {
  var numNeighbors = 0;
  for(var i = -1; i < 2; i++) {
    for(var j = -1; j < 2; j++) {
      let column = (x + i + numColumns) % numColumns;
      let row = (y + j + numRows) % numRows;

      numNeighbors += array[column][row];
    }
  }
  numNeighbors -= array[x][y];
  return numNeighbors;
}