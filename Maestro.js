function Maestro() {
    this.frame = 0;
    this.isPlaying = false;
    this.isRecording = false;
    this.record = {};
    this.frames = [];

    this.trimStart = 0;
    this.trimEnd = 0;
    this.startCursor = false;
    this.endCursor = false;

    this.hudPosition = createVector(width/2,height/2);
    this.timeLinePosition = createVector(width/2,height/2);

    this.startRecording = function() {
        this.record = {};
        this.frames = [];
        this.isRecording = true;
        this.isPlaying = false;
    }

    this.stopRecording = function() {
        this.isRecording = false;
        this.trimStart = 0;
        this.trimEnd = Object.keys(this.record).length-1;
    }

    this.hud = function() {
        if (this.isRecording) {
            push();
            translate(this.hudPosition.x,this.hudPosition.y);
            noStroke();
            fill(color(255));
            ellipse(0,0,20,20);
            fill(color(0));
            ellipse(0,0,10,10);
            pop();
        }
        if (this.isPlaying) {
            push();
            translate(this.hudPosition.x,this.hudPosition.y);
            noStroke();
            fill(color(255));
            ellipse(0,0,20,20);
            fill(color(0));
            beginShape();
            vertex(-3,5);
            vertex(5,0);
            vertex(-3,-5);
            endShape(CLOSE);
            fill(color(0,0,100,100));
            rect(-200,50,400,15);
            fill(color(0,0,70,100));
            rect(map(this.trimStart,0,this.frames.length-1,-200,200),
                 50,
                 map(this.trimEnd-this.trimStart,0,this.frames.length-1,0,400),
                 15);
            rectMode(CENTER);
            fill(color(0));
            rect(map(this.frame,0,this.frames.length-1,-200,200),58,3,20);
            stroke(0,0,0);
            strokeWeight(2);
            fill(0,0,100);
            ellipse(map(this.trimStart,0,this.frames.length-1,-200,200),80,9,9);
            rectMode(CENTER);
            rect(map(this.trimEnd,0,this.frames.length-1,-200,200),80,8,8);

            pop();
        }       
        //console.log(this.record);
    }

    this.watch = function(k, v, f) {
        if (this.isRecording) {
            if (!this.record.hasOwnProperty(f)) {
                this.record[f] = {};
            } 
            this.record[f][k] = v;
        }
    }

    this.play = function() {
        if (!this.isRecording) {
            if (Object.keys(this.record).length > 0) {
                this.isPlaying = true;
                this.frame = this.trimStart;
                this.frames = Object.keys(this.record);
            }
        }
    }

    this.stop = function() {
        this.isPlaying = false;
    }

    this.tempo = function() {
        this.frame++;
        // let xToBeEased = map(this.frame,this.trimStart,this.trimEnd,0,1);
        // let xEased = easeInSine(xToBeEased);
        // this.frame = ceil(map(xEased,0,1,this.trimStart,this.trimEnd));
        if (this.frame > this.trimEnd) {
            this.frame = this.trimStart;
        }
        if (this.startCursor) {
            this.trimStart = constrain(floor(map(mouseX,150,550,0,this.frames.length-1)),0,this.trimEnd-1);
        }
        if (this.endCursor) {
            this.trimEnd = constrain(floor(map(mouseX,150,550,0,this.frames.length-1)),this.trimStart+1,Object.keys(maestro.record).length-1);
        }

    }

    this.tell = function(k) {
        if (this.isPlaying) {
            return this.record[this.frames[this.frame]][k];
        }
    }

}

function easeInSine(x) {
    return 1 - cos((x * PI) / 2);
  }
