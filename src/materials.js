var THREE = require('three');
var textures = require('./textures');

var monster = [
	new THREE.MeshBasicMaterial({
		map: textures.monster[0],
		transparent: true
	}),
	new THREE.MeshBasicMaterial({
		map: textures.monster[1],
		transparent: true
	})
];

var placeholder = new THREE.MeshBasicMaterial({
	color: 0xff0000
});

module.exports = {
	monster,
	placeholder
};