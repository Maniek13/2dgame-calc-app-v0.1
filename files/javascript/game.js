
var cols;
var rows;
var block_size ;
var canvas;
var ctx ;

var blocks_array = [];
var blocks_number_of = 0;
var points = 0;
var score = 0;
var stop = false;
var game_status = 0;
var t1 = 100;
var t2 = 1000;
var color_block = "#ff0000";
var colors = [];

class Board{
  reset() {
    blocks_array = [];
    colors = [];
    blocks_number_of = 0;
    points = 0;
    game_status = 0;
    t1 = 100;
    t2 = 1000;
    color_block = "#ff0000";
    document.getElementById('GameOver').style.display = "none";
  }
}


class Player {  
  constructor(ctx) {
    this.ctx = ctx;
    this.color = 'black';
    this.x = 1;
    this.y = 9;
  }

  draw() {
  this.ctx.fillStyle = this.color;
  this.ctx.fillRect(this.x , this.y, 1, 1);
  }

  move(p){
    this.x = p.x;
    this.y = p.y;
  }

  valid_board(p){
    if(p.x > ctx.canvas.width/30-1 ||  p.x < 0 || p.y > ctx.canvas.height/30-1 || p.y < 0){
      return true;
    }
    else{
      return false;
    }
  }
}


class Blocks {  
  constructor(ctx, shape, x, y) {
    this.ctx = ctx;
    this.shape = shape;
    this.x = x;
    this.y = y;
  }

  draw(color) {
  this.ctx.fillStyle = color;
  this.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
      }
    });
  });
  }

  valid_block(p){
    let wynik;
    for(let i = 0; i < blocks_array.length; i++){
      let block = blocks_array[i];
      block.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0 && block.x+x == p.x && block.y+y == p.y) {
          wynik = true;
        }
      });
    });
   
    }
    return wynik;
  }
}

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  UP: 38
}

Object.freeze(KEY);

const moves = {
  [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]:    p => ({ ...p, x: p.x , y: p.y + 1 }),
  [KEY.UP]:    p => ({ ...p, x: p.x, y: p.y - 1 })
};

let board = new Board();


document.addEventListener('keydown', event => {

  if(game_status == 1){
    if (moves[event.keyCode]) {  
    event.preventDefault();
    
    let p = moves[event.keyCode](board.player);


    if(board.block.valid_block(p) != true ){
      if(board.player.valid_board(p) == false){
      board.player.move(p);
      }

      board.block.draw();
      board.player.draw();
    }
    else{
     end();
    }
  }
  }

});



function start(){
cols = 40;
rows = 10;
block_size = 30;
canvas = document.getElementById('board');
ctx = canvas.getContext('2d');
ctx.canvas.width = cols * block_size;
ctx.canvas.height = rows * block_size;
ctx.scale(block_size, block_size);
}

function play() {
  stop = false;
  game_status = 1;
  document.getElementById('start').disabled = true;
  
  let player = new Player(ctx);
  player.draw();

  board.player = player;
  
  draw_block();
  blocks_array[blocks_number_of] = board.block;
  colors[blocks_number_of] = color_block;
  blocks_number_of += 1;


  var p2 = setInterval(function() {
    if(board.block.valid_block(board.player) != true){
      move();
      draw_block();
      if(points < 10){
        points += 1/10;
      }
      else if(points < 40){
        points += 1/10;
        t1 = 300;
        t2 = 900;
      }
      else if(points < 60){
        points += 1;
        t1 = 150;
        t2 = 300;
      }
      document.getElementById('points').innerText = Math.round(points/2);
    }
    else{
      end();
    }

    if(stop == true){
      clearInterval(p2);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    }
    
  } , t1);

  var p1 = setInterval(function() {
    if(points > 20){
      draw_block_new();
    }
    if(points > 100){
      draw_block_new();
    }
    draw_block_new();
    
    if(stop == true){
      clearInterval(p1);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    }
  } , t2);
}

function draw_block_new(){
  draw_block();
    blocks_array[blocks_number_of] = board.block;
    colors[blocks_number_of] = color_block;
    blocks_number_of += 1;
}

function draw_block(){
  let x = Math.floor(Math.random() * 10); 
  let shape = block_random();

  color_block = `#${Math.floor(Math.random()*16777215).toString(16)}`;

  while(color_block === "#FFFFFF"){
    color_block = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }

  let block = new Blocks(ctx, shape, 39, x);

  for(let i = 0; i < blocks_array.length; i++){
    if((points  > 50 && points < 60) || (points  > 100 && points < 110) ){
      blocks_array[i].draw(color_block);
    }
    else{
      blocks_array[i].draw(colors[i]);
    }
  }

  block.draw(color_block);
  board.block = block;
}

function move(){
  for(let i = 0; i < blocks_array.length; i++){

    let block_single = blocks_array[i];

    if(block_single.x > 0 - block_single.shape[0].length){
    block_single.x -= 1;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    board.player.draw();
    block_single.draw();
    }
    else{
      blocks_array.shift();
      colors.shift();
      blocks_number_of -= 1;
    } 
  }
}

function  block_random(){
  let shape= [[]];

  let x = Math.floor(Math.random() * 5) + 1; 
  let y = Math.floor(Math.random() * 5) + 1; 

 for(let i = 0; i< x; i++){
    let temp = [];
    for(let j = 0; j< y; j++){
      temp[j] = Math.floor(Math.random() * 3);
    }
    shape[i] = temp;
  }
  
  return shape;
}

function reset_game(){
  stop = true;
  document.getElementById('start').disabled = false;
  board.reset();
}

function  end(){
  stop = true;
  score = Math.round(points/2);
  document.getElementById('highscore').innerText = score;
  document.getElementById('points').innerText = 0;
  document.getElementById('GameOver').style.display = "flex";
  game_status = 0;
}




