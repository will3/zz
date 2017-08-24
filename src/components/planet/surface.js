var THREE = require('three');

class Surface {
	constructor(block, dir) {
		this.block = block;
		this.dir = dir;
		this.dirType = dir.join(',');

		this.center = [
			block.center[0] + (dir[0] / 2),
			block.center[1] + (dir[1] / 2),
			block.center[2] + (dir[2] / 2),
		];

		this.centerVector = new THREE.Vector3().fromArray(this.center);

		this.pointAbove = [
			block.center[0] + this.dir[0],
			block.center[1] + this.dir[1],
			block.center[2] + this.dir[2]
		];

		this.pointAboveVector = new THREE.Vector3().fromArray(this.pointAbove);

		this.id = block.coords.join(',') + ',' + dir.join(',');
	}
}

module.exports = Surface;