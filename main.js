// Michael Zachary Loria
// March 3 2020
// Assignment 3 - Updated with Database
// Game of Life
// This program simulates the Game of Life.
// Allows user to select random, gliders, and gosper gun
// states. Also allows user to save state to the database
// and reload it. 

var canvas;
var ctx;
var gameGrid; 
var numColumns;
var numRows;
var resolution = 10; // Change this to adjust size of boxes.
var framesPerSecond = 8;
var random = true;
var gosperGun = false;
var gliders = false;
var gridLines = true;
var running = false;

window.onload = function () {
  var socket = io.connect("http://24.16.255.56:8888");

  socket.on("load", function (data) {
      gameGrid = data.data;
      drawInitFrame();
  });

  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");
  
  saveButton.onclick = function () {
    console.log("Save completed.");
    socket.emit("save", { studentname: "Michael Zachary Loria", statename: "gameGrid", data: gameGrid });
  };

  loadButton.onclick = function () {
    console.log("Load completed.");
    socket.emit("load", { studentname: "Michael Zachary Loria", statename: "gameGrid" });
  };

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
  drawInitFrame();

}

function toggleGridLine() {
  gridLines = !gridLines;
}

function randomRestart() {
  running = false;
  random = true;
  gosperGun = false;
  gliders = false;
  setUpGameGrid();
  drawInitFrame();
}

function gliderRestart() {
  running = false;
  random = false;
  gosperGun = false;
  gliders = true;
  setUpGameGrid();
  drawInitFrame();
}

function gosperGunRestart() {
  running = false;
  random = false;
  gosperGun = true;
  gliders = false;
  setUpGameGrid();
  drawInitFrame();
}

function drawInitFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#4b2e83";
  ctx.strokeStyle = "#85754d";
  for (var i = 0; i < numColumns; i++) {
    for(var j = 0; j < numRows; j++) {
      var x = i * resolution;
      var y = j * resolution;
      if(gameGrid[i][j] === 1) {
        ctx.fillRect(x, y, resolution, resolution);
      }
      if(gridLines) {
        ctx.strokeRect(x, y, resolution, resolution);
      }
    }
  }
}

function drawContFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateGen();
  draw();
  if(running) {
    setTimeout(() => {requestAnimationFrame(() => drawContFrame())}, 1000 / framesPerSecond);
  }
}

function setUpGameGrid() {
  numColumns = canvas.width / resolution;
  numRows = canvas.height / resolution;
  gameGrid = generateArray(numColumns, numRows);
  for (var i = 0; i < numColumns; i++) {
    for(var j = 0; j < numRows; j++) {
      if(random) {
        gameGrid[i][j] = Math.floor(Math.random() * 2);
      } else {
        gameGrid[i][j] = 0;
      }
    }
  }

  if(gosperGun) {
    addGliderGun(0,0);
  }

  if(gliders) {
    addGlider(4,0);
    addGlider(12,0);
    addGlider(20,0);
    addGlider(28,0);
    addGlider(36,0);
    addGlider(44,0);
    addGlider(52,0);
    addGlider(60,0);
    addGlider(68,0);
    addGlider(4,20);
    addGlider(12,20);
    addGlider(20,20);
    addGlider(28,20);
    addGlider(36,20);
    addGlider(44,20);
    addGlider(52,20);
    addGlider(60,20);
    addGlider(68,20);
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
      if(gridLines) {
        ctx.strokeRect(x, y, resolution, resolution);
      }
    }
  }
}

function updateGen() {
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

function addGlider(x, y) {
  gameGrid[x][y + 2] = 1;
  gameGrid[x + 1][y] = 1;
  gameGrid[x + 1][y + 2] = 1;
  gameGrid[x + 2][y + 1] = 1;
  gameGrid[x + 2][y + 2] = 1;
}

function addGliderGun(x, y) {
  gameGrid[x+1][y+25] = 1;
  gameGrid[x+2][y+23] = 1;
  gameGrid[x+2][y+25] = 1;
  gameGrid[x+3][y+21] = 1;
  gameGrid[x+3][y+22] = 1;
  gameGrid[x+4][y+21] = 1;
  gameGrid[x+4][y+22] = 1;
  gameGrid[x+5][y+21] = 1;
  gameGrid[x+5][y+22] = 1;
  gameGrid[x+6][y+23] = 1;
  gameGrid[x+6][y+25] = 1;
  gameGrid[x+7][y+25] = 1;
  gameGrid[x+5][y+1] = 1;
  gameGrid[x+5][y+2] = 1;
  gameGrid[x+6][y+1] = 1;
  gameGrid[x+6][y+2] = 1;
  gameGrid[x+3][y+35] = 1;
  gameGrid[x+3][y+36] = 1;
  gameGrid[x+4][y+35] = 1;
  gameGrid[x+4][y+36] = 1;
  gameGrid[x+3][y+13] = 1;
  gameGrid[x+3][y+14] = 1;
  gameGrid[x+4][y+12] = 1;
  gameGrid[x+4][y+16] = 1;
  gameGrid[x+5][y+11] = 1;
  gameGrid[x+5][y+17] = 1;
  gameGrid[x+6][y+11] = 1;
  gameGrid[x+6][y+15] = 1;
  gameGrid[x+6][y+17] = 1;
  gameGrid[x+6][y+18] = 1;
  gameGrid[x+7][y+11] = 1;
  gameGrid[x+7][y+17] = 1;
  gameGrid[x+8][y+12] = 1;
  gameGrid[x+8][y+16] = 1;
  gameGrid[x+9][y+13] = 1;
  gameGrid[x+9][y+14] = 1;
}

function startAnimation() {
  running = true;
  drawContFrame();
}

function stopAnimation() {
  running = false;
}