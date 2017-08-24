var Blocks = require('voxel-ecs').Blocks;
var THREE = require('three');
var SimplexNoise = require('simplex-noise');

class Planet extends Blocks {
	constructor() {
		super();
		this.size = 24;
	}

	start() {
		super.start();

		this.offset.set(-this.size / 2, -this.size / 2, -this.size / 2);
		this.material.push(new THREE.MeshLambertMaterial({
			color: 0xffffff
		}));

		var simplex = new SimplexNoise();
		var nf = 0.1;

		// Generate blocks
		for (var i = 0; i < this.size; i ++) {
			for (var j = 0; j < this.size; j ++) {
				for (var k = 0; k < this.size; k ++) {
					this.chunks.set(i, j, k, 1);
				}
			}
		}

		// Carve terrian
		for (var d = 0; d < 3; d ++) {
			var u = (d + 1) % 3;
			var v = (d + 2) % 3;

			var min = 0;
			var max = this.size - 1;

			var coords = [];
			for (var j = 0; j < this.size; j ++) {
				for (var k = 0; k < this.size; k ++) {

					for (var side = 0; side < 2; side ++) {
						var i = side == 0 ? min : max;
						coords[d] = i;
						coords[u] = j;
						coords[v] = k;
						var n = Math.round(simplex.noise3D(coords[0] * nf, coords[1] * nf, coords[2] * nf) * 1);
							
						if (n == 0) {
							continue;
						}

						var start = n < 0 ? n : 0;
						var end = n > 0 ? n : 0;
						var value = n < 0 ? 1 : 0;
						for (var depth = start; depth <= end; depth ++) {
							i = side == 0 ? min + depth : max - depth;
							coords[d] = i;
							coords[u] = j;
							coords[v] = k;

							this.chunks.set(coords[0], coords[1], coords[2], value);
						}	
					}
					
				}
			}		
		}
	}
};

module.exports = Planet;