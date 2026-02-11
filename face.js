const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const resultBox = document.getElementById("resultBox");
const matchImg = document.getElementById("matchImg");
const matchName = document.getElementById("matchName");

let studentLandmarks = null;

// ---------------- FaceMesh ----------------
const faceMesh = new FaceMesh({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

// ---------------- Start Camera ----------------
async function startCamera() {

  const stream =
    await navigator.mediaDevices.getUserMedia({ video: true });

  video.srcObject = stream;

  video.addEventListener("loadeddata", async () => {

    async function detectLoop() {
      await faceMesh.send({ image: video });
      requestAnimationFrame(detectLoop);
    }

    detectLoop();
  });
}

startCamera();

// ---------------- Face Detection ----------------
faceMesh.onResults(results => {
  if (results.multiFaceLandmarks?.length) {
    studentLandmarks = results.multiFaceLandmarks[0];
  }
});

// ---------------- Utility ----------------
function dist(a,b){
  return Math.hypot(a.x-b.x,a.y-b.y);
}

function extractFeatures(lm){

  const faceWidth = dist(lm[234], lm[454]);
  const faceHeight = dist(lm[10], lm[152]);
  const jawWidth = dist(lm[172], lm[397]);
  const eyeDistance = dist(lm[33], lm[263]);
  const noseWidth = dist(lm[129], lm[358]);
  const mouthWidth = dist(lm[61], lm[291]);
  const lipHeight = dist(lm[13], lm[14]);

  return [
    faceWidth/faceHeight,
    jawWidth/faceWidth,
    eyeDistance/faceWidth,
    noseWidth/faceWidth,
    mouthWidth/faceWidth,
    lipHeight/faceHeight
  ];
}

// ---------------- Player Signatures ----------------
const profiles = [
  {name:"virat", img:"face-images/virat.png", f:[0.78,0.72,0.36,0.23,0.32,0.06]},
  {name:"sachin", img:"face-images/sachin.png", f:[0.82,0.76,0.38,0.25,0.34,0.07]},
  {name:"rohit", img:"face-images/rohit.png", f:[0.88,0.82,0.34,0.27,0.35,0.07]},
  {name:"dhoni", img:"face-images/dhoni.png", f:[0.80,0.74,0.35,0.24,0.33,0.06]},
  {name:"rahul", img:"face-images/rahul.png", f:[0.77,0.71,0.36,0.23,0.32,0.06]},
  {name:"shreyas", img:"face-images/shreyas.png", f:[0.76,0.70,0.37,0.24,0.31,0.06]},
  {name:"sanju", img:"face-images/sanju.png", f:[0.79,0.73,0.35,0.24,0.33,0.06]},
  {name:"ishan", img:"face-images/ishan.png", f:[0.83,0.78,0.34,0.26,0.34,0.07]},
  {name:"gill", img:"face-images/gill.png", f:[0.75,0.69,0.38,0.22,0.31,0.06]},
  {name:"jaiswal", img:"face-images/jaiswal.png", f:[0.74,0.68,0.39,0.22,0.30,0.06]},
  {name:"abhishek", img:"face-images/abhishek.png", f:[0.84,0.79,0.33,0.27,0.35,0.07]},
  {name:"rinku", img:"face-images/rinku.png", f:[0.86,0.81,0.32,0.27,0.35,0.07]},
  {name:"hardik", img:"face-images/hardik.png", f:[0.78,0.71,0.37,0.23,0.32,0.06]},
  {name:"axar", img:"face-images/axar.png", f:[0.87,0.83,0.33,0.27,0.36,0.07]},
  {name:"jadeja", img:"face-images/jadeja.png", f:[0.81,0.75,0.35,0.24,0.33,0.06]},
  {name:"dube", img:"face-images/dube.png", f:[0.89,0.85,0.31,0.28,0.36,0.07]},
  {name:"bumrah", img:"face-images/bumrah.png", f:[0.72,0.66,0.40,0.21,0.30,0.06]},
  {name:"siraj", img:"face-images/siraj.png", f:[0.74,0.67,0.39,0.22,0.30,0.06]},
  {name:"shami", img:"face-images/shami.png", f:[0.76,0.70,0.37,0.23,0.31,0.06]},
  {name:"kuldeep", img:"face-images/kuldeep.png", f:[0.83,0.78,0.34,0.26,0.34,0.07]},
  {name:"arshdeep", img:"face-images/arshdeep.png", f:[0.71,0.65,0.41,0.21,0.29,0.06]}
];

// ---------------- Matching ----------------
function matchFace(studentFeatures){

  let best=null;
  let minScore=Infinity;

  profiles.forEach(p=>{
    let diff=0;
    for(let i=0;i<p.f.length;i++){
      diff+=Math.abs(studentFeatures[i]-p.f[i]);
    }
    if(diff<minScore){
      minScore=diff;
      best=p;
    }
  });

  const confidence=Math.max(65,Math.floor(100-minScore*120));
  return {...best,confidence};
}

// ---------------- Capture ----------------
captureBtn.onclick=()=>{

  if(!studentLandmarks){
    alert("Face not detected. Face camera directly.");
    return;
  }

  const studentFeatures=extractFeatures(studentLandmarks);
  const result=matchFace(studentFeatures);

  matchImg.src=result.img;
  matchName.innerText=
    `${result.name.toUpperCase()} (${result.confidence}% similarity)`;

  resultBox.style.display="block";
};

function goBack(){
  window.location.href="3.html";
}
