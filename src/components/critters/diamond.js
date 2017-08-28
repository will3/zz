const THREE = require('three');

class Diamond {
	constructor() {
		this.surface = null;
		this.nextSurface = null;
		this.stepAmount = 0;
		this.stepSpeed = 0.3;

		this.object = new THREE.Object3D();

		this.counter = 0;
	}

	start() {
		this.planet = this.app.shared.planet;
		this.materials = this.app.shared.materials;
		this.geometries = this.app.shared.geometries;
		this.scene = this.app.shared.scene;
		this.camera = this.app.shared.camera;
		this.input = this.app.shared.input;
		this.controller = this.app.shared.controller;

		const material = this.materials.getOrCreate('critter_diamond', () => {
			var texture = new THREE.TextureLoader().load('images/critter_diamond.png');
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			return new THREE.MeshBasicMaterial({
				map: texture,
				color: 0x333333,
				transparent: true
			})
		});

		const geometry = this.geometries.getOrCreate('critter_diamond', () => {
			return new THREE.PlaneGeometry(1, 1);
		});

		this.mesh = new THREE.Mesh(geometry, material);
		
		this.offsetLayer = new THREE.Object3D();
		this.rotationLayer = new THREE.Object3D();

		this.rotationLayer.add(this.mesh);
		this.offsetLayer.add(this.rotationLayer);
		this.object.add(this.offsetLayer);

		this.planet.innerObject.add(this.object);
		this.planet.setSurfaceEnterObject(this.surface);
	}

	destroy() {
		this.planet.innerObject.remove(this.object);
	}

	tick() {
		// Update matrix
		var position = this.object.worldToLocal(this.camera.position.clone());
		this.rotationLayer.lookAt(position);
		this.mesh.rotation.z += 0.01;
		this.offsetLayer.position.y = Math.sin(this.counter * 0.005) * 0.1;
		this.counter += this.app.delta;

		this.updatePath();
		this.updateStep();
		this.updatePosition();
	}

	updatePath() {
		var dest = this.controller.lastSurface;

		// Skip if no input
		if (!this.input.mouseHolds[2] || dest == null) {
			return;
		} 

		// Skip if already calculated
		if (this.nextSurface != null) {
			return;
		}

		var connection = this.planet.getPath(this.surface, dest);

		// Skip if no solution
		if (connection == null) {
			return;
		}

		this.nextSurface = connection.b;
		this.planet.setSurfaceEnterObject(this.nextSurface);
		this.planet.setSurfaceLeaveObject(this.surface);
	}

	updateStep() {
		if (this.nextSurface == null) {
			return;
		}

		this.stepAmount += this.stepSpeed;

		if (this.stepAmount > 1.0) {
			this.stepAmount -= 1.0;
			this.surface = this.nextSurface;
			this.nextSurface = null;
		}
	}

	updatePosition() {
		if (this.nextSurface == null) {
			// Place object
			this.object.position.copy(this.surface.pointAboveVector);
		} else {
			this.object.position.copy(
				this.surface.pointAboveVector.clone()
				.lerp(this.nextSurface.pointAboveVector, this.stepAmount));
		}
	}
}

module.exports = Diamond;