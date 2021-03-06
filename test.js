        
var can, ctx;

var WINDOW_WIDTH  = 568;
var WINDOW_HEIGHT = 320;
        
const MODE_INIT         = 0;
const MODE_BEGIN        = 1;
const MODE_PLAY         = 2;
const MODE_END          = 3;
const MODE_OPTIONS      = 4;
const MODE_INSTRUCTIONS = 5;

var mode                = MODE_INIT;
        
var spawnX              = 30;
var spawnY              = 150;
        
var level               = 1;
var levelTxt;
        
var gameOver;
        
var buttonPlay          = {top:0, bottom:0, right:0, left:0};
var buttonOptions       = {top:0, bottom:0, right:0, left:0};
var buttonInts          = {top:0, bottom:0, right:0, left:0};
        
player                  = {x:spawnX, y:spawnY, width:15, height:15, jumping:false, 
			   velY:0, velX:0, speed:3, jumping:false, grounded:false};

var buttonUp            = {top:0, bottom:0, right:0, left:0};
var buttonRight         = {top:0, bottom:0, right:0, left:0};
var buttonLeft          = {top:0, bottom:0, right:0, left:0};

var boxes = [];

var friction            = 0.8;
var gravity             = 0.2;

var moveUp              = false;
var moveRight           = false;
var moveLeft            = false;

var debug               = false;

function log(str) {
    if (debug) {
	console.log(str);
    }
}
            
function init() {
    window.scrollTo(0, 1);
    can = document.getElementById("can");
    ctx = can.getContext("2d");
    can.addEventListener("mousedown", doMouseDown, false);
    can.addEventListener("mouseup",   doMouseUp,   false);
    // doRect(0, 0, 100, 100, 'red');
    runGame();
}
        
function runGame() {
    timerHandle = setInterval(doGame, 25);
}
        
function doGame() {
    if (mode === MODE_INIT) {
	loadingScreen();
    } else if (mode === MODE_PLAY) {
	update();
    } else if (mode === MODE_END) {
	endScreen();
	gameOver--;
	if (gameOver < 0) {
	    mode = MODE_BEGIN;
	}
    } else if (mode === MODE_BEGIN) {
	splashScreen();
    } else if (mode === MODE_OPTIONS) {
	optionsScreen();
    } else if (mode === MODE_INSTRUCTIONS) {
	intsScreen();
    }
}
        
function endScreen() {
    drawBackground();
    drawScore();
    doText('game over', WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'white', '14pt EuphemiaUCAS', 'bottom', 'center');
}
        
function loadingScreen() {
    drawBackground();
    doText('loading...', WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'white', '30pt EuphemiaUCAS', 'bottom', 'center');
    mode = MODE_BEGIN;
}
        
function intsScreen() {
    drawBackground();
    doText('Use the arrows to move.', WINDOW_WIDTH/2, WINDOW_HEIGHT/4, 'white', '12pt EuphemiaUCAS', 'bottom', 'center');
    doText('You are dealthly allergic to red squares!', WINDOW_WIDTH/2, WINDOW_HEIGHT/3, 'white', '12pt EuphemiaUCAS', 'bottom', 'center');
    doText("Try to avoid throwing your phone down in rage.", WINDOW_WIDTH/2, WINDOW_HEIGHT/2.5, 'white', '12pt EuphemiaUCAS', 'bottom', 'center');
    doText("Use the level creator to make your own levels!", WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'white', '12pt EuphemiaUCAS', 'bottom', 'center');
    doText('Have Fun!', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.5, 'white', '12pt EuphemiaUCAS', 'bottom', 'center');
            
    ctx.globalAlpha  = 1;
    ctx.lineWidth = 1;
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(ints.left, ints.top, ints.right - ints.left, ints.bottom - ints.top);
    doText('<--', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.2, 'black', '24pt EuphemiaUCAS', 'middle', 'center');
}
        
function splashScreen() {
    drawBackground();
            
    doText('Little Cube', WINDOW_WIDTH/2, WINDOW_HEIGHT/4, 'black', '30pt EuphemiaUCAS', 'middle', 'center');
            
    buttonPlay.top    = WINDOW_HEIGHT/2 - 20;
    buttonPlay.bottom = WINDOW_HEIGHT/2 + 20;
    buttonPlay.right  = WINDOW_WIDTH/2 + 50;
    buttonPlay.left   = WINDOW_WIDTH/2 - 50;
    doRect(buttonPlay.left, buttonPlay.top, buttonPlay.right - buttonPlay.left, buttonPlay.bottom - buttonPlay.top, '#00FFFF');
    doText('Play', WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'black', '14pt EuphemiaUCAS', 'middle', 'center');

    // Draw Options Button
    buttonOptions.top   = WINDOW_HEIGHT/1.5 - 20;
    buttonOptions.bottom = WINDOW_HEIGHT/1.5 + 20;
    buttonOptions.right  = WINDOW_WIDTH/2 + 50;
    buttonOptions.left   = WINDOW_WIDTH/2 - 50;
            
    doRect(buttonOptions.left, buttonOptions.top, buttonOptions.right - buttonOptions.left, buttonOptions.bottom - buttonOptions.top, '#00FFFF');
    doText('Level Creator', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.5, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
            
    // Draw Instructions Button
    buttonInts.top    =  WINDOW_HEIGHT/1.2 - 20;
    buttonInts.bottom =  WINDOW_HEIGHT/1.2 + 20;
    buttonInts.right  =  WINDOW_WIDTH/2 + 50;
    buttonInts.left   =  WINDOW_WIDTH/2 - 50;
            
    doRect(buttonInts.left, buttonInts.top, buttonInts.right - buttonInts.left, buttonInts.bottom - buttonInts.top, '#00FFFF');
    doText('Instructions', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
}
        
function optionsScreen() {
    drawBackground();
    doText('Not yet been implemented. Stay tuned!', WINDOW_WIDTH / 2, WINDOW_HEIGHT / 3, 'white', '10pt EuphemiaUCAS', 'bottom', 'center');
}
        
function initGame() {
    mode  = MODE_PLAY;
    level = 1;
    makeLevel();
}

function makeLevel() {
    boxes    = [];
    player.x = spawnX;
    player.y = spawnY;
            
    // default for every screen
    boxes.push({x: 0, y: WINDOW_HEIGHT - 100, width: WINDOW_WIDTH, height: 100,  mode: 0});
    boxes.push({x: 0, y: 0,                   width: 10,  height: WINDOW_HEIGHT, mode: 0});
                                  
    if (level === 1) {
	levelTxt = "Little Cube what are you doing here?";
	boxes.push({x: WINDOW_WIDTH - 10,y: 0,width: 50,height: WINDOW_HEIGHT/2,mode: 0});
    } else if (level === 2) {
	levelTxt = "You're too small!";
	boxes.push({x: WINDOW_WIDTH - 10,y: 0,width: 50,height: WINDOW_HEIGHT/2,mode: 0});
	boxes.push({x: 160,y: WINDOW_HEIGHT - 101,width: 145,height: 10,mode: 1});
    } else if (level === 3) {
	levelTxt = "and not smart enough!";
	boxes.push({x: WINDOW_WIDTH - 10,y: 0,width: 50,height: WINDOW_HEIGHT/2,mode: 0});
    } else {
	mode = MODE_BEGIN;
    }
}

function cmap(mode) {
    if (mode === 0) {
	return "black";
    } else if (mode === 1) {
	return "red";
    } else if (mode === 2) {
	return "purple";
    }
}

function update() {
    // check keys
    if (moveUp === true) {
	if (!player.jumping && player.grounded) {
	    player.jumping  = true;
	    player.grounded = false;
	    player.velY     = -player.speed * 2;
	}
    }

    if (moveRight === true) {
	if (player.velX < player.speed) {
	    player.velX++;
	}
    }

    if (moveLeft === true) {
	if (player.velX > -player.speed) {
	    player.velX--;
	}
    }

    // adjust
    player.velX *= friction;
    player.velY += gravity;

    drawBackground();
	    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
	doRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height, cmap(boxes[i].mode));
	var dir = colCheck(player, boxes[i]);
	if (dir === "l" || dir === "r") {
	    player.velX = 0;
	    player.jumping = false;
	} else if (dir === "b") {
	    player.grounded = true;
	    player.jumping = false;
	} else if (dir === "t") {
	    player.velY *= -1;
	}
    }

    doText(levelTxt, WINDOW_WIDTH/2, 40, 'white', '14pt EuphemiaUCAS', 'bottom', 'center');

    drawControls();

    if (player.grounded === true) {
	player.velY = 0;
    }
	    
    player.x += player.velX;
    player.y += player.velY;

    drawPlayer();

    checkLevelComplete();
}

function drawPlayer() {
    doRect(player.x, player.y, player.width, player.height, 'black');
    //c.fillStyle = "#00FFFF";
    //c.fillRect(player.x + 10, player.y + 5, 2,2);
}



function colCheck(shapeA, shapeB) {
    var vX       = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));   // get the vectors to check against
    var vY       = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));
    var hWidths  = (shapeA.width / 2) + (shapeB.width / 2);    // add the half widths and half heights of the objects
    var hHeights = (shapeA.height / 2) + (shapeB.height / 2);
    var colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if ((Math.abs(vX) < hWidths) && (Math.abs(vY) < hHeights)) {
	// figures out on which side we are colliding (top, bottom, left, or right)
	if (shapeB.mode === 1) {
	    player.x = spawnX;
	    player.y = spawnY;
	} else if (shapeB.mode === 2) {
	    player.velY = -10;
	}

	var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);

	if (oX >= oY) {
	    if (vY > 0) {
		colDir = "t";
		shapeA.y += oY;
	    } else {
		colDir = "b";
		shapeA.y -= oY;
	    }
	} else {
	    if (vX > 0) {
		colDir = "l";
		shapeA.x += oX;
	    } else {
		colDir = "r";
		shapeA.x -= oX;
	    }

	    if (shapeB.mode === 2) {
		player.velY = -10;
	    }
	}
    }
    return colDir;
}


function drawControls() {
    buttonUp.top    =  WINDOW_HEIGHT/1.2 - 20;
    buttonUp.bottom =  WINDOW_HEIGHT/1.2 + 20;
    buttonUp.right  =  425;
    buttonUp.left   = buttonUp.right - 50;

    doRect(buttonUp.left, buttonUp.top, buttonUp.right - buttonUp.left, buttonUp.bottom - buttonUp.top, '#00FFFF');
    doText('^', 400, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
   		
    buttonRight.top    =  WINDOW_HEIGHT/1.2 - 20;
    buttonRight.bottom =  WINDOW_HEIGHT/1.2 + 20;
    buttonRight.right  =  200;
    buttonRight.left   =  150;

    doRect(buttonRight.left, buttonRight.top, buttonRight.right - buttonRight.left, buttonRight.bottom - buttonRight.top, '#00FFFF');
    doText('>', 175, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
   		
    buttonLeft.top    =  WINDOW_HEIGHT/1.2 - 20;
    buttonLeft.bottom =  WINDOW_HEIGHT/1.2 + 20;
    buttonLeft.right  =  100;
    buttonLeft.left   =  50;

    doRect(buttonLeft.left, buttonLeft.top, buttonLeft.right - buttonLeft.left, buttonLeft.bottom - buttonLeft.top, '#00FFFF');
    doText('<', 75, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
}

function checkLevelComplete() {
    if (player.x > WINDOW_WIDTH - 1) {
	level++;
	makeLevel();
    }
}

function doMouseDown(event) {
    // x,y switched on purpose, to translate to actual x,y of screen
    var mouseX = event.pageY;
    var mouseY = WINDOW_HEIGHT - event.pageX;
		  
    if (mode === MODE_BEGIN){
	if (mouseX < buttonPlay.right && mouseX > buttonPlay.left && mouseY < buttonPlay.bottom && mouseY > buttonPlay.top) {
	    initGame();
	}

	if (mouseX < buttonOptions.right && mouseX > buttonOptions.left && mouseY < buttonOptions.bottom && mouseY > buttonOptions.top) {
	    mode = MODE_OPTIONS;
	}

	if (mouseX < buttonInts.right && mouseX > buttonInts.left && mouseY < buttonInts.bottom && mouseY > buttonInts.top) {
	    mode = MODE_INSTRUCTIONS;
	}
    } else if (mode === MODE_OPTIONS) {
	mode = MODE_BEGIN;
    } else if (mode === MODE_INSTRUCTIONS) {
	if (mouseX < buttonInts.right && mouseX > buttonInts.left && mouseY < buttonInts.bottom && mouseY > buttonInts.top) {
	    mode = MODE_BEGIN;
	} 
    } else if (mode === MODE_PLAY) {
	if (mouseX < buttonUp.right && mouseX > buttonUp.left && mouseY < buttonUp.bottom && mouseY > buttonUp.top) {
	    moveUp = true;
	}
	if (mouseX < buttonLeft.right && mouseX > buttonLeft.left && mouseY < buttonLeft.bottom && mouseY > buttonLeft.top) {
	    moveLeft = true;
	}
	if (mouseX < buttonRight.right && mouseX > buttonRight.left && mouseY < buttonRight.bottom && mouseY > buttonRight.top) {
	    moveRight = true;
	}
    }
}

function doMouseUp(event) {
    moveRight = false;
    moveLeft  = false;
    moveUp    = false;
}

        
function drawBackground() {
    doRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, 'gray');
}

function doRect(x, y, w, h, color) {
    ctx.save();
    ctx.translate(320, 0);
    ctx.rotate(Math.PI / 2.0);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}

function doText(str, x, y, color, font, baseline, align) {
    ctx.save();
    ctx.translate(320, 0);
    ctx.rotate(90 * Math.PI / 180);
    ctx.globalAlpha  = 1;
    ctx.fillStyle    = color;
    ctx.font         = font;
    ctx.textBaseline = baseline;
    ctx.textAlign    = align;
    ctx.fillText(str, x, y);
    ctx.restore();
}

function blockmove(event) {
    event.preventDefault(); // Tell Safari not to move the window.
}
