// Declaring variables for game settings
let radius = 100; // Circle radius for hit detection
let timer = 20; // Countdown timer for the game
let interval = 60; // Interval for game events in frames
let score = 0; // Player score
let ammo = 8; // Amount of ammunition a player starts with
let gameOver = false; // Boolean flag to check if the game is over
let bg; // Variable to hold the current background image
let bg1; // Variable to hold the first background image
let bg2; // Variable to hold the second background image
let xPos = []; // Array to hold x positions of targets
let yPos = []; // Array to hold y positions of targets
let counter = 0; // Counter for indexing through target positions
let images = []; // Array to hold images of enemies and one hostage
let gameWon = false; // Boolean flag to check if the game has been won
let gameFinished = false; // Boolean flag to check if the game has been completely finished
let level = 1; // Variable to track the current game level
let gunshot; // Variable to hold the gunshot sound
let painSound; // Variable to hold the pain sound
let ambienceSound; // Variable to hold the ambient background sound
let reloadSound; // Variable to hold the reload sound
let hostageSound; // Variable to hold the hostage sound
let gameFinishedSound; // Variable to hold the game finished sound
let gameFinishedPlayed = false; // Bolean flag to track if gamefinishedSound has been played
let gameoverSound; // Variable to hold the game over sound
let gameOverPlayed = false; // Bolean flag to track if gameOverPlayed has been played
let enemiesdefeatedSound; // Variable to hold the enemies defeated sound
let enemiesDefeatedPlayed = false; // Bolean flag to track if enemiesDefeatedPlayed has been played

// Preload function to load media before the game starts
function preload() {
  images = [loadImage('assets/bad_guy.png'), loadImage('assets/bad_guy_two.png'), loadImage('assets/bad_guy_three.png'), loadImage('assets/bad_guy_four.png'), loadImage('assets/hostage_one.png')]; // Load enemy and hostage images
  bg1 = loadImage('assets/background_one.png'); // Load first background image
  bg2 = loadImage('assets/background_two.jpg'); // Load second background image
  crosshair = loadImage('assets/crosshair.png');
  ambienceSound = loadSound('assets/ambience.wav'); // Load ambient sound
}

// Setup function to initialize the game environment
function setup() {
  let canvas = createCanvas(1000, 600); // declares variable canvas and sets the canvas size for the game
  canvas.parent('canvas-frame'); // gives canvas the parent canvas-frame HTML div to allow the canvas to be centred in css
  
  bg = bg1; // Initialize background with the first image
  background(bg); // Display the initial background
  
  xPos = ['710', '792', '435', '670', '500']; // Set initial x positions of targets
  yPos = ['340', '288', '305', '310', '350']; // Set initial y positions of targets

  gunshot = loadSound('assets/gun_shot.wav'); // Load the gunshot sound
  painSound = loadSound('assets/pain.wav'); // Load the pain sound
  reloadSound = loadSound('assets/reload.wav'); // Load the reload sound
  hostageSound = loadSound('assets/hostage_sound.wav'); // Load the hostage sound
  gameFinishedSound = loadSound('assets/gamewon_sound.wav'); // Load the game won sound
  gameoverSound = loadSound('assets/gameover_sound.wav'); // Load the game over sound
  enemiesdefeatedSound = loadSound('assets/enemiesdefeated_sound.wav'); // Load the enemies defeated sound
  ambienceSound.play(); // Play the ambient background sound continuously
}

// Draw function to continuously execute game logic
function draw() {
  cursor(CROSS); // Change the cursor to a crosshair
  
  textSize(36); // Set text size for the info text
  textAlign(LEFT, CENTER); // Align text to the left for the info elements
  fill(255); // Set text colour to white
  stroke(0); // Set text outline colour to black
  text("Score: " + score, 100, 30); // Display the current score
  text("Countdown: " + timer, 400, 30); // Display the countdown timer
  text("Ammo: " + ammo, 200, 550); // Display the remaining ammo

  // handle what happens when the player runs out of ammo
  if (ammo == 0) {
    textSize(50); // text size for the reload message
    textAlign(CENTER, CENTER); // Center the reload message
    fill(100, 0, 0); // Set the text colour to  red
    text("Press 'R' to Reload!", width / 2, height / 2); // Display the reload message
  }

  // Handle key presses for reloading and game progression
  if (keyIsPressed && !gameOver && !gameFinished) {
    if (key === 'R' || key === 'r') {
      if (ammo == 0) {
        ammo = 8; // if ammo is 0 and 'r' key is press reloads the ammo to full
        reloadSound.play(); // Play reload sound effect
        console.log("Reloaded!"); // Log reloading action to check if it's working
      }
    }
  }

  // Handle game level progression
  if (keyIsPressed && gameWon && !gameFinished) { // checks if key is pressed and round was won but game is not finished
    if (keyCode == ENTER) {
      console.log('ENTER PRESSED'); // Log the pressing of ENTER key to check if working
      level++; // game level increases by 1
      if (level == 2) {
        bg = bg2; // changes the background to the second image for level 2
      }

      timer = 15; // Resets timer for the new level to 15 seconds down from 20
      score = 0; // Resets score for the new level
      gameWon = false; // Resets gameWon bolean flag
    }
  }

  // Handle game restart on game over
  if (keyIsPressed && gameOver) {
    if (keyCode == ENTER) {
      gameOver = false; // Resets gameOver bolean flag
      timer = 20; // Resets timer
      score = 0; // Resets score
    }
  }

  // Adjust settings for level 2
  if (level == 2) {
    bg = bg2; // Ensures the background for level 2 is set
    xPos = ['700', '100', '425', '300', '500']; // Adjust x positions for level 2
    yPos = ['212', '500', '228', '250', '350']; // Adjust y positions for level 2
  }

  // Main game loop for handling the spawning and timing of targets
  if (frameCount % interval == 0 && !gameOver && !gameWon) {
    timer--; // decrease the timer every interval by 1
    counter = floor(random(0, images.length)); // Select a random target, floor for closest integer value
    background(bg); // refreshes the background
    image(images[counter], xPos[counter], yPos[counter]); // Draw the selected target at the calculated position
  
    // Game over screen
  } else if (frameCount % interval == 0 && gameOver) {
    textSize(100); // Set text size for "GAME OVER" message
    textAlign(CENTER, CENTER); // Center the "GAME OVER" text
    fill(100, 0, 0); // Set the text colour to red
    text("GAME OVER", width / 2, height / 2); // Display "GAME OVER" message
    textSize(50); // Set text size for restart instruction
    text("Press Enter to Restart", 500, 375); // Display restart instruction
  
    //Round won screen
  } else if (frameCount % interval == 0 && gameWon && !gameFinished) {
    textSize(100) // Set text size for "Enemies Defeated" message
    textAlign(CENTER, CENTER); // Center the "Enemies Defeated" text
    fill(0, 100, 0); // Set the text colour to green
    text("Enemies Defeated", width / 2, height / 2); // Display "Enemies Defeated" message
    textSize(50) // Set text size for progression instruction
    text('Press Enter to Proceed', 500, 375); // Display progression instruction
  
    //Game finished screen
  } else if (frameCount % interval == 0 && gameFinished) {
    textSize(100) // Set text size for "Compound Secured" message
    textAlign(CENTER, CENTER); // Center the "Compound Secured" text
    fill(0, 100, 0); // Sets the text colour to green
    text("Compound Secured", width / 2, height / 2); // Display "Compound Secured" message
    textSize(50) // Sets text size for congratulatory message
    text('Good Job Soldier!', 500, 375); // Display congratulatory message
    ambienceSound.stop(); // Stops the ambient sound playing when game is finished

  }

  // Handle game over condition based on timer
  if (timer == 0) {
    gameOver = true; // Set gameOver to true when the timer reaches zero and the score is not 10
    if (!gameOverPlayed) { // checks if gameOverPlayed is false 
      gameoverSound.play(); // plays gameoverSound
      gameOverPlayed = true; // changes gameOverPlayed bolean flag to true to end loop
    }
  }

  // Check win condition based on score
  if (score >= 10) {
    gameWon = true; // Set gameWon to true when the score is 10 or more
      if (!enemiesDefeatedPlayed) { // checks if enemiesDefeatedPlayed is false 
        enemiesdefeatedSound.play(); // if it is false it plays the enemies defeated sound
        enemiesDefeatedPlayed = true; // changes the bolean flag to true to end the loop
      }
    if (level == 2) {
      gameFinished = true; // Set gameFinished to true when level 2 is completed, so that the level doesn't restart when you press enter
      if (!gameFinishedPlayed) { // checks if gamefinishedplayed is false
        gameFinishedSound.play(); // if it is false it plays the game finished sound
        gameFinishedPlayed = true; // changes gamefinishedplayed to true to end the loop
      }
    }
  }
}

// MousePressed function to handle shooting logic
function mousePressed() {
  if (ammo > 0 && !gameOver) { // Check if there is ammo and game is not over if ammo is 0 then mousepressed funtion will not do anything.
    ammo--; // lose 1 bullet on each shot
    let d = dist(mouseX, mouseY, xPos[counter], yPos[counter]); // Calculate distance from mouse click to the target
    gunshot.play(); // Play gunshot sound

    if (d < radius) { // Check if the shot is within the hit radius
      if (counter == images.length - 1) { // Check if the last target (hostage) is hit
        score--; // Penalize by decreasing score
        hostageSound.play(); // Plays hostage sound if hostage target is shot
      } else {
        painSound.play(); // Play pain sound on a successful hit
        score++; // increase score by 1 for a successful hit
      }
    }
    counter++; // increase target counter
  }
}
