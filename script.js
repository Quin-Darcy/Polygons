// Constants
let W = window.innerWidth;
let H = window.innerHeight;
let N = 3;
let SP = 6;
let R = 300;
let THETA = 360 / N;
let DELTA = 1;
let EPSILON = 0.01;
let K = 0;
let F = 0;
let FC = 0;
let DIST = 0;
let COUNT = 0;
let COND = 0;
let STACK = 0;
let P = Math.floor(360 / (2 * N * SP));
let D = 0;
let ANG = 0;
let MAX = 0;

// Arrays
let cirPath = [];
let anim = [];

function setup() {
    createCanvas(W, H);
    getArray();
}   

function getArray() {
    if (STACK > 0) {
        anim = [];
        anim.length = 0;
        cirPath = [];
        cirPath.length = 0;
    }
    cirPath[0] = new Array();
    angleMode(DEGREES);
    for (let i = 0; i <= 360; i += SP) {
        let x = R * cos(i);
        let y = R * sin(i);
        let v = createVector(x, y);
        cirPath[0].push(v); 
    }
    while (COND === 0) {
        for (let i = 0; i < cirPath[0].length; i++) {
            if (i === 0) {
                cirPath[K+1] = new Array();
            }
            let A = i % (360 / (SP * N));
            if (A >= DELTA && i != cirPath[0].length - 1) {
                vL = cirPath[K][i-1];
                vR = cirPath[K][i+1];
                newX = (vL.x + vR.x) / 2;
                newY = (vL.y + vR.y) / 2;
                let newV = createVector(newX, newY);
                cirPath[K+1][i] = newV;
            }
            else {
                cirPath[K+1][i] = cirPath[K][i];
            }
        }
        for (let j = 0; j < cirPath[0].length; j++) {
            if (p5.Vector.dist(cirPath[K][j], cirPath[K+1][j]) < EPSILON) {
                COUNT += 1;
            }
        }
        if (COUNT === cirPath[0].length) {
            COND = 1;
        }
        else {
            K += 1;
            COUNT = 0;
        }
    }
    F = cirPath.length - 1;
    for (let i = 0; i < F; i++) {
        anim[i] = new Array();
        for (let j = 0; j < cirPath[0].length; j++) {
            anim[i][j] = cirPath[i][j];
        }
    }
    for (let i = F-1; i > 0; i--) {
        anim[2*F-i-2] = new Array();
        for (let j = 0; j < cirPath[0].length; j++) {
            anim[2*F-i-2][j] = cirPath[i][j];
        }
    }
    console.log(STACK+3);
    K = 0;
    COND = 0;
    angleMode(DEGREES);
    ANG = 360 / (2 * N);
    MAX = R - R * cos(ANG);
    P = Math.floor(360 / (2 * N * SP));
    draw();   
}

function draw() {  
    if (FC < 2*F-2) {
        background(0);
        translate(W / 2, H / 2);
        stroke(255);
        noFill();
        colorMode(HSB, MAX, 1, 1);
        if (FC >= 0 && FC < cirPath.length) {
            D = R - cirPath[FC][P].mag();
        } else {
            D -= MAX / F;
        }
        stroke(D, 1, 1);
        strokeWeight(3);
        beginShape();
        for (let i = 0; i < cirPath[0].length; i++) {
            let v = anim[FC][i];
            vertex(v.x, v.y);
        }
        endShape();
        FC += 1;
    } else {
        N += 1;
        FC = 0;
        STACK += 1;
        if (STACK < 19) {
            getArray();
        }
        else {
            noLoop();
        }
    }
}