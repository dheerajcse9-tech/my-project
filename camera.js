const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fingerText = document.getElementById("fingerCount");
const detectBtn = document.getElementById("detectBtn");

canvas.width=320;
canvas.height=240;

let gameStarted=false;
let waitingForFist=false;
let frameBuffer=[];
let gameStopped=false;

// -------- MediaPipe --------
const hands = new Hands({
  locateFile:file=>
  `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands:3,
  modelComplexity:1,
  minDetectionConfidence:0.7,
  minTrackingConfidence:0.7
});

// -------- Select Nearest Hand --------
function selectNearestHand(handsArray){

  let maxArea=0;
  let best=0;

  handsArray.forEach((lm,i)=>{
    const xs=lm.map(p=>p.x);
    const ys=lm.map(p=>p.y);

    const area=
      (Math.max(...xs)-Math.min(...xs)) *
      (Math.max(...ys)-Math.min(...ys));

    if(area>maxArea){
      maxArea=area;
      best=i;
    }
  });

  return best;
}

// -------- Finger Count --------
function countFingers(lm){

  const thumbOpen=
    Math.abs(lm[4].x-lm[2].x)>0.06 &&
    lm[4].y<lm[3].y;

  const fingers=[[8,6],[12,10],[16,14],[20,18]];

  let open=0;

  fingers.forEach(f=>{
    if(lm[f[0]].y<lm[f[1]].y-0.02)
      open++;
  });

  if(thumbOpen && open===0) return 6;

  return open + (thumbOpen?1:0);
}

// -------- Stable Detection --------
function getStable(v){

  frameBuffer.push(v);

  if(frameBuffer.length>6)
    frameBuffer.shift();

  return frameBuffer.length===6 &&
         frameBuffer.every(x=>x===v);
}

// -------- Start Button --------
detectBtn.onclick=()=>{
  gameStarted=true;
  detectBtn.disabled=true;
  detectBtn.innerText="Game Running...";
};

// -------- Detection Loop --------
hands.onResults(results=>{

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(results.image,0,0,canvas.width,canvas.height);

  if(!results.multiHandLandmarks?.length){
    fingerText.innerText="Show Hand";
    return;
  }

  const index=
    selectNearestHand(results.multiHandLandmarks);

  const lm=
    results.multiHandLandmarks[index];

  drawConnectors(ctx,lm,HAND_CONNECTIONS,{color:"#00FF00"});
  drawLandmarks(ctx,lm,{color:"#FF0000"});

  const count=countFingers(lm);

  fingerText.innerText=`Detected: ${count}`;

  if(!gameStarted || gameStopped) return;

  if(!getStable(count)) return;

  // Fist = allow next ball
  if(count===0){
    waitingForFist=false;
    return;
  }

  // Play ball
  if(!waitingForFist){
    waitingForFist=true;
    playMove(count);
  }
});

// -------- Camera --------
const camera=new Camera(video,{
  onFrame:async()=>{
    await hands.send({image:video});
  },
  width:320,
  height:240
});
camera.start();

// -------- Stop After OUT --------
function stopGame(){
  gameStopped=true;
}
