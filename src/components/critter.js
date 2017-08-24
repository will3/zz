var THREE = require('three');
var Card = require('./card');

class Critter extends Card {
	constructor() {
		super();

		this.frame = 0;
		this.totalFrames = 2;

		this.stepCooldown = 500;
		this.stepCounter = 0;
	}

	start() {
		this.frameMaterials = this.app.shared.materials.monster;
		this.material = this.frameMaterials[0];

		super.start();
	}

	tick() {
		super.tick();

		if (this.stepCounter > this.stepCooldown) {
			this.stepCounter -= this.stepCooldown;
			this.frame ++;
			this.frame %= this.totalFrames;

			this.plane.material = this.frameMaterials[this.frame];
		}
		
		this.stepCounter += this.app.delta;
	}
}

module.exports = Critter;