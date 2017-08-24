var THREE = require('three');

class Card {
	constructor() {
		this.object = new THREE.Object3D();
		this.innerObject = new THREE.Object3D();
		this.surface = null;
		this.material = null;

		this._planes = [];
	}

	start() {
		this.materials = this.app.shared.materials;
		this.camera = this.app.shared.camera;
		this.planet = this.app.shared.planet;
		this.scene = this.app.shared.scene;
		
		this.material = this.material || this.materials.placeholder;

		var geometry = new THREE.PlaneGeometry(1, 1);

		var num = 8.0;
		var step = Math.PI * 2.0 / num;
		for (var i = 0; i < num; i++) {
			var plane = new THREE.Object3D();
			plane.position.y = 0.5;
			plane.rotation.y = i * step;
			this.innerObject.add(plane);
			this._planes.push(plane);
		}

		this.plane = new THREE.Mesh(geometry, this.material);
		this.plane.position.y = 0.5;

		this.innerObject.add(this.plane);

		this.object.add(this.innerObject);
		this.planet.critterLayer.add(this.object);

		// this.innerObject.scale.set(2, 2, 2);
		this.innerObject.quaternion.copy(this.surface.quat);

		this.object.position.copy(this.surface.centerVector);
	}

	tick() {
		var dir = this.object.localToWorld(new THREE.Vector3()).sub(this.camera.position);

		var maxAngle = -Infinity;
		var maxPlane = null;

		for(var i = 0; i < this._planes.length; i ++) {
			var plane = this._planes[i];

			var q = new THREE.Quaternion();
			plane.matrixWorld.decompose(new THREE.Vector3(), q, new THREE.Vector3());
			var front = new THREE.Vector3(0, 0, 1).applyQuaternion(q);

			var angle = dir.angleTo(front);
			angle = Math.abs(angle);
			if (angle > maxAngle) {
				maxAngle = angle;
				maxPlane = plane;
			}
		}

		this.plane.quaternion.copy(maxPlane.quaternion);
	}

	destroy() {
		this.scene.remove(this.object);
	}
}

module.exports = Card;