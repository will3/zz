var THREE = require('three');
var renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

function render() {
	renderer.render(scene, camera);
};

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0.3, 1.0, 0.5);
scene.add(directionalLight);
var ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

module.exports = {
	camera,
	scene,
	render
};