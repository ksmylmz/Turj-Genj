import { setupSpike, updateSpike, getSpikeRects } from "./spike.js";
import { setupGenj, updateGenj, getGenjRect, setGenjLose } from "./genj.js";
import { setupGround, updateGround } from "./ground.js";
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = .00001;
var worldElement = document.querySelector('#world');
var scoreEl = document.querySelector('.score');
var startScreenEl = document.querySelector('.start-screen');

window.addEventListener("resize", setPixelWorldScale);
window.addEventListener("keydown", handleStart, { once: true });
setPixelWorldScale();


function setPixelWorldScale () {
    let worldPixelScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldPixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
        worldPixelScale = window.innerHeight / WORLD_HEIGHT;
    }
    worldElement.style.width = `${WORLD_WIDTH * worldPixelScale}px`
    worldElement.style.height = `${WORLD_HEIGHT * worldPixelScale}px`
}

let lastTime = null;
var speedScale = .5;
var score = 0
function update(time) {
    if (lastTime === null) { 
        lastTime = time;
        window.requestAnimationFrame(update);
    }
    let delta = time - lastTime;
    updateGround(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
    updateGenj(delta, speedScale);
    updateSpike(delta, speedScale);
    if (checkLose()) return handleLose()

    lastTime = time;
    window.requestAnimationFrame(update);
}

function handleStart() {
    lastTime = null;
    score = 0;
    speedScale=.5;
    requestAnimationFrame(update);
    setupGround();
    setupGenj();
    setupSpike();
    startScreenEl.classList.add("hide");
    window.requestAnimationFrame(update);
}
function handleLose() {
    setGenjLose();
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenEl.classList.remove("hide")
    }, 100);
}
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}
function updateScore(delta) {
    score += delta * .01;
    scoreEl.textContent = Math.floor(score);
}


//window.requestAnimationFrame(update)
//setupGround();

function checkLose() {
    const dinoRect = getGenjRect()
    return getSpikeRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    if(rect2===undefined) return false;
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}