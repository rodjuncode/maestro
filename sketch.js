const NONE = 0;

let txtSize;
let txtBaseLine;
let txtToPoints = [];
let phrase = ["this","is","maestro"];
let phraseIndex = 0;
let frame = 0;
let abrilFatFace;
let _xHeightRatio = {};

let strumLevelUp = 0;
let strumLevelDown = 0;
let pickUpStrings = 0;
let pickDownStrings = 0;
let mouseButtonInfo = NONE;
let palette;
let paletteIndex = 0;
let stringColor;
let fontColor;

let x = 1;
let y = 1;
let easing = 0.05;

let maestro; // #maestro

function preload() {
    abrilFatFace = loadFont('assets/Abril_Fatface.otf');
}

function setup() {
    //createCanvas(windowWidth,windowHeight);
    createCanvas(700,700);
    colorMode(HSB,360,100,100,100);
    frameRate(18);

    palette = [color(0,0,20,100),color(0,0,95,100),color(215,100,100,100),color(30,100,100,100)];
    stringColor = color(6,88,99,100);
    fontColor = color(0,0,100,45);

    // finds longer word
    let _longerWordLength = 0;
    for (let i = 1; i < phrase.length; i++) {
        if (phrase[i].length > phrase[_longerWordLength].length) {
            _longerWordLength = i;
        }
    }

    // calculates font size
    txtSize = width;
    textSize(width);
    while(textWidth(phrase[_longerWordLength]) > width*.7) {
        txtSize--;
        textSize(txtSize);
    }
    // calculates base line according to font isze
    txtBaseLine = textAscent()*xHeightRatio(abrilFatFace)/2 + height/2;

    // converts first word to points
    txtToPoints = txt2Points(phrase[0],0,txtBaseLine,txtSize);

    // final details
    document.addEventListener('contextmenu', event => event.preventDefault());
    fill(fontColor);
    noStroke();   
    
    maestro = new Maestro(); // #maestro

}

function draw() {

    // #maestro
    maestro.watch("mouseX",mouseX,frame);
    maestro.watch("mouseY",mouseY,frame);
    maestro.watch("strumLevelUp",strumLevelUp,frame);
    maestro.watch("strumLevelDown",strumLevelDown,frame);   
    maestro.watch("pickUpStrings",pickUpStrings,frame);   
    maestro.watch("pickDownStrings",pickDownStrings,frame);       
    maestro.watch("mouseButtonInfo",mouseButtonInfo,frame);   

    // mouse easin
    let targetX = maestro.isPlaying?maestro.tell("mouseX"):mouseX;
    let dx = targetX - x;
    x += dx * easing;
    let targetY = maestro.isPlaying?maestro.tell("mouseY"):mouseY;
    let dy = targetY - y;
    y += dy * easing;

    // changes word
    if ((maestro.isPlaying?maestro.tell("mouseButtonInfo"):mouseButtonInfo) == LEFT) {
        phraseIndex++;
        if (phraseIndex == phrase.length) {
            phraseIndex = 0;
        } 
        txtToPoints = txt2Points(phrase[phraseIndex],0,txtBaseLine,txtSize);
    // changes background color
    } else if ((maestro.isPlaying?maestro.tell("mouseButtonInfo"):mouseButtonInfo) == RIGHT) {
        paletteIndex++;
        if (paletteIndex == palette.length) {
            paletteIndex = 0;
        }
    }    
    mouseButtonInfo = NONE;

    // moves typography towards mouse
    let _xOff = map(x,0,width,-10,width*0.8)-textWidth(phrase[phraseIndex])/2;
    let _yOff = map(y,0,height,-height*.5,height*.5);
    
    // calculates strumming
    let _strumUp = maestro.isPlaying?maestro.tell("strumLevelUp"):strumLevelUp;
    let _strumDown = maestro.isPlaying?maestro.tell("strumLevelDown"):strumLevelDown;
    let _pickUp = maestro.isPlaying?maestro.tell("pickUpStrings"):pickUpStrings;
    let _pickDown = maestro.isPlaying?maestro.tell("pickDownStrings"):pickDownStrings;
    let strumDeltaUp = (frame%2==0?_strumUp:-_strumUp);
    let strumDeltaDown = (frame%2==0?_strumDown:-_strumDown);
    if (frame % 2 == 0 && strumLevelUp > 0) {
        strumLevelUp-=1;
    }
    if (frame % 2 == 0 && strumLevelDown > 0) {
        strumLevelDown-=1;
    }

    background(palette[paletteIndex]); 
    beginShape();
    // draws main shape and its string
    for (let j = 0; j < txtToPoints[0].length; j++) {
        vertex(txtToPoints[0][j].x+_xOff,txtToPoints[0][j].y+_yOff);
        push();
        if (abs(j-_pickUp) > 5) {
            stroke(stringColor);     
        } else {
            stroke(hue(stringColor),saturation(stringColor),brightness(stringColor),50);
        }
        line(txtToPoints[0][j].x+_xOff,
            txtToPoints[0][j].y+_yOff,
            map(j,0,txtToPoints[0].length-1,0,width)+((_pickUp>j || strumDeltaUp > 0)?strumDeltaUp+strumDeltaUp*0.5*cos(j):0),
            0);
        pop();
    }
    pickUpStrings+=30;
    // draws remaining shapes and strings
    for (let j = 1; j < txtToPoints.length; j++) {
        beginContour();
        for (let k = 0; k < txtToPoints[j].length; k++) {
            vertex(txtToPoints[j][k].x+_xOff,txtToPoints[j][k].y+_yOff);
            push();
            if (abs(k-_pickDown) > 5) {
                stroke(stringColor);     
            } else {
                stroke(hue(stringColor),saturation(stringColor),brightness(stringColor),50);
            }     
            line(txtToPoints[j][k].x+_xOff,
                 txtToPoints[j][k].y+_yOff,
                 map(k,0,txtToPoints[j].length-1,0,width)+((_pickDown>k || strumDeltaDown > 0)?strumDeltaDown+strumDeltaDown*0.5*cos(k):0),
                 height);
            pop();                    
        }
        endContour();
    }
    pickDownStrings+=30;
    endShape(CLOSE);
    
    frame++;

    // #maestro
    maestro.tempo();
    maestro.hud();
}

function mousePressed() {
    mouseButtonInfo = mouseButton;
    let mouseCursor = createVector(mouseX,mouseY);
    let startCursor = createVector(maestro.hudPosition.x+map(maestro.trimStart,0,maestro.frames.length-1,-200,200),maestro.hudPosition.y+80);
    let endCursor = createVector(maestro.hudPosition.x+map(maestro.trimEnd,0,maestro.frames.length-1,-200,200),maestro.hudPosition.y+80);
    if (mouseCursor.dist(startCursor) < 10) {
        maestro.startCursor = true;
    }
    if (mouseCursor.dist(endCursor) < 10) {
        maestro.endCursor = true;
    }    
    let leftLimit = map(maestro.trimStart,0,maestro.frames.length-1,-200,200);
    let rightLimit = map(maestro.trimEnd,0,maestro.frames.length-1,-200,200);
    if ((mouseX >= maestro.hudPosition.x + leftLimit && mouseX <= maestro.hudPosition.x + rightLimit) &&
        (mouseY >= maestro.hudPosition.y + 48 && mouseY <= maestro.hudPosition.y + 68)) {
            let f = map(mouseX,maestro.hudPosition.x+leftLimit,maestro.hudPosition.x+rightLimit,maestro.trimStart,maestro.trimEnd);
            maestro.frame = floor(f);
        }
    
}

function mouseReleased() {
    maestro.startCursor = false;
    maestro.endCursor = false;
}


// converts word to points
function txt2Points(txt, x, y, size) {
    let txtArray;
    let txtPoints;
    let _previousTxtSize = textSize();

    textSize(size);

    txtArray = abrilFatFace.textToPoints(txt, x, y, size, {
        sampleFactor: 0.3,
        simplifyThreshold: 0
      });
    
    txtPoints = [];
    
    // detailed analysis
    let _fontAnalysis = [];
    let currP, prevP;
    prevP = createVector(txtArray[0].x,txtArray[0].y);    
    let j = 0;
    let k = 0;
    _fontAnalysis[j] = [];
    _fontAnalysis[j][k] = prevP;
    for (let i = 1; i < txtArray.length; i++) {
        currP = createVector(txtArray[i].x,txtArray[i].y);
        if (prevP.dist(currP) > 5) {
            j++;
            _fontAnalysis[j] = [];
            k = 0;
            _fontAnalysis[j][k] = currP;
        } else {
            k++;            
            _fontAnalysis[j][k] = currP;
        }
        prevP = currP;
    }

    while (_fontAnalysis.length > 0) {
        let vertexHighIndex = 0;
        for (let i = 1; i < _fontAnalysis.length; i++) {
            if (_fontAnalysis[i].length > _fontAnalysis[vertexHighIndex].length) {
                vertexHighIndex = i;
            }
        }
        txtPoints.push(_fontAnalysis[vertexHighIndex]);
        _fontAnalysis.splice(vertexHighIndex,1)
    }    

    textSize(_previousTxtSize);

    return txtPoints;
    
}

function keyReleased(){
    if(key == 's') save('maestro.png');
}


// calculates x-height ration related to textAscent()
function xHeightRatio(f) {
    let fontName = f.font.names.fullName;
    if (!(f.font.names.fullName in _xHeightRatio)) {
        let _prevTxtFont = textFont();
        let _prevTxtSize = textSize();
        textFont(f);
        textSize(width);
        let x = f.textToPoints("x", 0, textAscent(), width);
        let xHeightLevel = x[0].y;
        for (let i = 1; i < x.length; i++) {
            if (x[i].y < xHeightLevel) {
                xHeightLevel = x[i].y;
            }
          
        }
        let xHeight = (textAscent() - xHeightLevel);
        _xHeightRatio[fontName] = xHeight/textAscent();
        textFont(_prevTxtFont);
        textSize(_prevTxtSize);
    }

    return _xHeightRatio[fontName];
}

// strumming
function mouseWheel(event) {
    if (event.deltaY > 0) {
        pickDownStrings = 0;
        strumLevelDown += 2;
    } else {
        pickUpStrings = 0;
        strumLevelUp += 2;
    }
    strumLevelUp = constrain(strumLevelUp,0,15);
    strumLevelDown = constrain(strumLevelDown,0,10);
}

function keyTyped() {
    if (key === 'w') { // #maestro
        if (maestro.isRecording) {
            maestro.stopRecording();
        } else {
            maestro.startRecording();
        }
    } 
    if (key === 'p') { // #maestro
        if (maestro.isPlaying) {
            maestro.stop();
        } else {
            maestro.play();
        }
    } 
    return false;
}
