const settings = document.querySelector('.settings');
const openButton = document.querySelector('.header__button');
const closeButton = document.querySelector('.settings__close');
const clearButton = document.querySelector('.clear');
const btn = document.querySelector('.submit__btn');

openButton.addEventListener('click', () => {
  settings.classList.add('settings--active');
});

closeButton.addEventListener('click', () => {
  settings.classList.remove('settings--active');
});



btn.addEventListener('click', () => {
  localStorage.countColumns = document.getElementById("count_of_columns").value;
  localStorage.minLength = document.getElementById("min_length").value;
  localStorage.maxLength = document.getElementById("max_length").value;
  localStorage.symbolSize = document.getElementById("symbol_size").value;
  localStorage.speed = document.getElementById("speed").value;
  localStorage.minSpeed = document.getElementById("minSpeed").value;
  localStorage.colorPicker = document.getElementById("colorPicker").value;
  localStorage.symbolType = document.getElementById("chinese").checked ? true : false;
  location.reload();
});

console.log(localStorage.symbolType);
if (localStorage.symbolType === 'true') {
  document.getElementById("chinese").checked = true;
} else {
  document.getElementById("lat").checked = true;
}

document.getElementById("count_of_columns").value = localStorage.countColumns ? localStorage.countColumns : value;
document.getElementById("min_length").value = localStorage.minLength;
document.getElementById("max_length").value = localStorage.maxLength;
document.getElementById("symbol_size").value = localStorage.symbolSize;
document.getElementById("speed").value = localStorage.speed;
document.getElementById("minSpeed").value = localStorage.minSpeed;
document.getElementById("colorPicker").value = localStorage.colorPicker;

function convertColor(color) {

  if(color.substring(0,1) == '#') {
     color = color.substring(1);
   }

  var rgbColor = {};

  rgbColor.r = parseInt(color.substring(0,2),16);
  rgbColor.g = parseInt(color.substring(2,4),16);
  rgbColor.b = parseInt(color.substring(4),16);

  return rgbColor;
 }

let color = convertColor(localStorage.colorPicker);
let firstColor = {};


if (color.r >= 171) {
  firstColor.r = 255,
  firstColor.g = color.g + 100,
  firstColor.b = color.b + 100;
}

if (color.g >= 220) {
  firstColor.r = 140,
  firstColor.g = 255,
  firstColor.b = 170;
}

if (color.b >= 171) {
  firstColor.r = color.r + 100,
  firstColor.g = 206,
  firstColor.b = color.b + 100;
}

console.log(firstColor);

let streams = [];
let fadeInterval = 1.2;
let symbolSize = +localStorage.symbolSize;


function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );
  background(0);

  var x = 0;
  for (var i = 0; i < localStorage.countColumns; i++) {
    let stream = new Stream();
    stream.generateSymbols(x, random(-2000, 0));
    streams.push(stream);

    if(localStorage.countColumns >= 40) {
      x += symbolSize;
    } else {
      x += width / localStorage.countColumns;
    }
  }

  textFont('Consolas');
  textSize(symbolSize);

}

function draw() {
  background(0, 150);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;
  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(7, 50));


  this.randomSymbol = function() {
    let charType = round(random(0, 5));
    if (localStorage.symbolType === 'true') {
      var s = String.fromCharCode(0x30A0 + floor(random(0, 97)));
    } else {
      s = String.fromCharCode(floor(random(64, 127))); ;
    }
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // Символи
        this.value = s;
      } else {
        this.value = floor(random(0,10));
      }
    }
  }

  this.reRender = function() {
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }
  
}

function Stream() {
  this.symbols = [];
  this.streamLength = round(random(+localStorage.minLength, +localStorage.maxLength)); //довжина
  this.speed = round(random(+localStorage.minSpeed, +localStorage.speed)); // швидкість

  this.generateSymbols = function(x, y) {
    let opacity = round(random(180, 255));
    console.log(opacity);
    let first = round(random(0, 3)) == 1;
    for (let i = 0; i <= this.streamLength; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      );
      symbol.randomSymbol();
      this.symbols.push(symbol);
      opacity -= (opacity / this.streamLength) / random(0.9, 2);
      y -= symbolSize;
      first = false;
    }
  }


  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(firstColor.r, firstColor.g, firstColor.b, symbol.opacity + 20);
      } else {
        fill(color.r, color.g, color.b, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.reRender();
      symbol.randomSymbol();
    });
  }
};

