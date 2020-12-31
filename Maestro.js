function Maestro() {
    this.frame = 0;
    this.isPlaying = false;
    this.isRecording = false;
    this.record = {};
    this.frames = [];

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
            fill(color(0,0,95,95));
            rect(-200,50,400,50);
            rectMode(CENTER);
            fill(color(300,100,100));
            rect(map(this.frame,0,this.frames.length-1,-200,200),75,1,50);
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
        if (Object.keys(this.record).length > 0) {
            this.isRecording = false;
            this.isPlaying = true;
            this.frame = 0;
            this.frames = Object.keys(this.record);
        }
    }

    this.stop = function() {
        this.isPlaying = false;
    }

    this.tempo = function() {
        this.frame++;
        if (this.frame == this.frames.length) {
            this.frame = 0;
        }
        if (this.isPlaying) {
            if (mouseX > 150 && mouseX < 550 &&
                mouseY > 400 && mouseY < 450) {
                cursor(CROSS);
            } else {
                cursor(ARROW);
            }
        }
    }

    this.tell = function(k) {
        if (this.isPlaying) {
            return this.record[this.frames[this.frame]][k];
        }
    }

}
