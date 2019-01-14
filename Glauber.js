
const theViz = document.getElementById("glauber-viz");
const theCanvas = document.getElementById("glauber-canvas");
const cvx = theCanvas.getContext("2d");
const theButton = document.getElementById("glauber-go-button");
theButton.onclick = doButton;
const theSlider = document.getElementById("glauber-slider");
theSlider.onchange = adjustTemp;
theSlider.oninput = adjustTemp;
const tempReadout = document.getElementById("glauber-temp");

const gridSize = 100;
const gridEdge = gridSize - 1;
const cellSize = theCanvas.width / gridSize;
const upColor = "#410344";
const downColor = "#713aff";

let timer;
let temp = Number(theSlider.value);
let state = 'paused';

// build the array of cells
const lattice = new Array(gridSize);
for (let i = 0; i < gridSize; i++) {
    lattice[i] = new Array(gridSize);
}

function coinFlip() {
  return Math.random() < 0.5;
}

// transfer lattice value to the canvas
function markSpin(i, j) {
  cvx.fillStyle = (lattice[i][j] === 1) ? upColor : downColor;
  cvx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
}

function init() {
  let i, j;
  state = 'scrambled';
  for (i = 0; i < gridSize; i++) {
    for (j = 0; j < gridSize; j++) {
      lattice[i][j] = coinFlip() ? 1 : -1;
      markSpin(i, j);
    }
  }
}

function updateRandomCell() {
  let x, y, north, south, east, west, deltaE;
  x = Math.floor(Math.random() * gridSize);
  y = Math.floor(Math.random() * gridSize);
  north = lattice[x][(y > 0) ? y - 1 : gridEdge];   // implement toroidal lattice
  south = lattice[x][(y < gridEdge) ? y + 1 : 0];
  east  = lattice[(x > 0) ? x - 1 : gridEdge][y];
  west  = lattice[(x < gridEdge) ? x + 1 : 0][y];
  deltaE = 2 * lattice[x][y] * (north + south + east + west);
  if ((deltaE < 0) || Math.random() < Math.exp(-deltaE/temp)) {
    lattice[x][y] *= -1;
    markSpin(x, y);
  }
}

function runBatch() {
  let N = gridSize * gridSize;
    for (i = 0; i < N; i++) {
      updateRandomCell();
    }
}

function doButton(e) {
  if (state !== 'running') {
    state = 'running';
    this.innerHTML = "Stop";
    timer = setInterval(runBatch, 1);
  }
  else {
    state = 'paused';
    clearInterval(timer);
    this.innerHTML = "Go";
  }
}


function adjustTemp(e) {
  temp = Number(this.value);
  tempReadout.textContent = temp.toFixed(2);
}

init();
