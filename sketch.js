/*

The Game Project 7 - 

Week 18 - 9.4  Sound
Week 20 - 10.3 Platforms
Week 20 - 10.3 Enemies


*/
//Positioning variables
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var charHitbox = {
  width: 28
};
//Boolean variables
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;
var t_canyon;
var platformContact;

//Moving variables
var gravity = 0.2;
var fallingSpeed = 0;
var jumpHeight = 150;

var keysBeingPressed = {
  up: false,
  left: false,
  right: false
};

// Drawing variables
var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

//Game Project
var gameScore;
var flagpole;
var lives;
var platforms;
var enemies;

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

function draw() {
  background(0,191,255); // fill the sky blue
  noStroke();
  fill(16, 172, 132);
  rect(0, floorPos_y, width, height / 4); // draw some green ground
  push();
  translate(scrollPos, 0);
  fill(254, 202, 87);
  ellipse(150, 120, 150, 150);
  noFill();    
  // Draw mountains.
    for (var i = 0; i < mountains.length; i++ ){
        mountains[i].draw();
    }

  // Draw clouds.
  for (var i = 0; i < clouds.length; i++ ){
      clouds[i].draw();
  }

  // Draw trees.
    for (var i = 0; i < trees.length; i++ ){
        trees[i].draw();
    }
    
  // Draw canyons
  for (var i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i]);
    checkCanyon(canyons[i]);
  }
    
  // Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    

  // Draw collectable items -- gameScore looping problem occurs due to this code.
  for(var i = 0; i < collectables.length; i++){
        if (collectables[i].isFound != true) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
  }
    
  //FlagPole
  if (flagpole.isReached == false) {
        checkFlagpole();
  }
  renderFlagpole();
    
  for(var i = 0; i< enemies.length; i++){
      enemies[i].draw();
      var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
      
      if(isContact)
          {
              if(lives > 0){
                  lives = lives - 1;
                  startGame();
                  break;
              }
          }
  }
      
  pop();
  // Draw game character.
  drawGameChar();

  //score on screen
  textSize(20);
  noStroke();
  fill(255);
  text('Game Score: ' + gameScore,20, 30);
    
    
  text('Lives left: ', 200, 30);
    for(var i = 0; i<lives; i++){
        push();
        scale(0.7);
        var x_pos= 450;
        livesLogo(x_pos+ i*60, 60);
        pop();
    }
    
    //Game Over when lives < 1
    if (lives < 1){
        textSize(50);
        fill(163,52,31);
        text('Game Over', width/2-100, height/2);    
        return;
    }

    //Game Over when lives < 1
    if (flagpole.isReached){
        textSize(50);
        fill(163,52,31);
        text('Level complete', width/2-100, height/2);    
        return;
    }
    
  //Add lives
  checkPlayerDie(); 
    
  // Logic to create the game character move or the background scroll.
  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  }

  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5; // negative for moving against the background
    }
  }
    
  // edge case if the char is below the floor
  if (gameChar_y > floorPos_y && !isPlummeting && !isFalling) {
    gameChar_y = floorPos_y;
  }

  isLeft = keysBeingPressed.left;
  isRight = keysBeingPressed.right;

  // Logic to create the game character rise and fall.
  // jumping
  if (keysBeingPressed.up && gameChar_y === floorPos_y) {
    // starts jumping animation
    isJumping = true;
  }
    
 if (keysBeingPressed.left) {
    // starts jumping animation
     isLeft = true;
  }
    
  if (keysBeingPressed.right) {
    // starts jumping animation
    isRight = true;
  }
    
  if (isJumping) {
    gameChar_y -= 10;
  }
    
  if (isJumping && gameChar_y <= floorPos_y - jumpHeight) {
    isJumping = false;
    isFalling = true;
    fallingSpeed = 0;
  }

  if (isFalling && gameChar_y >= floorPos_y && !isPlummeting) {
    isFalling = false;
    fallingSpeed = 0;
  }

    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
   // Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y) {
        
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                
                break;
            }
        }
        if(isContact == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
        
    } else {
        isFalling = false;
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    if (isPlummeting) { gameChar_y += 3; } //falling in the canyon    
}

function startGame()
{
  gameScore = 0;
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  flagpole = {isReached: false, x_pos: 3000};
  // Variable to control the background scrolling.
  scrollPos = 0;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isPlummeting = false;
  isFalling = false;

  // Initialise arrays of scenery objects.
  trees = []; // Trees
		for (var i = 0; i < 42; i++ ){
        trees.push(drawTree());
    }
    
  clouds = []; // Clouds
    for (var i = 0; i < 42; i++ ){
        clouds.push(drawClouds());
    }
    
  mountains = []; // Mountains
    for (var i = 0; i < 42; i++ ){
        mountains.push(drawMountain());
    }
    
  canyons = [{posX: 100, posY : 70}, {posX: 1400, posY : 70}, {posX: 2300, posY : 70}]; // Canyons
    
  collectables = [      // Collectables
    { x_pos: random(50,100), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(250,300), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(450,500), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(650,700), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(850,900), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(1050,1100), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(1250,1300), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(1450,1500), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(1650,1700), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(1850,1900), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(2050,2100), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(2250,2300), y_pos: random(300,400), size: 50, isFound: false },
    { x_pos: random(2450,2500), y_pos: random(300,400), size: 50, isFound: false }
  ];    
    
    platforms = [];
    platforms.push(createPlatforms(random(50,250), floorPos_y - 100, 100));
    platforms.push(createPlatforms(random(650,1050), floorPos_y - 100, 100));
    platforms.push(createPlatforms(random(1150,1550), floorPos_y - 100, 100));
    platforms.push(createPlatforms(random(1650,1850), floorPos_y - 100, 100));
    platforms.push(createPlatforms(random(2050,2250), floorPos_y - 100, 100));
    platforms.push(createPlatforms(random(2750,2250), floorPos_y - 100, 100));
    
    enemies = [];
    enemies.push(new Enemy(-100, floorPos_y - 10, 50));
    enemies.push(new Enemy(200, floorPos_y - 10, 110));
    enemies.push(new Enemy(700, floorPos_y - 10, 100));
    enemies.push(new Enemy(1100, floorPos_y - 10, 120));
    enemies.push(new Enemy(1300, floorPos_y - 10, 85));
    enemies.push(new Enemy(1600, floorPos_y - 10, 105));
    enemies.push(new Enemy(2000, floorPos_y - 10, 115));
    enemies.push(new Enemy(2450, floorPos_y - 10, 200));
}

// ---------------------
// Key control functions
// ---------------------

var keyCodes = {
  32: 'up',
  39: 'right',
  37: 'left',
  38: 'up',
  40: 'down'
};
function keyPressed() {
  keysBeingPressed[keyCodes[keyCode]] = true;
}

function keyReleased() {
  keysBeingPressed[keyCodes[keyCode]] = false;
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar() {
  variation = 'standing';
    
  if (isFalling) {
    variation = 'jumping';
  } else if (isLeft || isRight) {
    variation = 'walking';
  } 
  if (gameChar_y < floorPos_y - 80 && !isLeft && !isRight){
      variation = 'standing';
      isFalling = false; 
  } 
  if (isLeft) {
    variation += 'Left';
  } else if (isRight) {
    variation += 'Right';
  }
  drawCharacter(gameChar_x, gameChar_y, variation);
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
  var cloud = {
     x_pos: random(0, 4000),
     y_pos: random(50, 100),
     size: random(0.6, 1.6),
     draw: function(x_pos,y_pos,size){
        push();
        fill(255);
        ellipse((this.x_pos + 200) * this.size, (this.y_pos + 100) * this.size, this.size * 100, this.size * 25);
        ellipse((this.x_pos + 150) * this.size, (this.y_pos + 105) * this.size, this.size * 20, this.size * 10);
        ellipse((this.x_pos + 160) * this.size, (this.y_pos + 113) * this.size, this.size * 40,this.size * 20);
        ellipse((this.x_pos + 200) * this.size, (this.y_pos + 120) * this.size, this.size * 80, this.size * 30);
        ellipse((this.x_pos + 230) * this.size, (this.y_pos + 105) * this.size, this.size * 50, this.size * 15);
        ellipse((this.x_pos + 230) * this.size, (this.y_pos + 113) * this.size, this.size * 50, this.size * 20);
        ellipse((this.x_pos + 225) * this.size, (this.y_pos + 100) * this.size, this.size * 50, this.size * 50);
        ellipse((this.x_pos + 195) * this.size, (this.y_pos + 100) * this.size, this.size * 40, this.size * 40);

        fill(236,254,255);
        ellipse((this.x_pos + 200) * this.size, (this.y_pos + 120) * this.size,this.size * 80,this.size * 25);
        ellipse((this.x_pos + 165) * this.size, (this.y_pos + 113) * this.size, this.size * 40, this.size * 20);
        ellipse((this.x_pos + 225) * this.size, (this.y_pos + 105) * this.size, this.size * 50, this.size * 20);
        ellipse((this.x_pos + 195) * this.size, (this.y_pos + 105) * this.size, this.size * 50, this.size * 15);
        ellipse((this.x_pos + 195) * this.size, (this.y_pos + 100) * this.size, this.size * 30,this.size * 30);
        pop();
        }
    }
    return cloud;
}

// Function to draw mountains objects.
function drawMountain() {
    var mountains = {
        x_pos: random(42, 4200),
        y_pos: floorPos_y,
        size: random(0.5, 2),
        draw: function(x_pos,y_pos,size){
            push();
            fill(120); //color
            stroke(105);
            triangle(this.x_pos, this.y_pos,    
                     this.x_pos + (200*this.size), this.y_pos,
                     this.x_pos + (100*this.size), this.y_pos -(162*this.size));
            triangle(this.x_pos + (65*this.size),
                     this.y_pos,
                     this.x_pos + (265*this.size), this.y_pos,
                     this.x_pos + (165*this.size), this.y_pos -(272*this.size));
            triangle(this.x_pos + (140*this.size),
                     this.y_pos,
                     this.x_pos + (340*this.size), this.y_pos,
                     this.x_pos + (240*this.size), this.y_pos -(132*this.size));
            pop();
        }
    }
    return mountains;
}

// Function to draw trees objects.
function drawTrees() {
  for (var i = 0; i < trees_x.length; i++) {
    drawTree(this.x);
  }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon) {
  createCanyon(t_canyon.posX, t_canyon.posY);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon) {
  if (
    gameChar_world_x > t_canyon.posX &&
    gameChar_world_x < (t_canyon.posX + t_canyon.posY) &&
    gameChar_y >= floorPos_y
  ) {
    isPlummeting = true;
    isFalling = true;
    charSpeed = 0;
  }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable) {
  createCollectable(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
  fill(224,171,91);
  stroke(148,120,76);
  textSize(30);
  text('G',t_collectable.x_pos-11, t_collectable.y_pos+10);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <  t_collectable.size + 40)
    {
        t_collectable.isFound = true;
        gameScore +=1;
        return;
    }
}

// Variations with drawing the character
function drawCharacter(gameChar_x, gameChar_y, variation = 'standing') {
  function before() {
    noFill();
    stroke(0);
    strokeWeight(2);
  }
    
  function cleanup() {
    strokeWeight(1);
    noFill();
  }
    
  function head(gameChar_x, gameChar_y) {
    fill(234,192,134);
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x, gameChar_y-60, 25,25);
//eyes
    line(gameChar_x-7,gameChar_y-66, gameChar_x-7,gameChar_y-62);
    line(gameChar_x+6,gameChar_y-66, gameChar_x+6,gameChar_y-62);
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+6, gameChar_y-55);
    bezierVertex(gameChar_x+5, gameChar_y-52, gameChar_x-2, gameChar_y-47, gameChar_x-7, gameChar_y-55);
    endShape();
    noFill();
  }

  function body(gameChar_x, gameChar_y, height = 34) {
    line(gameChar_x, gameChar_y - 49, gameChar_x, gameChar_y - (49 - height));
  }

  function standing() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x, gameChar_y-60, 25,25);
//eyes
    line(gameChar_x-7,gameChar_y-66, gameChar_x-7,gameChar_y-62);
    line(gameChar_x+6,gameChar_y-66, gameChar_x+6,gameChar_y-62);
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+6, gameChar_y-55);
    bezierVertex(gameChar_x+5, gameChar_y-52, gameChar_x-2, gameChar_y-47, gameChar_x-7, gameChar_y-55);
    endShape();
//body
    line(gameChar_x, gameChar_y-47, gameChar_x,gameChar_y-17);
// legs
    line(gameChar_x,gameChar_y-17,gameChar_x+10,gameChar_y-4);
    line(gameChar_x,gameChar_y-17,gameChar_x-11,gameChar_y-4);
//foots
    fill(234,192,134);
    ellipse(gameChar_x+14,gameChar_y-2,10,5);
    ellipse(gameChar_x-14,gameChar_y-2,10,5);
//arms
    line(gameChar_x,gameChar_y-42,gameChar_x+10,gameChar_y-32);
    line(gameChar_x,gameChar_y-42,gameChar_x-9,gameChar_y-32);
//hands
    fill(234,192,134);
    ellipse(gameChar_x+13,gameChar_y-30,7,5);
    ellipse(gameChar_x-12,gameChar_y-30,7,5);
      
  }
    
  function jumping() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x, gameChar_y-60, 25,25);
//eyes
    line(gameChar_x-7,gameChar_y-66, gameChar_x-7,gameChar_y-62);
    line(gameChar_x+6,gameChar_y-66, gameChar_x+6,gameChar_y-62);
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+6, gameChar_y-55);
    bezierVertex(gameChar_x+5, gameChar_y-52, gameChar_x-2, gameChar_y-47, gameChar_x-7, gameChar_y-55);
    endShape();
//body
    line(gameChar_x, gameChar_y-47, gameChar_x,gameChar_y-23);
//arms
    line(gameChar_x,gameChar_y-42,gameChar_x+15,gameChar_y-46);
    line(gameChar_x,gameChar_y-42,gameChar_x-14,gameChar_y-48);
//hands
    fill(234,192,134);
    ellipse(gameChar_x+15,gameChar_y-46,7,5);
    ellipse(gameChar_x-14,gameChar_y-48,7,5);
//legs
    line(gameChar_x,gameChar_y-23,gameChar_x+18,gameChar_y-17);
    line(gameChar_x,gameChar_y-23,gameChar_x-16,gameChar_y-22);
//foots
    fill(234,192,134);
    ellipse(gameChar_x+18,gameChar_y-17,10,5);
    ellipse(gameChar_x-16,gameChar_y-22,10,5);
  }
    
  function walkingLeft() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x+5, gameChar_y-60, 20,25);
//eyes
    line(gameChar_x-3,gameChar_y-66, gameChar_x-3,gameChar_y-62);
    line(gameChar_x+5,gameChar_y-66, gameChar_x+5,gameChar_y-62)
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+6, gameChar_y-55);
    bezierVertex(gameChar_x+5, gameChar_y-52, gameChar_x, gameChar_y-47, gameChar_x-4, gameChar_y-55);
    endShape();  
//body
    line(gameChar_x+5, gameChar_y-47, gameChar_x+5,gameChar_y-17);
//legs
    line(gameChar_x+5,gameChar_y-17,gameChar_x-6,gameChar_y-4);
    line(gameChar_x+5,gameChar_y-17,gameChar_x+12,gameChar_y-4);
//foots
    fill(234,192,134);
    ellipse(gameChar_x-9,gameChar_y-2,10,5);
    ellipse(gameChar_x+14,gameChar_y-2,10,5);
//arms
    line(gameChar_x+5,gameChar_y-42,gameChar_x-4,gameChar_y-32);
    line(gameChar_x+5,gameChar_y-42,gameChar_x+10,gameChar_y-32);
//hands
    fill(234,192,134);
    ellipse(gameChar_x+12,gameChar_y-30,7,5);
    ellipse(gameChar_x-7,gameChar_y-30,7,5);
  }
    
  function walkingRight() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x-5, gameChar_y-60, 20,25);
//eyes
    line(gameChar_x+2,gameChar_y-66, gameChar_x+2,gameChar_y-62);
    line(gameChar_x-6,gameChar_y-66, gameChar_x-6,gameChar_y-62)
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+4, gameChar_y-55);
    bezierVertex(gameChar_x+4, gameChar_y-52, gameChar_x, gameChar_y-47, gameChar_x-4, gameChar_y-55);
    endShape();
//body
    line(gameChar_x-5, gameChar_y-47, gameChar_x-5,gameChar_y-17);
//arms
    line(gameChar_x-5,gameChar_y-42,gameChar_x+4,gameChar_y-32);
    line(gameChar_x-5,gameChar_y-42,gameChar_x-10,gameChar_y-32);
//hands
    fill(234,192,134);
    ellipse(gameChar_x-12,gameChar_y-30,7,5);
    ellipse(gameChar_x+7,gameChar_y-30,7,5);
//legs
    line(gameChar_x-5,gameChar_y-17,gameChar_x+6,gameChar_y-4);
    line(gameChar_x-5,gameChar_y-17,gameChar_x-12,gameChar_y-4);
//foots
    fill(234,192,134);
    ellipse(gameChar_x+9,gameChar_y-2,10,5);
    ellipse(gameChar_x-14,gameChar_y-2,10,5);
  }
    
  function jumpingLeft() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x-10, gameChar_y-45, 20,25);
//eyes
    line(gameChar_x-10,gameChar_y-50, gameChar_x-10,gameChar_y-46);
    line(gameChar_x-17,gameChar_y-50, gameChar_x-17,gameChar_y-46);
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x-7, gameChar_y-39);
    bezierVertex(gameChar_x-12, gameChar_y-35, gameChar_x-17, gameChar_y-33, gameChar_x-19, gameChar_y-42);
    endShape();
//body
    line(gameChar_x, gameChar_y-42, gameChar_x+10,gameChar_y-17);
//legs
    line(gameChar_x+10,gameChar_y-17,gameChar_x-15,gameChar_y-20);
    line(gameChar_x+10,gameChar_y-17,gameChar_x-10,gameChar_y-24);
    line(gameChar_x-18,gameChar_y-7,gameChar_x-15,gameChar_y-20);
    line(gameChar_x-9,gameChar_y-11,gameChar_x-10,gameChar_y-24);
//foots
    fill(234,192,134);
    ellipse(gameChar_x-18,gameChar_y-7,10,5);
    ellipse(gameChar_x-09,gameChar_y-11,10,5);
//arms
    line(gameChar_x+3,gameChar_y-35,gameChar_x+20,gameChar_y-55);
    line(gameChar_x+3,gameChar_y-35,gameChar_x+10,gameChar_y-50);
//hands
    fill(234,192,134);
    ellipse(gameChar_x+20,gameChar_y-55,7,5);
    ellipse(gameChar_x+10,gameChar_y-50,7,5);
  }
    
  function jumpingRight() {
//head
    fill(234,192,134);
    stroke(1);
    ellipse(gameChar_x+10, gameChar_y-45, 20,25);
//eyes
    line(gameChar_x+10,gameChar_y-50, gameChar_x+10,gameChar_y-46);
    line(gameChar_x+17,gameChar_y-50, gameChar_x+17,gameChar_y-46);
//mounth
    noFill();
    beginShape();
    vertex(gameChar_x+7, gameChar_y-39);
    bezierVertex(gameChar_x+12, gameChar_y-35, gameChar_x+17, gameChar_y-33, gameChar_x+19, gameChar_y-42);
    endShape();
//body
    line(gameChar_x, gameChar_y-42, gameChar_x-10,gameChar_y-17);
//legs
    line(gameChar_x-10,gameChar_y-17,gameChar_x+15,gameChar_y-20);
    line(gameChar_x-10,gameChar_y-17,gameChar_x+10,gameChar_y-24);
    line(gameChar_x+18,gameChar_y-7,gameChar_x+15,gameChar_y-20);
    line(gameChar_x+9,gameChar_y-11,gameChar_x+10,gameChar_y-24);
//foots
    fill(234,192,134);
    ellipse(gameChar_x+18,gameChar_y-7,10,5);
    ellipse(gameChar_x+09,gameChar_y-11,10,5);
//arms
    line(gameChar_x-3,gameChar_y-35,gameChar_x-20,gameChar_y-55);
    line(gameChar_x-3,gameChar_y-35,gameChar_x-10,gameChar_y-50);
//hands
    fill(234,192,134);
    ellipse(gameChar_x-20,gameChar_y-55,7,5);
    ellipse(gameChar_x-10,gameChar_y-50,7,5);
  }

  // variations names
  var variations = {
    standing,
    jumping,
    walkingLeft,
    walkingRight,
    jumpingLeft,
    jumpingRight
  };
    
  before();
  variations[variation]();
  cleanup();
}

function createCollectable(x, y, size) { // creating the collectables
  noStroke();
  fill(255,231,106);
  var height = size;
  var width = size;
  ellipse(x, y, height, width);
}

function createCanyon(x, width) { // creating the canyons
  noStroke();
  fill(60, 30, 6);
  beginShape();
  vertex(x, 432);
  vertex(x, 510);
  vertex(x, 576);
  vertex(x + width, 576);
  vertex(x + width, 492);
  vertex(x + width, 432);
  endShape();
  noFill();
}

function drawTree(x) { // creating the trees
 var tree = {
        x: random(42,4200),
        draw: function (x){
            push();
            fill(163,86,56);
            rect(this.x,floorPos_y-100, 20, 100);
            fill(144,88,88);
            rect(this.x+1,floorPos_y-100, 2, 100);
            fill(93,58,58);
            rect(this.x+14,floorPos_y-100, 2, 100);
            fill(0,207,149);
            stroke(91,140,90);
            rect(this.x-20, floorPos_y-120, 60, 80, 40);

            noStroke();
            fill(107,140,66);
            rect(this.x-20, floorPos_y-68,60,5,0,0,10,10);
            rect(this.x-20, floorPos_y-78,60,5);
            rect(this.x-20, floorPos_y-88,60,5);
            rect(this.x-20, floorPos_y-98,60,5, 10,10,0,0);    
            pop();
        }
    }
    return tree;
}

function renderFlagpole() { // rendering the flag pole
    noStroke();
    if (flagpole.isReached == false){
        fill(194,192,191);
        rect(flagpole.x_pos,floorPos_y-100,75,50);
        strokeWeight(4);
        stroke(51);
        line(flagpole.x_pos,floorPos_y-300,flagpole.x_pos,floorPos_y);
    } else {
        fill(163,31,52);
        rect(flagpole.x_pos,floorPos_y-300,75,50);
        strokeWeight(4);
        stroke(51);
        line(flagpole.x_pos,floorPos_y-300,flagpole.x_pos,floorPos_y);
    }
}

function checkFlagpole() { // checking the flag pole
    if (abs(gameChar_world_x - flagpole.x_pos) < 20){
        flagpole.isReached = true;
    }
}

function checkPlayerDie(){ // check if the character still lives
// Decrement lives when the character has fallen below the bottom of the canvas
    if (gameChar_y == height) { 
        lives -= 1;
// Test if the player has used all of their lives
        if (lives > 0) { 
            startGame(); 
        }                      
    }
    
    if (lives<0){
        startGame();
    }
    
    if (gameChar_y == floorPos_y+1 ){
        lives -= 1;
    }
 }

function livesLogo(x,y){ // count the remaining lives with the head of the character
    push();
    y = y + 35;
//head
    fill(234,192,134);
    stroke(1);
    ellipse(x, y-60, 25,25);
//eyes
    line(x-7,y-66, x-7,y-62);
    line(x+6,y-66, x+6,y-62);
//mounth
    noFill();
    beginShape();
    vertex(x+6, y-55);
    bezierVertex(x+5, y-52, x-2, y-47, x-7, y-55);
    endShape();
    pop();
    
}

function createPlatforms(x, y, length) // Creating the platforms
{
        var p = {
            x: x,
            y: y,
            length: length,
            draw: function(){
                stroke(255,0,255);
                fill(70, 10, 0);
                rect(this.x, this.y, this.length, 10);
                line(this.x + 20, this.y, this.x +20, this.y +10);
                line(this.x + 40, this.y, this.x +40, this.y +10);
                line(this.x + 60, this.y, this.x +60, this.y +10);
                line(this.x + 80, this.y, this.x +80, this.y +10);
            
            },
            checkContact: function(gc_x, gc_y){
                if(gc_x > this.x && gc_x < this.x + this.length){
                    var d = this.y - gc_y;
                    if(d >= 0 && d < 2)
                    {
                        return true; 
                    }
                }
                return false;
            }
    }
            return p;
}


function Enemy(x, y, range) // Enemy function
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.update = function()
    {
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range){
            this.inc = -1;
        }else if(this.currentX < this.x){
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        noStroke();
        /* 
             Drawing the Goomba :)
             https://en.wikipedia.org/wiki/Goomba
             https://www.mariowiki.com/Goomba
        */  
// head
          fill(201,76,12);
          translate(-8, 0);
          rect(this.currentX+18,this.y-41,20,3);
          rect(this.currentX+15,this.y-41+3,26,3);
          rect(this.currentX+12,this.y-41+6,32,3);
          rect(this.currentX+9,this.y-41+9,38,3);
          rect(this.currentX+6,this.y-41+12,44,3);
          rect(this.currentX+3,this.y-41+15,50,18);
          rect(this.currentX,this.y-41+21,56,9);
// body
          fill(253,187,175);
          rect(this.currentX+15,this.y-41+30,26,3);
          rect(this.currentX+12,this.y-41+33,32,18);
          rect(this.currentX+12,this.y-41+15,3,12);
          rect(this.currentX+41,this.y-41+15,3,12);
          rect(this.currentX+12,this.y-41+24,9,3);
          rect(this.currentX+35,this.y-41+24,9,3);
          rect(this.currentX+18,this.y-41+21,3,6);
          rect(this.currentX+35,this.y-41+21,3,6);
// foots and eyebrows
          fill(0);
          rect(this.currentX+6,this.y-41+39,6,6);
          rect(this.currentX+44,this.y-41+39,6,6);
          rect(this.currentX+3,this.y-41+42,18,6);
          rect(this.currentX+36,this.y-41+42,18,6);
          rect(this.currentX+6,this.y-41+45,18,6);
          rect(this.currentX+33,this.y-41+45,18,6);
          rect(this.currentX+9,this.y-41+12,6,3);
          rect(this.currentX+41,this.y-41+12,6,3);
          rect(this.currentX+15,this.y-41+15,3,9);
          rect(this.currentX+38,this.y-41+15,3,9);
          rect(this.currentX+16,this.y-41+18,24,3);
    }
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y-20);
        if(d < 58){
            return true;
        }
        return false;
    }
}