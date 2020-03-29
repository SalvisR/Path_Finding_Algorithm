const canavs = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const contex = canvas.getContext('2d');
const width = 700;
const height = 700;
canvas.width = width;
canavs.height = height;

const cols = 40;
const rows = 40;
const w = width / cols;
const h = height / rows;
let start;
let end;
let openSet = [];
const closedSet = [];
let loop = true;
let path;

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.g = 0;
  this.h = 0;
  this.f = 0;
  this.neighbors = [];
  this.wall = false;
  this.random = Math.random();


  if (this.random < 0.2) {
    this.wall = true;
  }

  this.draw = function () {
    context.strokeStyle = 'rgb(200, 200, 200)';
    context.rect(this.i * w, this.j * h, width / cols, height / rows);
    context.stroke();
  }
  this.show = function () {
    context.fillStyle = 'rgb(0, 255, 0)';
    context.rect(this.i * w, this.j * h, w, h);
    context.fill();
  };
  this.getNeighbors = function () {
    const i = this.i;
    const j = this.j;

    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
  };
  this.showValues = function () {
    context.fillStyle = "black";
    context.textAlign = "center";
    context.font = "10px Arial";

    context.fillText(`G:${this.g}`, i * w + 14, j * h + 15);
    context.fillText(`H:${Math.floor(this.h)}`, i * w + 40, j * h + 15);

    context.font = "15px Arial";
    context.fillText(`F:${Math.floor(this.f)}`, i * w + 30, j * h + 55);
  };

  this.openFields = function () {
    context.fillStyle = 'rgb(0, 255, 0)';
    context.fillRect(this.i * w, this.j * h, w, h);
    context.stroke();
  };
  this.showPath = function (i) {
    setTimeout(() => {
      context.fillStyle = 'rgb(0, 0, 190)';
      context.fillRect(this.i * w, this.j * h, w, h);
      context.stroke();
    }, 100 * i);
  };
  this.showPath = function (i) {
    setTimeout(() => {
      context.fillStyle = 'rgb(0, 0, 190)';
      context.fillRect(this.i * w, this.j * h, w, h);
      context.stroke();
    }, 100 * i);
  };
  this.closedSet = function () {
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(this.i * w, this.j * h, w, h);
    context.fill();
  };
}

function heuristic(a, b) {
  const x = a.i * w - b.i * w;
  const y = a.j * h - b.j * h;
  const d = Math.sqrt(x * x + y * y);
  return d;
}

function removeFromOpenSet(arr, el) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1);
    }
  }
}

const grid = new Array(cols);
for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i] = new Array(rows);
  }
}

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i][j] = new Spot(i, j);
  }
}

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i][j].getNeighbors();
  }
}

start = grid[2][0];
end = grid[cols - 1][rows - 1];
start.wall = false;
end.wall = false;

openSet.push(start);

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    if (grid[i][j].wall) {
      closedSet.push(grid[i][j]);
    }
  }
}

for (let i = 0; i < closedSet.length; i++) {
  closedSet[i].closedSet();
}

for (let i = 0; i < openSet.length; i++) {
  openSet[i].show();
}

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i][j].draw();
  }
}

while (loop) {
  let winner = 0;
  // // Checks witch element has smallest F value
  for (let i = 0; i < openSet.length; i++) {
    if (openSet[i].f < openSet[winner].f) {
      winner = i;
    }
  }
  let current = openSet[winner];
  if (openSet.length == 0) {
    loop = false;
    console.log('empty');
    for (let i = 0; i < path.length; i++) {
      const index = path.length - i;
      path[i].showPath(index);
    }
    break;
  };

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  if (current === end) {
    console.log('Done!');
    loop = false;

    // Animate path
    for (let i = 0; i < path.length; i++) {
      const index = path.length - i;
      path[i].showPath(index);
    }
  }

  removeFromOpenSet(openSet, current);
  closedSet.push(current);


  const neighbors = current.neighbors;

  for (let i = 0; i < neighbors.length; i++) {

    const neighbor = neighbors[i];
    // Check if closedSet includes neighbor
    if (!closedSet.includes(neighbor)) {
      let g = current.g + 1;

      // Check if OpenSet already includes element and if element have lover G value
      if (openSet.includes(neighbor)) {
        if (g < neighbor.g) {
          neighbor.g = g;
        }
      } else {
        neighbor.g = g;
        openSet.push(neighbor);
      }

      neighbor.h = heuristic(neighbor, end);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.previous = current;
      // neighbor.openFields();
      // neighbor.showValues();
    }
  }
}
