"use strict";

var MouseSensitivity = 0.002; // ZANETODO: hacky global
var Gravity = 0.15;
var JumpVel = 0.05;

class Player {
	constructor(camera) {
		this._obj = new THREE.Object3D();
		this._camera = camera;
		this._velY = 0;

		this._obj.add(camera);
	}

	get velocity() {
		return this._velocity;
	}

	get obj() {
		return this._obj;
	}

	update(input, delta) {
		if (input.test(Keycode.W)) {
			this._obj.translateZ(-delta);
		}
		if (input.test(Keycode.A)) {
			this._obj.translateX(-delta);
		}
		if (input.test(Keycode.S)) {
			this._obj.translateZ(delta);
		}
		if (input.test(Keycode.D)) {
			this._obj.translateX(delta);
		}
		if (input.test(Keycode.Space) && this._obj.position.y == 0) {
			this._velY = JumpVel;
		}
		this._obj.position.y = Math.max(this._obj.position.y + this._velY, 0);
		if (this._obj.position.y > 0) {
			this._velY -= delta * Gravity;
		}
	}

	mouseLook(e) {
		var movementX = e.movementX || 0;
		var movementY = e.movementY || 0;

		this._obj.rotation.y -= movementX * MouseSensitivity;
		this._obj.rotation.y %= 2 * Math.PI;
		this._camera.rotation.x = 
			Utils.clamp(this._camera.rotation.x - movementY * MouseSensitivity, -Math.PI / 2, Math.PI / 2);
	}
}
