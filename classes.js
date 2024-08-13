'use strict';

// Jukebox object to play tunes
class JukeBox extends EngineObject{
    constructor(){
        super(vec2(-1000,-1000)); // Render it way off screen
        this.tickTimer = new Timer;
        this.sequence = [];
        this.sequenceIndex = 0;
    }

    play(sequence){
        if(sequence.length) this.stop();
        this.sequence = JSON.parse(JSON.stringify(sequence)); 
        this.tickTimer.set(0);
    }

    stop(){
        this.tickTimer.unset();
        this.sequence = [];
        this.sequenceIndex = 0;
    }

    update(){
        if(this.tickTimer.elapsed()){
            if(this.sequence.length){
                let s = this.sequence.shift();
                if(!gameMuted) active_sounds[s[0]].play();
                this.tickTimer.set(s[1]);
            }
            else this.stop();
        }
    }
}

// UI Elements
class UIElement extends EngineObject {
    constructor(pos, tileIndex, offset, hits=1, activeState=states.MAIN, callback=null){
        super(pos, vec2(1,1), tile(tileIndex));
        this.offset = offset;
        this.color = light;
        this.emitter;
        this.tileIndex = tileIndex;
        this.emitterCountdown = new Timer;
        this.activeState = activeState;
        this.callback = callback;
        this.hitsLeft = hits;
    }

    update(){
        if(gameState == this.activeState){
            super.update();

            // Always set self to offset of camera position
            this.pos.x = cameraPos.x + this.offset.x;
            this.pos.y = cameraPos.y + this.offset.y;

            this.setCollision((this.hitsLeft > 0), false, false); // make object collide when still has hits left
            this.mass = 0; // make object have static physics

            if(this.emitterCountdown.active()) {
                this.emitter.pos = this.pos;
            }
            else if(this.emitter && this.emitterCountdown.elapsed()) {
                this.emitterCountdown.unset();
                this.emitter.destroy();
            }
        }
    }

    collideWithObject(o){
        if(gameState == this.activeState){
            if(o.isBullet){
                o.destroy();
                this.hit();
            }
        }
    }

    hit(){
        //Do not get hit if already out of hits
        if(this.hitsLeft > 0){
            this.hitsLeft--;

            // Throw particles
            if(!this.emitterCountdown.active()){
                this.emitter = new ParticleEmitter
                (
                    this.pos, 0, 2, 0, 500, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
                    tile(this.tileIndex), // tileInfo
                    dark, med, // colorStartA, colorStartB
                    dark, med, // colorEndA, colorEndB
                    0.1, .4, .1, .15, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                    .8, 1, 1, PI, .5, // damping, angleDamping, gravityScale, particleCone, fadeRate, 
                    .5, 0, 1 // randomness, collide, additive, randomColorLinear, renderOrder
                );
                this.emitterCountdown.set(.05);
            }
        }

        if(this.hitsLeft < 1) {
            //this.destroy();
            this.callback();
        }
    }

    render(){
        if(gameState == this.activeState){
            //super.render();
            //drawTile(pos, size=vec2(1), tileInfo, color=new Color, angle=0, mirror, additiveColor=new Color(0,0,0,0), useWebGL=glEnable, screenSpace, context)

            // 2d overlay canvas
            if(this.hitsLeft > 0){
                drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor, false, false, overlayContext);
            }

            // main 3d canvas
            //drawTile(this.pos, this.drawSize || this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor, glEnable, false );
        }
    }
}