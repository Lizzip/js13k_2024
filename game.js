'use strict';

// Level Postitions
const levelSize = vec2(800, 600);  // size of play area
const center = levelSize.scale(.5);
let scale = 32;

// Objects
let jb, muteButton;

// Colours
// (100/255) * rgb_value
// https://coolors.co/ for themes
// https://www.rgbtohex.net/hex-to-rgb/ for conversion
let dark = new Color(.121,.133,.196); //rgb(31,34,50)
let med = new Color(.349,.392,.458); //rgb(89,100,117)
let light = new Color(.741,.733,.858); //rgb(189,187,713)
let white = new Color(1,1,1);

// Game state management
const states = {
    INTRO: 1,
    MAIN: 2, 
    END: 3  
};
let gameState = states.INTRO;
let gameMuted = false;

// Audio
const active_sounds = [
    new Sound([,,691,.02,,.15,1,1.9,,-8,-50,,,,,,,.57,.03,,-958]),
    new Sound([,,691,.02,,.15,1,1.9,,-8,,,,,,,,.57,.03,,-958]),
    new Sound([,,691,.02,,.15,1,1.9,,-8,50,,,,,,,.57,.03,,-958]),
    new Sound([,,691,.02,,.15,1,1.9,,-8,100,,,,,,,.57,.03,,-958])
];

// [active_sounds[index], ticks_to_wait]
const tune_1 = [
    [0,0.2],[1,0.1],[2,0.2],[3,0.1],[3,0.2],[2,0.1],[0,0.2],[0,0.1],[1,0.2]
];
const tune_2 = [
    [0,0.1],[0,0.1],[0,0.2],[0,0.2],[0,0.2],[2,0.1],[2,0.05],[2,0.1]
];

function restart(){
    // Set the camera position
    cameraPos = center;
    setCameraScale(scale);

}

function introScreen(){
    // Set the camera position
    cameraPos = center;
    setCameraScale(scale);

    // Create mute button
    muteButton = new UIElement(vec2(), 0, vec2(7,-7), 1, states.INTRO, () => {
        muteButton.tileIndex = (muteButton.tileIndex == 0) ? muteButton.tileIndex = 1 : muteButton.tileIndex = 0;
        gameMuted = (muteButton.tileIndex == 0) ? false : true;
        muteButton.hitsLeft = 1;
        muteButton.tileInfo = tile(muteButton.tileIndex);
    });
    
}

function gameInit()
{
    // Set the game size
    setCanvasMaxSize(levelSize);

    // Create Jukebox
    jb = new JukeBox();

    //Create intro screen
    introScreen();
}

function gameUpdate()
{
    // Start game on mouse click
    if(gameState == states.INTRO){
        if(mouseWasPressed(0)){
           gameState = states.MAIN;
           restart();
           jb.play(tune_1);

           //muteButton.hit(); // TODO: Shoot this instead of click
        }
    }
    
    if(gameState == states.MAIN){

    }

    if(gameState == states.END){
        if(mouseIsDown(0)){
            gameState = states.INTRO;
        }
    }
}

function gameUpdatePost()
{

}

function gameRender()
{
    // Draw background
    drawRect(cameraPos, levelSize, dark);
}

function gameRenderPost()
{
    if(gameState == states.INTRO){
        drawTextScreen('Game Intro', center, 80, light);
        drawTextScreen('Click on the <ui element> to start game...', vec2(center.x,center.y + 64), 28, light);
    }

    if(gameState == states.END){
        drawTextScreen('Game Over', center, 80, light);
        drawTextScreen('Click on the <ui element> to restart...', vec2(center.x,center.y + 64), 36, light);
    }
}


engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);