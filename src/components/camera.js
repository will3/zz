var THREE = require('three');
var keycode = require('keycode');

class Camera {
	constructor(camera) {
		this.camera = camera;
		this.target = new THREE.Vector3();
		this.rotation = new THREE.Euler(-Math.PI / 4, Math.PI / 4, 0, 'YXZ');
		this.distance = 50;
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.keyholds = {};
	}

	onKeyDown(e) {
		var key = keycode(e);
		this.keyholds[key] = true;
	}

	onKeyUp(e) {
		var key = keycode(e);
		this.keyholds[key] = false;
	}

	start() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	tick() {
		var right = 0;
		if (this.keyholds['left']) {
			right--;
		}

		if (this.keyholds['right']) {
			right++;
		}

		var up = 0;

		if (this.keyholds['up']) {
			up++;
		}

		if (this.keyholds['down']) {
			up--;
		}

		this.rotation.y += right * 0.1;
		this.rotation.x += up * 0.1;

		var position = new THREE.Vector3(0, 0, this.distance)
		.applyEuler(this.rotation)
		.add(this.target);

		this.camera.position.copy(position);
		this.camera.lookAt(this.target);
	}

	destroy() {
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);	
	}
};

module.exports = Camera;