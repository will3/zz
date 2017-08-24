var Voxel = require('voxel-ecs');
var THREE = require('three');
var SimplexNoise = require('simplex-noise');
var Block = require('./block');
var Surface = require('./surface');
var Connection = require('./connection');

class Planet extends Voxel.Blocks {
	constructor() {
		super();
		this.size = 24;
		this.surfaces = {};
		this.blocks = {};
		this.blocksWithSurface = {};
		this.connections = {};

		this.debugShowSurfaces = false;
		this.debugShowConnections = true;
	}

	start() {
		super.start();

		this.offset.set(-this.size / 2, -this.size / 2, -this.size / 2);
		this.material.push(new THREE.MeshLambertMaterial({
			color: 0xffffff
		}));

		this.initBlocks();

		this.initHeightMap();

		this.initSurfaces();

		this.initConnections();
	}

	initBlocks() {
		// Generate blocks
		for (var i = 0; i < this.size; i ++) {
			for (var j = 0; j < this.size; j ++) {
				for (var k = 0; k < this.size; k ++) {
					this.chunks.set(i, j, k, 1);
				}
			}
		}
	}

	initHeightMap() {
		var maxDepth = 1;
		var simplex = new SimplexNoise();
		var nf = 0.04;

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

						var n = Math.round(simplex.noise3D(coords[0] * nf, coords[1] * nf, coords[2] * nf) * maxDepth);
							
						if (n == 0) {
							continue;
						}

						var start = n < 0 ? n : 0;
						var end = n < 0 ? 0 : n - 1;
						var value = n < 0 ? 1 : 0;

						for (var depth = start; depth <= end; depth ++) {
							i = side == 0 ? min + depth : max - depth;
							coords[d] = i;
							coords[u] = j;
							coords[v] = k;

							// If outside bounds, add to block map
							if (n < 0) {
								var block = new Block(coords[0], coords[1], coords[2]);
								this.blocks[block.id] = block;
							}

							this.chunks.set(coords[0], coords[1], coords[2], value);
						}	
					}
				}
			}		
		}

		// Record blocks inside bounds
		for (var i = 0; i < this.size; i ++) {
			for (var j = 0; j < this.size; j ++) {
				for (var k = 0; k < this.size; k ++) {
					var v = this.chunks.get(i, j, k);
					if (v == 0) { continue; }
					var block = new Block(i, j, k);
					this.blocks[block.id] = block;
				}
			}
		}
	}

	initSurfaces() {
		// Generate surfaces
		var surfaces = {};

		for (var id in this.blocks) {
			var block = this.blocks[id];
			var coords = block.coords;
			var i = coords[0];
			var j = coords[1];
			var k = coords[2];

			var adj = [
				[ i - 1, j, k ],
				[ i + 1, j, k ],
				[ i, j - 1, k ],
				[ i, j + 1, k ],
				[ i, j, k - 1 ],
				[ i, j, k + 1 ],
			];

			for (var h = 0; h < adj.length; h++) {
				var coords = adj[h];
				var neighbour = this.getBlock(coords[0], coords[1], coords[2]);
				if (neighbour != null) {
					continue;
				}

				var dir = [ 
					coords[0] - block.coords[0],
					coords[1] - block.coords[1],
					coords[2] - block.coords[2],
				];

				var surface = new Surface(block, dir);

				surfaces[surface.id] = surface;
				block.surfaces.push(surface);

				id = block.coords.join(',');
				this.blocksWithSurface[id] = block;
			}
		}

		this.surfaces = surfaces;

		if (this.debugShowSurfaces) {
			for (var id in this.surfaces) {
				var surface = this.surfaces[id];
				var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
					color: 0xff0000
				}));
				sprite.position.fromArray(surface.center);
				sprite.scale.set(0.2, 0.2, 1);

				this.innerObject.add(sprite);
			}	
		}
	}

	initConnections() {
		for (var id in this.blocksWithSurface) {
			var block = this.blocksWithSurface[id];
			for (var i = 0; i < block.surfaces.length; i++) {
				var surface = block.surfaces[i];
				this.initConnectionsForSurface(block, surface);
			}
		}

		if (this.debugShowConnections) {
			var geometry = new THREE.Geometry();

			for (var id in this.connections) {
				var connection = this.connections[id];
				geometry.vertices.push(connection.a.pointAboveVector);
				geometry.vertices.push(connection.b.pointAboveVector);
			}

			var line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
				color: 0xff0000
			}));

			this.innerObject.add(line);	
		}
	}

	initConnectionsForSurface(block, surface) {
		var coords = block.coords;
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				for (var k = -1; k <= 1; k++) {
					var id = [
						i + block.coords[0], 
						j + block.coords[1], 
						k + block.coords[2]
					].join(',');
					
					var b = this.blocksWithSurface[id];

					if (b == null) {
						continue;
					}

					for (var h = 0; h < b.surfaces.length; h++) {
						var surfaceb = b.surfaces[h];

						if (surface === surfaceb) {
							continue;
						}

						if (surface.pointAboveVector.distanceTo(surfaceb.pointAboveVector) < 1.5) {
							var connection = new Connection(surface, surfaceb);
							this.connections[connection.id] = connection;
						}
					}
				}
			}
		}
	}

	getBlock(i, j, k) {
		var id = [i, j, k].join(',');
		return this.blocks[id];
	}
};

module.exports = Planet;