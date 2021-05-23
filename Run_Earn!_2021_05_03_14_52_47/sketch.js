var START = 2;
var PLAY = 1;
var END = 0;
var gameState = 2;

var man, man2, runningMan, fracturedMan;
var ground, groundImage, background, bgImage;
var moneyGroup, moneyImage;
var treasureBoxGroup, treasureBoxImage;
var obstacleGroup, obstacleImage1, obstacleImage2, obstacleImage3;

var score = 0;

function preload() {
  runningMan = loadAnimation('running_man1.png', 'running_man2.png', 'running_man3.png', 'running_man4.png', 'running_man5.png', 'running_man6.png', 'running_man7.png', 'running_man8.png', 'running_man9.png');
  fracturedMan = loadAnimation("fractured.png");

  groundImage = loadImage('ground.png');

  obstacleImage1 = loadImage('obstacle1.png');
  obstacleImage2 = loadImage('obstacle2.png');
  obstacleImage3 = loadImage('obstacle3.png');

  moneyImage = loadImage('money.png');

  treasureBoxImage = loadImage('treasure_box.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  man = createSprite(90, windowHeight - 80, 20, 20);
  man.addAnimation('running', runningMan);
  man.scale = 2;

  man2 = createSprite(windowWidth / 2, windowHeight / 2, 10, 10);
  man2.addAnimation("fractured", fracturedMan);
  man2.scale = 0.2;
  man2.visible = false;

  ground = createSprite(windowWidth / 2, windowHeight - 14, 400, 20);
  ground.addImage(groundImage);
  ground.scale = 1;
  ground.visible = true;

  man.depth = ground.depth;
  man.depth = ground.depth + 1;

  invisibleGround = createSprite(300, windowHeight - 5, 600, 20);
  invisibleGround.visible = false;

  obstacleGroup = createGroup();
  moneyGroup = createGroup();
  treasureBoxGroup = createGroup();
}

function draw() {
  background('white');
  // text(mouseX + ',' + mouseY, mouseX, mouseY);

  if (gameState === START) {
    fill('orange');
    textSize(windowWidth/50);
    textFont('Comic Sans MS');
    text('RUN, EARN!!', windowWidth / 2 - 80, windowHeight / 2);
    fill('black');
    text('Press space / tap to start', windowWidth / 2 - 160, windowHeight / 2 + 50);
    if (touches.length < 0 || keyDown('space')) {
      gameState = PLAY;
      touches = [];
    }
  } else if (gameState === PLAY) {
    man.visible = true;
    man2.visible = false;

    fill("red");
    textSize(15);
    text("Money collected : " + score, windowWidth - 160, windowHeight - 580);

    ground.velocityX = -4;

      if (ground.x < width) {
        ground.x = width / 2;
      }

      if (touches.length < 0 || keyDown('space') && man.y >= windowHeight - 220) {
        man.velocityY = -8;
        touches = [];
      }

      if (frameCount % 140 === 0) {
        var rand = Math.round(random(1, 2));
        switch (rand) {
          case 1: 
            spawnObstacle();
          break;
          case 2:
             spawnMoney();
          break;                  
          default:
          break;
        }
      }

      if (moneyGroup.isTouching(man)) {
        score = score + 100;
        moneyGroup.destroyEach();
      }

      if (treasureBoxGroup.isTouching(man)) {
        score = score + 200;
        treasureBoxGroup.destroyEach();
      }

      if (obstacleGroup.isTouching(man)) {
        gameState = END;
      }

    spawnTreasure();

    man.velocityY = man.velocityY + 0.6;

  } else if (gameState === END) {
    ground.velocityX = 0;
    moneyGroup.setVelocityXEach = 0;
    treasureBoxGroup.setVelocityXEach = 0;
    obstacleGroup.setVelocityXEach = 0;

    moneyGroup.setLifetimeEach = -1;
    treasureBoxGroup.setLifetimeEach = -1;
    obstacleGroup.setLifetimeEach = -1;

    moneyGroup.destroyEach();
    treasureBoxGroup.destroyEach();
    obstacleGroup.destroyEach();

    man.visible = false;
    man2.visible = true;

    fill('black');
    textSize(20);
    text('YOU FRACTURED YOUR LEG...', windowWidth/2 + 80, windowHeight/2);

    fill('red');
    text('press r to start...', windowWidth/2 + 80, windowHeight/2 + 20);

    if (keyDown("r")) {
      gameState = PLAY;
      score = 0;
    }
  }

  man.collide(invisibleGround);

  drawSprites();
}

function spawnObstacle() {
  var obstacle = createSprite(windowWidth-0, windowHeight-50, 10, 30);
  obstacle.velocityX = -3;

  //generate random obstacles
  var rand = Math.round(random(1, 3));
  switch (rand) {
    case 1:
      obstacle.addImage(obstacleImage1);
      break;
    case 2:
      obstacle.addImage(obstacleImage2);
      break;
    case 3:
      obstacle.addImage(obstacleImage3);
      break;
    default:
      break;
  }
  obstacle.scale = 0.4;
  obstacle.lifetime = windowWidth / 3 + 20;
  obstacle.depth = man.depth;
  man.depth = obstacle.depth + 1;
  obstacleGroup.add(obstacle);

}

function spawnMoney() {
  var money = createSprite(windowWidth-0, windowHeight-50, 10, 30);
  money.velocityX = -3;
  money.addImage(moneyImage);
  money.lifetime = windowWidth / 3 + 20;
  money.scale = 0.2;
  moneyGroup.add(money);
}

function spawnTreasure() {
  if (frameCount % 450 === 0) {
    var treasure = createSprite(windowWidth-0, windowHeight-50, 10, 30);
    treasure.velocityX = -3;
    treasure.addImage(treasureBoxImage);
    treasure.scale = 0.3;
    treasure.lifetime = windowWidth / 3 + 20;
    treasureBoxGroup.add(treasure);
    treasure.depth = ground.depth;
    treasure.depth = ground.depth + 1;
  }
}
