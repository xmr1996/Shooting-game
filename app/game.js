var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var PAUSE_KEY = 80;
var RELOAD_KEY = 82;
var HERO_MOVEMENT = 6;

var score =0;
var lastLoopRun = 0;
var run =true;

var controller = new Object();
var enemies = new Array();

function createSprite(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

function intersect(a, b)
{
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function toggleKey(keyCode, isPressed) {
  if (keyCode == LEFT_KEY) {
    controller.left = isPressed;
  }
  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }
  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  }
  if (keyCode == PAUSE_KEY) {
    controller.pause = isPressed;
  }
  if (keyCode == RELOAD_KEY) {
    controller.reload = isPressed;
  }  
}

function ensureBounds(sprite) {
  if (sprite.x < 120) {
    sprite.x = 120;
  }
  if (sprite.y < 120) {
    sprite.y = 120;
  }
  if (sprite.x + sprite.w > 580) {
    sprite.x = 580 - sprite.w;
  }
  if (sprite.y + sprite.h > 580) {
    sprite.y = 580 - sprite.h;
  }
}

function setPosition(sprite) {
  var e = document.getElementById(sprite.element);
  e.style.left = sprite.x + 'px';
  e.style.top = sprite.y + 'px';
}

function handleControls() {
  if (controller.up) {
    hero.y -= HERO_MOVEMENT;
  }
  if (controller.down) {
    hero.y += HERO_MOVEMENT;
  }
  if (controller.left) {
    hero.x -= HERO_MOVEMENT;
  }
  if (controller.right) {
    hero.x += HERO_MOVEMENT;
  }
  if (controller.space && laser.y <= 0) {
    laser.x = hero.x + 9;
    laser.y = hero.y - (laser.h+4);
  }

  
  ensureBounds(hero);
}

function showSprites() {
  setPosition(hero);
  setPosition(laser);
  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }
  var scoreElement =document.getElementById('score');
  scoreElement.innerHTML = 'SCORE: ' + score;
}

function updatePositions() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 4;
    enemies[i].x += getRandom(7) - 3;
    ensureBounds(enemies[i]);
  }
  laser.y -= 24;
  
  if(laser.y<=100){
    laser.x=-10;
  }
}

function difficulty(){
  if(score<2500)
    return 50;
  else if(score>=2500 && score<5000)
    return 25;
  else if(score>=5000 && score<10000)
    return 10;
  else if (score>=10000)
    return 5;
}
function addEnemy() {
  var itreation = difficulty();

  if (getRandom(itreation) == 0) {
    var elementName = 'enemy' + getRandom(10000000);
    var enemy = createSprite(elementName, getRandom(450)+100, -40, 35, 35);
    
    var element = document.createElement('div');
    element.id = enemy.element;
    element.className = 'enemy'; 
    document.children[0].appendChild(element);
    
    enemies[enemies.length] = enemy;
  }
}

function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}
function checkCollision(){
  for(var i = 0; i<enemies.length; i++){
    if(intersect(laser,enemies[i])){
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i,1);
      i--;
      score+=100;
      laser.x=-10;
    }
    else if (enemies[i].y+enemies[i].h>=580){
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i,1);
      i--;
    }
    else if(intersect(hero,enemies[i]))
    {
      gameOver();
    }
  }
}

function gameOver(){
  var element = document.getElementById(hero.element);
  element.style.visibility = 'hidden';
  element = document.getElementById('gameOver');
  element.style.visibility ='visible';
  run =false;
}

function reloadGame(){
  location.reload();
}


function pause(){
  if(!run){
    run =true;
    loop();
  }
  else{
    run =false;
    
  }
}

function loop() {

  if (new Date().getTime() - lastLoopRun > 25) {

    updatePositions();
    handleControls();
    checkCollision();
    addEnemy();
    showSprites();
    
    lastLoopRun = new Date().getTime();
  }

  if(run){
    setTimeout('loop();', 2);
  }
}

document.onkeydown = function(evt) {
  toggleKey(evt.keyCode, true);
};

document.onkeyup = function(evt) {
  toggleKey(evt.keyCode, false);
};

var hero = createSprite('hero', 350, 560, 20, 20);
var laser = createSprite('laser', 0, -120, 2, 50);

loop();
