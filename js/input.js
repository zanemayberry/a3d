"use strict";

var Keycode = {
	W: 87,
	A: 65,
	S: 83,
	D: 68,
	Space: 32,
	R: 82
};

class Input {
	constructor(mouseCallback) {
		var self = this;
		this._keys = new Set();

		document.onmousemove = function(e) {
			mouseCallback(e);
		};

		document.onmousedown = function(e) {
			self._keys.add(e.which);
		};

		document.onmouseup = function(e) {
			self._keys.delete(e.which);
		};

		document.onkeydown = function(e) {
			self._keys.add(e.which);
		};

		document.onkeyup = function(e) {
			self._keys.delete(e.which);
		};
	}

	test(key) {
		return this._keys.has(key);
	}
}