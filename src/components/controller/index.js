var THREE = require('three');
var Diamond = require('../critters/diamond');

class Controller {
	constructor() {
		this.lastSurfaceId = null;
		this.lastSurface = null;
		this.lastSurfaceObj = null;

		this.debugAddCritterOnClick = true;
	}

	start() {
		this.input = this.app.shared.input;
		this.planet = this.app.shared.planet;

		this.surfaceMaterial = new THREE.LineBasicMaterial({
			color: 0x666666
		});
	}

	tick() {
		this.updateSurface();

		if (this.debugAddCritterOnClick) {
			if (this.lastSurface != null && this.input.mouseDowns[0]) {
				var critter = new Diamond();
				critter.surface = this.lastSurface;
				this.app.add(critter);
			}

			if (this.lastSurface != null && this.input.mouseHolds[2]) {
				
			}
		}
	}

	updateSurface() {
		var surface = this.planet.getSurfaceFromRay(this.input.mouseRaycaster);

		if (surface == null) {
			return;
		}

		if (this.lastSurfaceId == surface.id) {
			return;
		}

		if (this.lastSurfaceObj != null) {
			this.lastSurfaceObj.geometry.dispose();
			this.lastSurfaceObj.parent.remove(this.lastSurfaceObj);
		}

		var geometry = new THREE.Geometry();
		surface.points.forEach(function(point) {
			geometry.vertices.push(point);
		});
		var line = new THREE.Line(geometry, this.surfaceMaterial);
		this.planet.guiLayer.add(line);

		this.lastSurfaceId = surface.id;
		this.lastSurface = surface;
		this.lastSurfaceObj = line;
	}

	destroy() {
		this.surfaceMaterial.dispose();
	}
}

module.exports = Controller;