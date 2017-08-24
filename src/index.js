var voxel = require('voxel-ecs');
var Planet = require('./components/planet');
var Camera = require('./components/camera');
var renderer = require('./renderer');

var app = voxel();
app.scene = renderer.scene;

window.addEventListener('resize', function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

var planet = new Planet();
app.add(planet);

var camera = new Camera(renderer.camera);
app.add(camera);

function animate() {
	tick();
	requestAnimationFrame(animate);
}

function tick() {
	app.tick();
	renderer.render();
};

animate();