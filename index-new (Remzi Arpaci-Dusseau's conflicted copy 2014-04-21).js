// BEGIN

// USEFUL for touch events
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events

// this is defined by an m4 script (in replace.csh) that sets up two files
// index.html      (for use on phone)
// index-test.html (for use on web)

var onPhone             = DEF_ONPHONE;
var debug               = true;
var debug               = false;

var can;
var ctx;
            
var WINDOW_WIDTH        = 568;
var WINDOW_HEIGHT       = 320;

const MODE_INIT         = 0;
const MODE_BEGIN        = 1;
const MODE_PLAY         = 2;
const MODE_END          = 3;
const MODE_OPTIONS      = 4;
const MODE_INSTRUCTIONS = 5;

var mode                = MODE_INIT;

const KEY_SPACEBAR      = 32;

const KEY_LEFTARROW     = 37;
const KEY_UPARROW       = 38;
const KEY_RIGHTARROW    = 39;
const KEY_DOWNARROW     = 40;

const KEY_MAX           = 1000;

var keys                = [];

// COLOR
var backgroundColor     = 'black';

var playerColor         = 'orange';
var playerEyeWhites     = '#eeeeee';
var playerEyePupil      = '#3366ff';

// var buttonColor         = '#00bfff';
// var buttonPressedColor  = '#cc3366';
var buttonColor         = '#999999';
var buttonPressedColor  = '#555555';

var splashButtonColor   = '#999999';

var groundColor         = '#222222';
var deathColor          = 'white';
var bounceColor         = '#888888';


var level               = 0;
var levelTxt;

var gameOver;

var buttonPlay          = {top:0, bottom:0, right:0, left:0};
var buttonOptions       = {top:0, bottom:0, right:0, left:0};
var buttonInts          = {top:0, bottom:0, right:0, left:0};

var player              = {x:spawnX, y:spawnY, width:16, height:16, 
                           velY:0, velX:0, speed:3, 
			   jumping:false, grounded:false};

var spawnX              = 30;
var spawnY              = WINDOW_HEIGHT - 100 - player.height;

var buttonUp            = {top:0, bottom:0, right:0, left:0};
var buttonRight         = {top:0, bottom:0, right:0, left:0};
var buttonLeft          = {top:0, bottom:0, right:0, left:0};

var boxes = [];

var friction            = 0.8;
var gravity             = 0.2;

var moveUp              = false;
var moveRight           = false;
var moveLeft            = false;

var touches             = [];

var counter             = 0;
var endCounter          = 0;
var delCounter          = 0;

var msg                 = [];

function log(str) {
    if (onPhone === false && debug === true) {
        console.log(str);
    }
    if (onPhone === true && debug === true) {
	msg.push(str);
	if (msg.length > 10) {
	    msg.splice(0, 1);
	}
    }
}

function drawLog() {
    if ((onPhone === false) || (debug === false)) {
	return;
    }

    var yPos = 20;
    doText('log (' + msg.length + ')', 20, yPos, 'white', '8pt EuphemiaUCAS', 'bottom', 'left');
    yPos += 20;

    for (var i = 0; i < msg.length; i++) {
        doText(msg[i], 20, yPos, 'white', '8pt EuphemiaUCAS', 'bottom', 'left');
	yPos += 16;
    }
}

function init() {
    window.scrollTo(0, 1);

    can = document.getElementById("can");
    ctx = can.getContext("2d");

    console.log('init1');
    log('init');
    if (onPhone === true) {
	can.addEventListener("touchstart", doTouchStart, false);
	can.addEventListener("touchend",   doTouchEnd,   false);
	can.addEventListener("touchleave", doTouchEnd,   false);
    } else {
	keyInit();
	document.onkeydown = keyDown;
	document.onkeyup   = keyUp;
    }

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
	touches = [];
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
    ctx.lineWidth    = 1;
    ctx.fillStyle    = '#00FF00';
    ctx.fillRect(ints.left, ints.top, ints.right - ints.left, ints.bottom - ints.top);
    doText('<--', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.2, 'black', '24pt EuphemiaUCAS', 'middle', 'center');
}

function splashScreen() {

    drawBackground();

    drawLog();

    doText('Little Cube', WINDOW_WIDTH/2, WINDOW_HEIGHT/4, 'white', '30pt EuphemiaUCAS', 'middle', 'center');
    
    buttonPlay.top    = WINDOW_HEIGHT/2 - 20;
    buttonPlay.bottom = WINDOW_HEIGHT/2 + 20;
    buttonPlay.right  = WINDOW_WIDTH/2 + 50;
    buttonPlay.left   = WINDOW_WIDTH/2 - 50;
    doRect(buttonPlay.left, buttonPlay.top, buttonPlay.right - buttonPlay.left, buttonPlay.bottom - buttonPlay.top, splashButtonColor, 0, '');
    doText('Play', WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'black', '14pt EuphemiaUCAS', 'middle', 'center');
    
    // Draw Options Button
    buttonOptions.top   = WINDOW_HEIGHT/1.5 - 20;
    buttonOptions.bottom = WINDOW_HEIGHT/1.5 + 20;
    buttonOptions.right  = WINDOW_WIDTH/2 + 50;
    buttonOptions.left   = WINDOW_WIDTH/2 - 50;
    
    doRect(buttonOptions.left, buttonOptions.top, buttonOptions.right - buttonOptions.left, buttonOptions.bottom - buttonOptions.top, 
	   splashButtonColor, 0, '');
    doText('Level Creator', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.5, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
    
    // Draw Instructions Button
    buttonInts.top    =  WINDOW_HEIGHT/1.2 - 20;
    buttonInts.bottom =  WINDOW_HEIGHT/1.2 + 20;
    buttonInts.right  =  WINDOW_WIDTH/2 + 50;
    buttonInts.left   =  WINDOW_WIDTH/2 - 50;
    
    doRect(buttonInts.left, buttonInts.top, buttonInts.right - buttonInts.left, buttonInts.bottom - buttonInts.top, 
	   splashButtonColor, 0, '');
    doText('Instructions', WINDOW_WIDTH/2, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');
}

function optionsScreen() {
    drawBackground();
    doText('Not yet been implemented. Stay tuned!', WINDOW_WIDTH / 2, WINDOW_HEIGHT / 3, 'white', '10pt EuphemiaUCAS', 'bottom', 'center');
}

function initGame() {
    mode      = MODE_PLAY;
    level     = 0;
    touches   = []
    moveRight = false;
    moveLeft  = false;
    moveUp    = false;
    makeLevel();
}

function makeLevel() {
    boxes    = [];
    player.x = spawnX;
    player.y = spawnY;
    
    // default for every screen
    boxes.push({x: 0, y: WINDOW_HEIGHT - 100, width: WINDOW_WIDTH, height: 100,  mode: 0});
    boxes.push({x: 0, y: 0,                   width: 20,           height: WINDOW_HEIGHT, mode: 0});

    // the macro below (called INSERT_LEVELS) is used to stitch in code from a level maker
    // DO NOT REMOVE IT (if you want the code to work
    // Right now, if you finish all the levels, it just starts over

    // INSERT_LEVELS
    if (level == -2) {
        // left blank
    } else if (level == 0) {
        levelTxt = "Just run to the right, silly cube!";
    } else if (level == 1) {
        levelTxt = "Life gives you barriers. So make jump-ade!";
        boxes.push({x:263, y:162, width:18, height:58, mode:0});
    } else if (level == 2) {
        levelTxt = "One little jump can lead to another?";
        boxes.push({x:277, y:86, width:18, height:134, mode:0});
        boxes.push({x:170, y:152, width:18, height:68, mode:0});
        boxes.push({x:389, y:150, width:17, height:70, mode:0});
    } else if (level == 3) {
        levelTxt = "But watch out! Death looms, in the lava pits...";
        boxes.push({x:191, y:217, width:91, height:10, mode:1});
    } else if (level == 4) {
        levelTxt = "Use bouncy pads for super jumps!";
        boxes.push({x:261, y:80, width:29, height:145, mode:0});
        boxes.push({x:127, y:218, width:107, height:5, mode:2});
    } else if (level == 5) {
        levelTxt = "Little cube it is time for me to depart...";
        boxes.push({x:112, y:150, width:77, height:22, mode:0});
        boxes.push({x:236, y:79, width:79, height:21, mode:0});
        boxes.push({x:549, y:2, width:19, height:138, mode:0});
        boxes.push({x:381, y:146, width:137, height:22, mode:0});
        boxes.push({x:116, y:211, width:419, height:12, mode:1});
        boxes.push({x:382, y:90, width:138, height:2, mode:0});
    } else if (level == 6) {
        levelTxt = "Keep your sights sharp.";
        boxes.push({x:139, y:156, width:38, height:66, mode:0});
        boxes.push({x:232, y:108, width:98, height:31, mode:0});
        boxes.push({x:392, y:205, width:176, height:18, mode:1});
        boxes.push({x:464, y:91, width:2, height:2, mode:0});
    } else if (level == 7) {
        levelTxt = "Your hopes high.";
        boxes.push({x:187, y:182, width:15, height:40, mode:0});
        boxes.push({x:247, y:126, width:19, height:95, mode:0});
        boxes.push({x:291, y:38, width:3, height:184, mode:0});
        boxes.push({x:295, y:213, width:273, height:7, mode:1});
        boxes.push({x:402, y:120, width:71, height:10, mode:0});
        boxes.push({x:276, y:75, width:16, height:8, mode:0});
        boxes.push({x:265, y:173, width:7, height:3, mode:0});
    } else if (level == 8) {
        levelTxt = "And don't let anyone bring you down.";
        boxes.push({x:104, y:216, width:392, height:9, mode:1});
        boxes.push({x:145, y:174, width:39, height:8, mode:0});
        boxes.push({x:216, y:134, width:41, height:8, mode:0});
        boxes.push({x:304, y:78, width:54, height:9, mode:0});
    } else if (level == 9) {
        levelTxt = "Good bye.";
    } else if (level == 10) {
        levelTxt = "";
        boxes.push({x:137, y:208, width:24, height:14, mode:1});
        boxes.push({x:186, y:209, width:21, height:12, mode:1});
        boxes.push({x:231, y:204, width:18, height:16, mode:1});
        boxes.push({x:276, y:196, width:23, height:24, mode:1});
    } else if (level == 11) {
        levelTxt = "Hey, Little Cube! What are you doing here?";
        boxes.push({x:154, y:181, width:5, height:43, mode:0});
        boxes.push({x:207, y:150, width:6, height:81, mode:0});
        boxes.push({x:254, y:114, width:7, height:112, mode:0});
        boxes.push({x:306, y:85, width:9, height:137, mode:0});
        boxes.push({x:159, y:218, width:48, height:9, mode:1});
        boxes.push({x:214, y:220, width:40, height:8, mode:1});
        boxes.push({x:263, y:219, width:43, height:9, mode:1});
    } else if (level == 12) {
        levelTxt = "You can't be here!";
        boxes.push({x:136, y:219, width:58, height:7, mode:2});
        boxes.push({x:260, y:218, width:59, height:8, mode:2});
        boxes.push({x:391, y:218, width:56, height:11, mode:2});
        boxes.push({x:22, y:87, width:545, height:13, mode:1});
    } else if (level == 13) {
        levelTxt = "You can't jump far enough!";
        boxes.push({x:188, y:219, width:145, height:8, mode:1});
    } else if (level == 14) {
        levelTxt = "You aren't smart enough!";
        boxes.push({x:157, y:164, width:23, height:63, mode:0});
        boxes.push({x:244, y:133, width:23, height:93, mode:0});
        boxes.push({x:333, y:100, width:20, height:124, mode:0});
        boxes.push({x:381, y:31, width:187, height:9, mode:0});
        boxes.push({x:355, y:218, width:212, height:13, mode:1});
        boxes.push({x:269, y:218, width:64, height:13, mode:1});
        boxes.push({x:182, y:220, width:63, height:11, mode:1});
        boxes.push({x:490, y:186, width:35, height:14, mode:0});
        boxes.push({x:361, y:65, width:15, height:11, mode:0});
        boxes.push({x:380, y:2, width:9, height:38, mode:0});
    } else if (level == 15) {
        levelTxt = "You'll get hurt...";
        boxes.push({x:140, y:153, width:14, height:67, mode:1});
        boxes.push({x:184, y:172, width:12, height:48, mode:1});
        boxes.push({x:228, y:151, width:13, height:69, mode:1});
        boxes.push({x:267, y:169, width:11, height:51, mode:1});
        boxes.push({x:305, y:150, width:12, height:71, mode:1});
        boxes.push({x:346, y:218, width:144, height:12, mode:1});
    } else if (level == 16) {
        levelTxt = "I'm just worried about you. That's all...";
        boxes.push({x:119, y:183, width:21, height:45, mode:0});
        boxes.push({x:198, y:163, width:22, height:65, mode:0});
        boxes.push({x:279, y:135, width:6, height:7, mode:0});
        boxes.push({x:355, y:172, width:7, height:9, mode:0});
        boxes.push({x:417, y:87, width:8, height:8, mode:0});
        boxes.push({x:482, y:168, width:7, height:8, mode:0});
        boxes.push({x:520, y:40, width:10, height:9, mode:0});
        boxes.push({x:554, y:88, width:14, height:188, mode:0});
        boxes.push({x:220, y:216, width:334, height:19, mode:1});
        boxes.push({x:140, y:217, width:58, height:20, mode:1});
    } else if (level == 17) {
        levelTxt = "You should leave. Now.";
        boxes.push({x:166, y:155, width:12, height:65, mode:1});
        boxes.push({x:207, y:156, width:11, height:64, mode:1});
        boxes.push({x:246, y:161, width:10, height:59, mode:1});
        boxes.push({x:285, y:173, width:7, height:47, mode:1});
        boxes.push({x:320, y:166, width:10, height:54, mode:1});
        boxes.push({x:355, y:148, width:9, height:72, mode:1});
    } else if (level == 18) {
        levelTxt = "What you can't see can't hurt you, right?";
        boxes.push({x:57, y:198, width:2, height:2, mode:1});
        boxes.push({x:68, y:207, width:3, height:2, mode:1});
        boxes.push({x:67, y:162, width:2, height:3, mode:1});
        boxes.push({x:83, y:184, width:2, height:2, mode:1});
        boxes.push({x:81, y:119, width:3, height:3, mode:1});
        boxes.push({x:111, y:188, width:1, height:2, mode:1});
        boxes.push({x:115, y:152, width:2, height:2, mode:1});
        boxes.push({x:123, y:86, width:3, height:2, mode:1});
        boxes.push({x:136, y:205, width:2, height:2, mode:1});
        boxes.push({x:151, y:174, width:24, height:3, mode:1});
        boxes.push({x:161, y:127, width:3, height:4, mode:0});
        boxes.push({x:241, y:179, width:3, height:4, mode:0});
        boxes.push({x:314, y:142, width:3, height:3, mode:0});
        boxes.push({x:200, y:200, width:85, height:2, mode:1});
        boxes.push({x:206, y:134, width:4, height:3, mode:1});
        boxes.push({x:187, y:100, width:4, height:5, mode:1});
        boxes.push({x:261, y:136, width:3, height:2, mode:1});
        boxes.push({x:337, y:183, width:2, height:4, mode:1});
        boxes.push({x:343, y:105, width:3, height:56, mode:1});
        boxes.push({x:337, y:48, width:13, height:2, mode:0});
        boxes.push({x:288, y:36, width:21, height:28, mode:1});
        boxes.push({x:359, y:213, width:4, height:4, mode:1});
        boxes.push({x:535, y:218, width:33, height:2, mode:1});
        boxes.push({x:373, y:84, width:9, height:4, mode:1});
        boxes.push({x:378, y:177, width:6, height:6, mode:1});
        boxes.push({x:412, y:215, width:7, height:5, mode:1});
        boxes.push({x:420, y:178, width:4, height:2, mode:1});
        boxes.push({x:440, y:214, width:3, height:2, mode:1});
        boxes.push({x:457, y:192, width:5, height:3, mode:1});
        boxes.push({x:392, y:122, width:14, height:2, mode:0});
        boxes.push({x:230, y:86, width:4, height:3, mode:1});
        boxes.push({x:155, y:160, width:2, height:3, mode:0});
        boxes.push({x:448, y:51, width:5, height:4, mode:0});
        boxes.push({x:408, y:32, width:4, height:5, mode:1});
        boxes.push({x:439, y:98, width:3, height:2, mode:1});
        boxes.push({x:488, y:198, width:3, height:22, mode:1});
        boxes.push({x:446, y:138, width:11, height:4, mode:1});
        boxes.push({x:495, y:27, width:4, height:3, mode:1});
        boxes.push({x:498, y:89, width:5, height:4, mode:1});
        boxes.push({x:516, y:142, width:4, height:4, mode:1});
    }
    else {
        mode    = MODE_BEGIN;
	level   = 0;
	touches = [];
    }
}

function cmap(mode) {
    if (mode === 0) {
        return groundColor;
    } else if (mode === 1) {
        return deathColor;
    } else if (mode === 2) {
        return bounceColor;
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
    drawLog();

    if ((debug === true) && (touches.length > 0)) {
        var tmpY = 40;
        for (var i = 0; i < touches.length; i++) {
            doText('(' + touches[i].pageX + ',' + touches[i].pageY + ')', 480, tmpY, 'red', '8pt EuphemiaUCAS', 'bottom', 'left');
            tmpY += 20;
        }
    }

    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
	bcolor = cmap(boxes[i].mode);
        doRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height, bcolor, 0.1, bcolor);
        var dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping  = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping  = false;
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
        
        var oX = hWidths  - Math.abs(vX);
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

function drawBackground() {
    // deep sky blue
    //doCircle(WINDOW_WIDTH, WINDOW_WIDTH, 20, 'yellow', 'yellow');
    doRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, backgroundColor, 0, '');
}

var blinkCnt = 100;

function drawPlayer() {
    // body
    doRect(player.x, player.y, player.width, player.height, playerColor, 0, '');

    // EYES
    if (blinkCnt < 10) {
	blinkCnt--;
	if (blinkCnt === 0) {
	    blinkCnt = 100;
	}
	// closed eyes
	doRect(player.x + player.width/2.0 - 3.5 - 3, player.y + 2, 6, 6, playerColor, 0.5, 'black');
	doRect(player.x + player.width/2.0 + 3.5 - 3, player.y + 2, 6, 6, playerColor, 0.5, 'black');
    } else {
	blinkCnt--;

	// open eyes
	doRect(player.x + player.width/2.0 - 3.5 - 3, player.y + 2, 6, 6, playerEyeWhites, 0.5, 'black');
	doRect(player.x + player.width/2.0 + 3.5 - 3, player.y + 2, 6, 6, playerEyeWhites, 0.5, 'black');

	// pupils
	var dx = 0;
	if (moveRight === true) {
	    dx = 1;
	} else if (moveLeft === true) {
	    dx = -1;
	}
	doRect(player.x + player.width/2.0 - 3.5 - 1 + dx, player.y + 4, 2, 2, playerEyePupil, 0, '');
	doRect(player.x + player.width/2.0 + 3.5 - 1 + dx, player.y + 4, 2, 2, playerEyePupil, 0, '');
    }

    // mouth while jumping
    if (player.jumping === true) {
	doRect(player.x + 6, player.y + 11, 4, 4,  'black', 0, '');
    } else {
	doRect(player.x + 5,  player.y + 13, 6, 1, 'black', 0, '');
	doRect(player.x + 5,  player.y + 11, 1, 2, 'black', 0, '');
	doRect(player.x + 10, player.y + 11, 1, 2, 'black', 0, '');
    }

    return;
}

function drawControls() {
    var bTop        = WINDOW_HEIGHT/1.2 - 30;
    var bBottom     = WINDOW_HEIGHT/1.2 + 30;
    var bWidth      = 60;

    // LEFT BUTTON
    buttonLeft.top    = bTop;
    buttonLeft.bottom = bBottom;
    buttonLeft.left   = 20;
    buttonLeft.right  = 100;
    
    bColor = buttonColor;
    if (moveLeft === true) {
	bColor = buttonPressedColor;
    }
    
    doRect(buttonLeft.left, buttonLeft.top, buttonLeft.right - buttonLeft.left, buttonLeft.bottom - buttonLeft.top, bColor, 0, '');
    doText('<', (buttonLeft.left + buttonLeft.right)/2.0, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');

    // RIGHT BUTTON
    buttonRight.top    = bTop;
    buttonRight.bottom = bBottom;
    buttonRight.left   = 140;
    buttonRight.right  = 220;
    
    bColor = buttonColor;
    if (moveRight === true) {
	bColor = buttonPressedColor;
    }
    
    doRect(buttonRight.left, buttonRight.top, buttonRight.right - buttonRight.left, buttonRight.bottom - buttonRight.top, bColor, 0, '');
    doText('>', (buttonRight.left + buttonRight.right)/2.0, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');

    // UP BUTTON
    buttonUp.top    = bTop;
    buttonUp.bottom = bBottom;
    buttonUp.left   = 2.0*WINDOW_WIDTH/3.0 + WINDOW_WIDTH/6.0 - bWidth/2.0;
    buttonUp.right  = 2.0*WINDOW_WIDTH/3.0 + WINDOW_WIDTH/6.0 + bWidth/2.0;

    var bColor = buttonColor;
    if (moveUp === true) {
	bColor = buttonPressedColor;
    }
    
    doRect(buttonUp.left, buttonUp.top, buttonUp.right - buttonUp.left, buttonUp.bottom - buttonUp.top, bColor, 0, '');
    doText('^', (buttonUp.left + buttonUp.right)/2.0, WINDOW_HEIGHT/1.2, 'black', '10pt EuphemiaUCAS', 'middle', 'center');

}

function checkLevelComplete() {
    if (player.x > WINDOW_WIDTH - 1) {
        level++;
        makeLevel();
    }
}

function keyInit() {
    for (var i = 0; i < KEY_MAX; i++) {
	keys[i] = false;
    }
}

function keyDown(e) {
    // log('key ' + e.keyCode);

    if (mode === MODE_PLAY) {
	keys[e.keyCode] = true;
	keyCheck();
    } else if (mode === MODE_BEGIN) {
	if (e.keyCode === KEY_SPACEBAR) {
	    initGame();
	}
    } else if (mode === MODE_END) {
	if (e.keyCode === KEY_SPACEBAR) {
	    mode = MODE_BEGIN;
	}
    }
}	

function keyUp(e) {
    keys[e.keyCode] = false;
    keyCheck();
}	

function keyCheck() {
    moveLeft  = false;
    moveRight = false;
    moveUp    = false;
    if (keys[KEY_LEFTARROW] === true) {
	moveLeft   = true;
    }
    if (keys[KEY_RIGHTARROW] === true) {
	moveRight  = true;
    }
    if (keys[KEY_UPARROW] === true) {
	moveUp     = true;
    }
}



function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < touches.length; i++) {
        var id = touches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1;
}

function doTouchStart(event) {
    event.preventDefault();
    var touchlist = event.changedTouches;

    //log('add ' + touchlist.length);

    for (var i = 0; i < touchlist.length; i++) {
	if (mode === MODE_PLAY) {
            touches.push(copyTouch(touchlist[i]));
	    // log('  -> ' + i + ',' + touchlist[i].identifier);
	    doPlayPress(touchlist[i].pageX, touchlist[i].pageY, true);
	} else {
	    doButtonPress(touchlist[i].pageX, touchlist[i].pageY);
	}
    }
    counter++;
}

function doTouchEnd(event) {
    event.preventDefault();

    if ((touches.length > 0) && (mode !== MODE_PLAY)) {
	log('PROBLEM');
    }

    if (mode !== MODE_PLAY) {
	return;
    }

    var touchlist = event.changedTouches;
    // log('remove ' + touchlist.length);
    
    for (var i = 0; i < touchlist.length; i++) {
        var idx = ongoingTouchIndexById(touchlist[i].identifier);
	// log('  -> ' + touchlist[i].identifier + '--> ' + idx);
        
        if (idx >= 0) {
	    doPlayPress(touches[idx].pageX, touches[idx].pageY, false); 
            touches.splice(idx, 1);
            delCounter++;
        }
    }
    endCounter++;
}

function doButtonPress(ex, ey) {
    // x,y switched on purpose, to translate to actual x,y of screen
    var mouseX = ey;                 // event.pageY;
    var mouseY = WINDOW_HEIGHT - ex; // event.pageX;
    
    if (mode === MODE_BEGIN){
	log(mouseX + ',' + mouseY);
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
    } 
}

function doPlayPress(ex, ey, value) {
    // x,y switched on purpose, to translate to actual x,y of screen
    var mouseX = ey;                 // event.pageY;
    var mouseY = WINDOW_HEIGHT - ex; // event.pageX;

    log('play press ' + value + ', mouse:' + mouseX + ',' + mouseY + ' -- button:' + buttonUp.left + ',' + buttonUp.bottom);
    if (mode === MODE_PLAY) {
	var midLeftRight = buttonLeft.right  + (buttonRight.left - buttonLeft.right)/2.0;
	var midRightUp   = buttonRight.right + (buttonUp.left    - buttonRight.right)/2.0;
	if (mouseX < midLeftRight) {
            moveLeft = value;
        }
	if ((mouseX > midLeftRight) && (mouseX < midRightUp)) {
            moveRight = value;
        }
	if (mouseX > midRightUp) {
            moveUp = value;
        }
    }
}

function doCircle(x, y, radius, fillColor, strokeColor) {
    ctx.save();
    if (onPhone === true) {
	ctx.translate(320, 0);
	ctx.rotate(Math.PI / 2.0);
    }
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeWidth = 0.5;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.restore();
}

function doRect(x, y, w, h, color, lineWidth, lineColor) {
    ctx.save();
    if (onPhone === true) {
	ctx.translate(320, 0);
	ctx.rotate(Math.PI / 2.0);
    }
    if (lineWidth > 0) {
	ctx.lineWidth   = lineWidth;
	ctx.strokeStyle = lineColor;
	ctx.strokeRect(x, y, w, h);
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}

function doText(str, x, y, color, font, baseline, align) {
    ctx.save();
    if (onPhone === true) {
	ctx.translate(320, 0);
	ctx.rotate(Math.PI / 2.0);
    }
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
