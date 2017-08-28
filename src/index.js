var voxel = require('voxel-ecs');
var Planet = require('./components/planet');
var Camera = require('./components/camera');
var Controller = require('./components/controller');
var renderer = require('./renderer');
var Input = require('./input');

var app = voxel();
app.shared.scene = renderer.scene;

app.shared.input = new Input(app, renderer.camera);

app.shared.camera = renderer.camera;

var planet = new Planet();
app.shared.planet = planet;
app.add(planet);

var controller = new Controller();
app.shared.controller = controller;
app.add(controller);

var camera = new Camera(renderer.camera);
app.add(camera);

app.shared.materials = require('./materials');
app.shared.geometries = require('./geometries');

function animate() {
	tick();
	requestAnimationFrame(animate);
}

function tick() {
	app.tick();
	renderer.render();
};

animate();