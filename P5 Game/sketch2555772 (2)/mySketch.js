let canvas;
let img;
let x, y;
let message = "";      // Global variable to hold messages
let score = 0;         // Global score variable
let timeLeft = 70;     // Starts at 70 and decreases by 10 each interaction
let messageTimer = 0;  // Time (in millis) when message was set
let lastInteraction = false;  // Flag for the last interaction (time reached 0)
let lastInteractionTime = 0;  // Time when last interaction occurred

// Globals for handling choices:
let showChoices = false;     // Whether to display choices
let currentChoices = [];     // Array of choice objects for the clicked zone
let currentZone = null;      // ID of the clicked zone
let choiceAreas = [];        // Array storing screen areas for each displayed choice

// Set to track which zones have already been clicked
let clickedZones = new Set();

// Mapping each zone to its own list of choices (with text and points):
let zoneChoices = {
  1: [
    { text: "Search somewhere else", points: 10 },
    { text: "Try to open it", points: 0 }
  ],
  2: [
    { text: "Leave the key on the floor", points: 0 },
    { text: "Pick up the key", points: 15 }
  ],
  3: [
    { text: "Analyze the symbols", points: 5 },
    { text: "Spin the wheel", points: 10 }
  ],
  4: [
    { text: "Use the lamp for light", points: 10 },
    { text: "Touch the flame", points: 0 }
  ],
  5: [
    { text: "Put in random numbers", points: 0 },
    { text: "Pull on it really hard", points: 0 }
  ],
  6: [
    { text: "Open the left drawer", points: 0 },
    { text: "Open the right drawer", points: 10 }
  ],
  7: [
    { text: "Attempt to solve it", points: 10 },
    { text: "Leave it for someone else", points: 0 }
  ]
};

// Mapping each zone to its own prompt:
let zonePrompts = {
  1: "A locked chessboard.",
  2: "A strange looking key.",
  3: "A large wheel, with interesting symbols.",
  4: "The lamp shines with a beautiful flame.",
  5: "A locked door with a number lock on it.",
  6: "A desk with two drawers.",
  7: "On the table is a cypher full of strange characters."
};

function preload() {
  // Load the image once before the sketch starts
  img = loadImage('escape_room_1000x1000.png');
}

function setup() {
  canvas = createCanvas(1000, 1000);
  canvas.parent('canvas-container');
  // Center the canvas in the window
  x = windowWidth / 2;
  y = windowHeight / 2;
  canvas.position(x - width / 2, y - height / 2);
  
  textSize(16);
}

function draw() {
  // If the last interaction occurred and 3 seconds have passed, show end screen.
  if (lastInteraction && millis() - lastInteractionTime >= 3000) {
    displayEndScreen();
    return;
  }
  
  // Normal game ends if timeLeft is 0 but we're waiting during the pause.
  if (timeLeft <= 0 && !lastInteraction) {
    displayEndScreen();
    return;
  }
  
  background(220);
  // Draw the background image
  image(img, 0, 0);
  
  // Highlight interactive zones
  checkInteractiveZones();
  
  // Display debugging coordinates at bottom-left
  displayCoordinates();
  
  // Display score at (50,200)
  displayScore();
  
  // Display remaining time at (50,250)
  displayTime();
  
  // Display any center message
  displayMessage();
  
  // If choices are active, display them centered in the screen.
  if (showChoices) {
    displayChoices();
  }
  
  // Clear message after 5 seconds if not displaying choices and not in last interaction.
  if (message !== "" && !showChoices && !lastInteraction && millis() - messageTimer > 5000) {
    message = "";
  }
}

function displayCoordinates() {
  let coordinates = "X: " + mouseX + ", Y: " + mouseY;
  let padding = 4;
  let rectWidth = textWidth(coordinates) + 2 * padding;
  let rectHeight = 20;
  
  noStroke();
  fill(255, 200);
  rect(10 - padding, height - 10 - rectHeight, rectWidth, rectHeight);
  fill(0);
  text(coordinates, 10, height - 10);
}

function displayScore() {
  push();
  textSize(24);
  let scoreText = "Score: " + score;
  let padding = 4;
  let ta = textAscent();
  let td = textDescent();
  let rectHeight = ta + td + 2 * padding;
  let rectWidth = textWidth(scoreText) + 2 * padding;
  
  noStroke();
  fill(255, 200);
  rect(50 - padding, 200 - padding, rectWidth, rectHeight);
  fill(0);
  textAlign(LEFT, TOP);
  text(scoreText, 50, 200);
  pop();
}

function displayTime() {
  push();
  textSize(24);
  let timeText = "Time: " + timeLeft;
  let padding = 4;
  let ta = textAscent();
  let td = textDescent();
  let rectHeight = ta + td + 2 * padding;
  let rectWidth = textWidth(timeText) + 2 * padding;
  
  noStroke();
  fill(255, 200);
  rect(50 - padding, 250 - padding, rectWidth, rectHeight);
  fill(0);
  textAlign(LEFT, TOP);
  text(timeText, 50, 250);
  pop();
}

function checkInteractiveZones() {
  let interactive = false;
  // Yellow highlight for all zones
  let highlightColor = color(255, 255, 0, 100);
  
  // Zone 1: (550,750) to (800,850)
  if (mouseX > 550 && mouseX < 800 && mouseY > 750 && mouseY < 850) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(550, 750, 800 - 550, 850 - 750);
  }
  
  // Zone 2: (790,880) to (860,930)
  if (mouseX > 790 && mouseX < 860 && mouseY > 880 && mouseY < 930) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(790, 880, 860 - 790, 930 - 880);
  }
  
  // Zone 3: (675,340) to (890,545)
  if (mouseX > 675 && mouseX < 890 && mouseY > 340 && mouseY < 545) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(675, 340, 890 - 675, 545 - 340);
  }
  
  // Zone 4: (930,610) to (975,700)
  if (mouseX > 930 && mouseX < 975 && mouseY > 610 && mouseY < 700) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(930, 610, 975 - 930, 700 - 610);
  }
  
  // Zone 5: (400,550) to (430,600)
  if (mouseX > 400 && mouseX < 430 && mouseY > 550 && mouseY < 600) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(400, 550, 430 - 400, 600 - 550);
  }
  
  // Zone 6: (100,600) to (300,650)
  if (mouseX > 100 && mouseX < 300 && mouseY > 600 && mouseY < 650) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(100, 600, 300 - 100, 650 - 600);
  }
  
  // Zone 7: (150,800) to (500,1000)
  if (mouseX > 150 && mouseX < 500 && mouseY > 800 && mouseY < 1000) {
    interactive = true;
    noStroke();
    fill(highlightColor);
    rect(150, 800, 350, 200);
  }
  
  if (interactive) {
    cursor('pointer');
  } else {
    cursor('default');
  }
}

function mousePressed() {
  // Prevent any interaction if timeLeft is 0 or below.
  if (timeLeft <= 0) {
    return;
  }
  
  // If choices are currently shown, check for a click on a choice.
  if (showChoices) {
    for (let i = 0; i < choiceAreas.length; i++) {
      let area = choiceAreas[i];
      if (mouseX >= area.x && mouseX <= area.x + area.w &&
          mouseY >= area.y && mouseY <= area.y + area.h) {
        handleChoice(i);
        return;
      }
    }
  } else {
    // Clear any old message when starting a new interaction.
    message = "";
    // Determine which zone (if any) was clicked.
    let zone = getClickedZone();
    // If the zone was already clicked, display a message.
    if (zone !== null && clickedZones.has(zone)) {
      message = "You already checked that";
      messageTimer = millis();
      return;
    }
    if (zone !== null) {
      currentZone = zone;
      // Set the current choices specific to that zone.
      currentChoices = zoneChoices[zone];
      showChoices = true;
    }
  }
}

function getClickedZone() {
  if (mouseX > 550 && mouseX < 800 && mouseY > 750 && mouseY < 850) {
    return 1;
  } else if (mouseX > 790 && mouseX < 860 && mouseY > 880 && mouseY < 930) {
    return 2;
  } else if (mouseX > 675 && mouseX < 890 && mouseY > 340 && mouseY < 545) {
    return 3;
  } else if (mouseX > 930 && mouseX < 975 && mouseY > 610 && mouseY < 700) {
    return 4;
  } else if (mouseX > 400 && mouseX < 430 && mouseY > 550 && mouseY < 600) {
    return 5;
  } else if (mouseX > 100 && mouseX < 300 && mouseY > 600 && mouseY < 650) {
    return 6;
  } else if (mouseX > 150 && mouseX < 500 && mouseY > 800 && mouseY < 1000) {
    return 7;
  } else {
    return null;
  }
}

function handleChoice(choiceIndex) {
  // Process the chosen option for the current zone.
  let choice = currentChoices[choiceIndex];
  // Update the message to include the chosen option and points gained.
  message = "You chose: " + choice.text + " (gained " + choice.points + " points)";
  messageTimer = millis();
  // Update the score based on the points from this choice.
  score += choice.points;
  // Subtract 10 from timeLeft for every interaction.
  timeLeft -= 10;
  
  // Mark the current zone as clicked so it cannot be used again.
  clickedZones.add(currentZone);
  
  // If timeLeft has reached 0, mark this as the last interaction.
  if (timeLeft <= 0) {
    lastInteraction = true;
    lastInteractionTime = millis();
  }
  
  // Hide choices after selection.
  showChoices = false;
  currentChoices = [];
  choiceAreas = [];
  currentZone = null;
}

function displayChoices() {
  if (showChoices && currentChoices.length > 0) {
    choiceAreas = []; // Reset stored areas
    push();
    textSize(24);
    // For the prompt, use CENTER alignment.
    textAlign(CENTER, CENTER);
    let padding = 10;
    let gap = 10;
    let totalHeight = 0;
    let choiceHeights = [];
    let choiceWidths = [];
    // Calculate total height of choice boxes.
    for (let i = 0; i < currentChoices.length; i++) {
      let tw = textWidth(currentChoices[i].text);
      let ta = textAscent();
      let td = textDescent();
      let rectHeight = ta + td + 2 * padding;
      totalHeight += rectHeight;
      choiceHeights.push(rectHeight);
      choiceWidths.push(tw + 2 * padding);
      if (i < currentChoices.length - 1) {
        totalHeight += gap;
      }
    }
    
    // Look up the prompt for the current zone.
    let promptText = zonePrompts[currentZone] || "Select an option:";
    let promptTw = textWidth(promptText);
    let promptTa = textAscent();
    let promptTd = textDescent();
    let promptHeight = promptTa + promptTd + 2 * padding;
    
    // Total block height includes the prompt.
    let blockHeight = promptHeight + gap + totalHeight;
    
    // Calculate starting Y so that the entire block is centered.
    let startY = height / 2 - blockHeight / 2;
    
    // Draw a background rectangle behind the prompt.
    let promptX = width / 2 - promptTw / 2 - padding;
    fill(200, 200, 255, 200);  // Light blue background
    rect(promptX, startY, promptTw + 2 * padding, promptHeight, 5);
    
    // Draw the prompt text.
    fill(0);
    text(promptText, width / 2, startY + promptHeight / 2);
    
    // Adjust startY for the choice boxes.
    startY += promptHeight + gap;
    
    // Now draw the choice boxes.
    for (let i = 0; i < currentChoices.length; i++) {
      let rectHeight = choiceHeights[i];
      let rectWidth = choiceWidths[i];
      // Center each choice horizontally.
      let xPos = width / 2 - rectWidth / 2;
      let yPos = startY;
      noStroke();
      fill(200, 200, 200, 200);
      rect(xPos, yPos, rectWidth, rectHeight, 5);
      fill(0);
      textAlign(LEFT, TOP);
      text(currentChoices[i].text, xPos + padding, yPos + padding);
      choiceAreas.push({ x: xPos, y: yPos, w: rectWidth, h: rectHeight });
      startY += rectHeight + gap;
    }
    pop();
  }
}

function displayMessage() {
  if (message !== "") {
    push();
    textSize(24);
    textAlign(CENTER, CENTER);
    let padding = 10;
    let ta = textAscent();
    let td = textDescent();
    let textW = textWidth(message);
    let textH = ta + td;
    let boxWidth = textW + 2 * padding;
    let boxHeight = textH + 2 * padding;
    let centerX = width / 2;
    let centerY = height / 2;
    noStroke();
    fill(255, 200);
    rect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 10);
    fill(0);
    text(message, centerX, centerY);
    pop();
  }
}

function displayEndScreen() {
  background(0, 150);
  push();
  textSize(36);
  fill(255);
  textAlign(CENTER, CENTER);
  if (score >= 36) {
    text("Congratulations!\nYou are an escape room professional!\nFinal Score: " + score, width / 2, height / 2);
  } else {
    text("Sorry!\nYou are not very good at escape rooms.\nFinal Score: " + score, width / 2, height / 2);
  }
  pop();
}
