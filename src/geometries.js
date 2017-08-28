var THREE = require('three');

var map = {};

const getOrCreate = (key, block) => {
	if (map[key] == null) {
		map[key] = block();
	}
	return map[key];
};

module.exports = {
	getOrCreate
};