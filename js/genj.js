import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";
import { problems } from "./problems.js";
import { loseMessages  } from "./loseMessages.js";

var genjEl = document.querySelector(".genj");
const JUMP_SPEED= 0.45;
const GRAVITY = 0.0015;
const GENJ_FRAME_COUNT  =2;
const FRAME_TIME= 100;
var isJumping;
var currentFrameTime;
var genjFrame;
var yVelocity;
export function setupGenj(){
    isJumping=false;
    genjFrame = 0;
    currentFrameTime=0;
    yVelocity=0;
    setCustomProperty(genjEl,"--buttom",0);
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
    document.addEventListener("touchstart", onJump);

}

export function  updateGenj(delta,speedScale){
    handeRun(delta,speedScale);
    handleJump(delta);
}

function handeRun(delta,speedScale) {
    if(isJumping){
        genjEl.src = "img/genj-stationary.png";
        return
    }
    if(currentFrameTime>=FRAME_TIME){
        genjFrame = (genjFrame+1) % GENJ_FRAME_COUNT;
        genjEl.src =  `img/genj-run-${genjFrame}.gif`;
        currentFrameTime-=FRAME_TIME;
    }
    currentFrameTime += delta*speedScale;
}
function handleJump(delta) {
    if(!isJumping) return;

    incrementCustomProperty(genjEl,"--bottom",yVelocity*delta);
    if(getCustomProperty(genjEl,"--bottom")<=0){
        setCustomProperty(genjEl,"--bottom",0);
        isJumping=false;
    }
    yVelocity-=GRAVITY*delta;
}

function onJump(e){
    if(e.code==="Space" || isJumping  || e.touches.length>0){
        yVelocity = JUMP_SPEED;
        isJumping=true;
        updateProblem();
    }else{
        return;
    }
}

export function  getGenjRect() {
   return genjEl.getBoundingClientRect();
}
export function setGenjLose() {
    genjEl.src = "img/genj-lose.png";
    document.querySelector('.start-screen').textContent = getLooseMessage();
}
export function  updateProblem() {
    document.querySelector("#problem").textContent=getRandomLabel();
}
function getRandomLabel() { 
    return  problems[Math.floor(Math.random()*problems.length)];
}

function getLooseMessage(){
    let score = parseInt(document.querySelector('#score').textContent);
    let msg ="";
    for (const [key, value] of Object.entries(loseMessages)) {
         if(key>score){
              msg = value;
         break;
         }
      }
    return msg+"  Tekrar denemek için bir tuşa bas ";
}