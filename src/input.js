var keycode = require('keycode');
var THREE = require('three');

class Input {
	constructor(app, camera) {
		this.camera = camera;

		this.mouse = new THREE.Vector2();
		this.mousePosition = new THREE.Vector2();
		this.mouseRaycaster = new THREE.Raycaster();
		this.keyDowns = {};
		this.keyUps = {};
		this.keyholds = {};
		this.mouseDowns = {};
		this.mouseUps = {};
		this.mouseHolds = {};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.afterTick = this.afterTick.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);

		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);

		app.on('afterTick', this.afterTick);
	}

	onKeyDown(e) {
		var key = keycode(e);
		this.keyholds[key] = true;
		this.keyDowns[key] = true;
	}

	onKeyUp(e) {
		var key = keycode(e);
		this.keyholds[key] = false;
		this.keyUps[key] = true;
	}

	onMouseMove(e) {
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.mousePosition.x = e.clientX;
		this.mouseRaycaster.y = e.clientY;

		this.mouseRaycaster.setFromCamera(this.mouse, this.camera);
	}

	onMouseDown(e) {
		this.mouseDowns[e.button] = true;
		this.mouseHolds[e.button] = true;
	}

	onMouseUp(e) {
		this.mouseUps[e.button] = true;
		this.mouseHolds[e.button] = false;
	}

	afterTick() {
		this.keyDowns = {};
		this.keyUps = {};
		this.mouseDowns = {};
		this.mouseUps = {};
	}
};

module.exports = Input;