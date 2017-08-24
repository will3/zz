class Block {
	constructor(i, j, k) {
		this.id = [ i, j, k ].join(',');
		this.coords = [ i, j, k ];
		this.center = [ i + 0.5, j + 0.5, k + 0.5 ];
		this.surfaces = [];
	}
};

module.exports = Block;