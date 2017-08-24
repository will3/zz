var keycode = require('keycode');

var keyholds = {};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(e) {
	var key = keycode(e);
	keyholds[key] = true;
};

function onKeyUp(e) {
	var key = keycode(e);
	keyholds[key] = false;
};

module.exports = {
	keyholds
};