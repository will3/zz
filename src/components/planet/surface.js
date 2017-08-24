var THREE = require('three');

class Surface {
	constructor(block, dir) {
		this.block = block;
		this.dir = dir;
		this.dirType = dir.join(',');
		this.dirVector = new THREE.Vector3().fromArray(this.dir);

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

		// Find uv
		var d = dir[0] != 0 ? 0 : dir[1] != 0 ? 1 : 2;
		var u = (d + 1) % 3;
		var v = (d + 2) % 3; 

		var points = [];
		var uvs = [ [0, 0], [1, 0], [1, 1], [0, 1], [0, 0] ];
		var above = 0.02;

		for (var i = 0; i < uvs.length; i ++) {
			var diff = [ 0, 0, 0 ];
			diff[u] = uvs[i][0] - 0.5;
			diff[v] = uvs[i][1] - 0.5;

			points.push(new THREE.Vector3(
				this.center[0] + diff[0] + (dir[0] * above),
				this.center[1] + diff[1] + (dir[1] * above),
				this.center[2] + diff[2] + (dir[2] * above),
			));
		}

		this.quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.dirVector);

		this.points = points;
	}
}

module.exports = Surface;