var THREE = require('three');

class Camera {
	constructor(camera) {
		this.camera = camera;
		this.target = new THREE.Vector3();
		this.rotation = new THREE.Euler(-Math.PI / 4, Math.PI / 4, 0, 'YXZ');
		this.distance = 50;
	}

	tick() {
		var position = new THREE.Vector3(0, 0, this.distance)
		.applyEuler(this.rotation)
		.add(this.target);

		this.camera.position.copy(position);
		this.camera.lookAt(this.target);
	}
};

module.exports = Camera;