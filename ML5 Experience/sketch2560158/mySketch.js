/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates face tracking on live video through ml5.faceMesh.
 * Updated to create:
 *  - Lava effect that changes color when you open your mouth
 *  - A LARGE fireball that erupts from your mouth
 */

let faceMesh;
let video;
let faces = [];
let lavaParticles = []; // Lava effect storage
let flameParticles = []; // Fireball effect storage
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

// Keypoints for the eyes and mouth in faceMesh
const LEFT_EYE = 159;
const RIGHT_EYE = 386;
const UPPER_LIP = 13;
const LOWER_LIP = 14;

let lavaColor = { r: 255, g: 50, b: 0 }; // Default lava color

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    let face = faces[0];
    let keypoints = face.keypoints;

    if (keypoints.length > LOWER_LIP) {
      let leftEye = keypoints[LEFT_EYE];
      let rightEye = keypoints[RIGHT_EYE];
      let upperLip = keypoints[UPPER_LIP];
      let lowerLip = keypoints[LOWER_LIP];

      // Calculate mouth openness
      let mouthOpen = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);

      // If mouth is open, change lava color and create fireball
      if (mouthOpen > 20) { // Adjust threshold if needed
        lavaColor = {
          r: random(100, 255),
          g: random(50, 255),
          b: random(0, 255)
        };

        generateFireball((upperLip.x + lowerLip.x) / 2, (upperLip.y + lowerLip.y) / 2);
      }

      // Generate lava at the eye positions
      generateLava(leftEye.x, leftEye.y);
      generateLava(rightEye.x, rightEye.y);
    }
  }

  // Update and draw effects
  updateAndDrawLava();
  updateAndDrawFireball();
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  faces = results;
}

// Generate lava particles at x, y
function generateLava(x, y) {
  for (let i = 0; i < 3; i++) {
    lavaParticles.push({
      x: x + random(-5, 5),
      y: y,
      size: random(5, 12),
      velocity: random(1, 3),
      lifetime: 255
    });
  }
}

// Update and draw the lava particles
function updateAndDrawLava() {
  for (let i = lavaParticles.length - 1; i >= 0; i--) {
    let p = lavaParticles[i];

    // Use the dynamic lava color
    fill(lavaColor.r, lavaColor.g, lavaColor.b, p.lifetime);
    noStroke();
    ellipse(p.x, p.y, p.size);

    // Simulate lava flow
    p.y += p.velocity;
    p.size *= 0.98;
    p.lifetime -= 5;

    if (p.lifetime <= 0 || p.size < 2) {
      lavaParticles.splice(i, 1);
    }
  }
}

// Generate fireball particles at mouth position
function generateFireball(x, y) {
  for (let i = 0; i < 20; i++) { // Increased particles for a BIGGER fireball
    flameParticles.push({
      x: x + random(-15, 15), // Wider spread
      y: y,
      size: random(15, 30), // Larger initial size
      velocityY: random(-4, -8), // Shoots up faster
      velocityX: random(-2, 2), // Slight sideways flicker
      lifetime: 255,
      color: {
        r: random(200, 255),
        g: random(50, 150),
        b: random(0, 50)
      }
    });
  }
}

// Update and draw fireball particles
function updateAndDrawFireball() {
  for (let i = flameParticles.length - 1; i >= 0; i--) {
    let p = flameParticles[i];

    // Draw the fireball particles
    fill(p.color.r, p.color.g, p.color.b, p.lifetime);
    noStroke();
    ellipse(p.x, p.y, p.size);

    // Simulate fireball movement
    p.y += p.velocityY;
    p.x += p.velocityX;
    p.size *= 1.05; // Expands instead of shrinking
    p.lifetime -= 6; // Gradually fades

    // Remove old particles
    if (p.lifetime <= 0 || p.size > 80) { // Fireball grows large before fading
      flameParticles.splice(i, 1);
    }
  }
}
