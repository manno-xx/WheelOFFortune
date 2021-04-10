/* jshint esversion: 6 */

// size related
const baseDiameter = 300;
const baseCanvasSize = 400;
let scaleFactor = 1;

// rotation related
let currentAngle = 0;
let angularVelocity = 0;

let tweenDuration = 6;
let tweenTime = tweenDuration;

// looks
let colorBands = [];
// let modAngle;

// uses a modified version of: https://freesound.org/people/tony_bear/sounds/274007/
var sound = new Howl({
    src: ['/assets/ticktock.mp3'],
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500]
    }
  });
const samples = ['one', 'two', 'three', 'four'];

let lastItem = -1;

let data = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fiveteen",
    "sixteen",
];

function setup() {
    createCanvas(baseCanvasSize, baseCanvasSize);
    colorMode(HSB, 1, 1, 1);
    createColorBands();
}

function draw() {

    push();
    colorMode(RGB);
    background(100, 148, 237);
    pop();

    spinDisk(deltaTime / 1000);

    drawDisc();

    drawpointer();

    outputCurrentItem();

    // slowRotate();

    // fill(0);
    // text(tweenTime, 10, 10);
    // text(scaleFactor, 10, 30);
    // text(tweenTime, 10, 50);
    // text(modAngle, 10, 70);
}

/**
 * Draw the pointer at the top of the wheel that indicates the current item
 */
function drawpointer() {
    push();

    fill(0, 1, 0.7);
    stroke(255, 0, 0);

    beginShape();

    vertex(
        width * 0.5,
        height * 0.5 - baseDiameter * scaleFactor * 0.5 + 10 * scaleFactor
    );

    bezierVertex(
        width * 0.5 - 20 * scaleFactor,
        height * 0.5 - baseDiameter * scaleFactor * 0.5 - 15 * scaleFactor,
        width * 0.5 + 20 * scaleFactor,
        height * 0.5 - baseDiameter * scaleFactor * 0.5 - 15 * scaleFactor,
        width * 0.5,
        height * 0.5 - baseDiameter * scaleFactor * 0.5 + 10 * scaleFactor
    );

    endShape();

    stroke(0);
    strokeWeight(6);
    point(width * 0.5, height * 0.5 - baseDiameter * scaleFactor * 0.5 - 5 * scaleFactor);

    pop();
}

/**
 * create the colors for the disc.
 * an array as long as there are items to show on the disc
 */
function createColorBands() {
    colorBands = [];
    for (let i = 0; i < data.length; i++) {
        colorBands.push(color(random(), 0.75, 1));
    }
}

/**
 * Whenever the data changes,
 */
function recreateDiscData() {
    createColorBands();
}

function slowRotate() {
    currentAngle += TWO_PI / 2000;
}

/**
 * 
 */
function outputCurrentItem() {
    let modAngle = (currentAngle + HALF_PI) % TWO_PI;
    let itemAngle = TWO_PI / data.length;
    let item = data.length - 1 - Math.floor(modAngle / itemAngle);
    
    if(lastItem != item){
        sound.play(samples[Math.floor(Math.random() * samples.length)]);
        lastItem = item;
    }
    
    let itemName = data[item];
    
    push();
    textAlign(CENTER, CENTER);
    textSize(30 * scaleFactor);
    text(itemName, width * 0.5, 20 * scaleFactor);
    pop();
}

/**
 * spins the disk based on eased tween
 */
function spinDisk(deltaTime) {
    if (tweenTime < tweenDuration) {
        angularVelocity = easeOutCubic(tweenTime, 0.1, -0.1, tweenDuration);
        tweenTime += deltaTime;
    } else {
        tweenTime = tweenDuration;
        angularVelocity = 0;
    }

    currentAngle += angularVelocity;
}

/**
 * Draw the disc
 * colors and names
 */
function drawDisc() {
    push();
    fill(255);
    strokeWeight(3);
    circle(width * 0.5, height * 0.5, baseDiameter * scaleFactor);

    let angle = currentAngle;
    let angleStep = TWO_PI / data.length;

    for (let i = 0; i < data.length; i++) {
        const name = data[i];

        fill(colorBands[i]);
        arc(
            width * 0.5,
            height * 0.5,
            baseDiameter * scaleFactor,
            baseDiameter * scaleFactor,
            angle,
            angle + angleStep,
            PIE
        );

        push();

        fill(0);
        translate(width * 0.5, width * 0.5);
        rotate(angle + angleStep * 0.5);
        textAlign(RIGHT, CENTER);
        textStyle(BOLD);
        textSize(10 * scaleFactor);
        text(data[i], baseDiameter * scaleFactor * 0.45, 0);
        
        pop();

        angle += angleStep;
    }
    pop();
}

/**
 * round and round it goes, where it stops nobody knows
 */
function startSpinning() {
    currentAngle = random(TWO_PI);

    tweenTime = 0;
}

/**
 * Based on http://robertpenner.com/easing/
 *
 * @param {Number} t Time (0-1)
 * @param {Number} b Begin value
 * @param {Number} c Change in value
 * @param {Number} d Duration of the ease
 */
function easeOutSine(t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
}
function easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}
function easeOutCubic (t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
}
function easeOutQuart(t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
}

/**
 * calculate the scale factor after resizing the window
 */
function calcScaleFactor() {
    var mainElement = document.getElementsByTagName("main")[0];
    let width = mainElement.offsetWidth;

    scaleFactor = width / baseCanvasSize;

    resizeCanvas(width, width);
}

function init(){
    document.getElementById("menu").addEventListener("click", toggleInput);
    document.getElementById("cancel").addEventListener("click", toggleInput);
    document.getElementById("save").addEventListener("click", saveData);
    calcScaleFactor();
}

function saveData(){
    let contents = document.getElementById("data").value;
    contents = contents.trim();
    data = contents.split("\n");
    data = data.filter(item => item.trim().length > 0);
    createColorBands();
    toggleInput();
}

function toggleInput(){
    let input = document.getElementById("input");
    input.classList.toggle("hidden");
}

window.addEventListener("keydown", function (e) {

    let input = document.getElementById("input");
    if (!input.classList.contains("hidden")){
        return;
    }

    if (e.keyCode == 32) {
        startSpinning();
        e.preventDefault();
    }
});

window.addEventListener("load", function (e) {
    init();
});

window.addEventListener("resize", function (e) {
    calcScaleFactor();
});
