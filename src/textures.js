var THREE = require('three');

var monster = [
	new THREE.TextureLoader().load("images/monster0.png"),
	new THREE.TextureLoader().load("images/monster1.png"),
];

monster.forEach(function(t) {
	t.minFilter = THREE.NearestFilter;
	// t.magFilter = THREE.NearestFilter;
});

module.exports = {
	monster
};