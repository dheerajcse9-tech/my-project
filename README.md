🏏 AI Hand Cricket

A real-time AI-powered browser game where players play Hand Cricket using hand gestures detected through a webcam. The project combines Computer Vision, Machine Learning, and Web Technologies to create an interactive cricket experience without requiring any backend server.
📖 Overview
AI Hand Cricket is a browser-based application that allows users to play cricket against an intelligent AI opponent using only their hand gestures.
Using MediaPipe Hands, the system detects hand landmarks in real time and converts finger gestures into cricket runs (1–6). A gesture of 0 fingers results in a wicket. The project also includes a Face Recognition module that identifies players and assigns them a cricket twin using facial similarity.
The complete application runs entirely in the browser with zero backend, making it lightweight, fast, and easy to deploy.

✨ Features

🎥 Real-time webcam hand tracking
✋ Gesture-based cricket gameplay
🧠 AI-powered opponent with adaptive difficulty
👤 Face Recognition using AI
🏏 Cricket Twin recommendation
📊 Live scoreboard
🏆 Leaderboard
📜 Ball-by-ball match history
💾 Local data storage using LocalStorage
⚡ Fully browser-based (No Backend Required)

🏗️ Project Workflow

1️⃣ Registration
User enters Name, Roll Number and Branch
Information is validated
Stored using LocalStorage
↓
2️⃣ Rules Page
Displays gameplay instructions
Shows registered player details
↓
3️⃣ AI Hand Cricket
Webcam starts
Hand landmarks detected
Finger count converted into runs
AI generates its move
Scores updated in real time
↓
4️⃣ Face Recognition
Detect player's face
Generate facial embeddings
Compare facial similarity
Assign Cricket Twin

🤖 Hand Gesture Recognition

The project uses Google MediaPipe Hands, which detects 21 three-dimensional hand landmarks.
Each landmark represents different joints of the hand:
Wrist
MCP
PIP
DIP
Fingertips
The gesture recognition algorithm uses:
3D Geometry
Vector Mathematics
Joint Angle Calculations
Each finger is analyzed individually to determine whether it is bent or fully extended.
The thumb uses a custom detection algorithm based on:
Distance Measurement
MCP Angle
IP Angle
✋ Gesture Mapping
Gesture	Cricket Action
✊ Fist	Wicket
☝️ One Finger	1 Run
✌️ Two Fingers	2 Runs
🤟 Three Fingers	3 Runs
🖖 Four Fingers	4 Runs
🖐️ Five Fingers	5 Runs
👍 Thumbs Up	6 Runs

🎯 Stability Buffer

To eliminate accidental gesture detection, the project implements a 10-frame Stability Buffer.
Instead of accepting every frame,
Stores previous gesture predictions
Uses majority voting
Detects only stable gestures
Prevents flickering
Reduces false positives
🤖 AI Opponent
The opponent is not random.
It follows a 3-stage adaptive strategy.
Early Game
Completely random moves
Mid Game
Frequency analysis
Learns player's commonly used gestures
Danger Zone
Pattern prediction
Uses previous move history
Attempts to counter player strategy

👤 Face Recognition

The project integrates:
face-api.js
MediaPipe Face Mesh
Pipeline:
Face Detection
↓
68 Facial Landmarks
↓
128-Dimensional Face Embeddings
↓
Euclidean Distance Matching
↓
Player Recognition
↓
Cricket Twin Assignment
MediaPipe Face Mesh also renders a 478-point facial mesh in real time.

🏏 Cricket Twin Feature

After the game, the player is matched with a Men's or Women's Cricketer using facial similarity.
The comparison is performed using:
Face Embeddings
Euclidean Distance
Similarity Score
🛠️ Tech Stack
Frontend
HTML5
CSS3
Vanilla JavaScript (ES6+)
AI & Computer Vision
Google MediaPipe Hands
MediaPipe Face Mesh
face-api.js
TensorFlow.js
WebRTC
Browser APIs
Canvas API
LocalStorage
JSON
Styling
CSS Grid
Flexbox
CSS Animations
Orbitron
Bebas Neue
📂 Project Structure
AI-Hand-Cricket/

│── index.html
│── registration.html
│── rules.html
│── game.html
│── face-recognition.html

│── css/
│── js/
│── assets/
│── models/
│── images/

│── README.md
