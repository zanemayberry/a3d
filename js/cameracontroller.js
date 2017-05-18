"use strict";

var CameraMoveSpeed = 3.0; // ZANETODO: hacky global stuff
var MouseSensitivity = 0.002;

class CameraController { // ZANETODO: maybe override THREE.Object3D
	constructor(camera) {
		this._obj = new THREE.Object3D();
		this._camera = camera;
		this._obj.add(camera);
	}

	get camera() {
		return this._camera;
	}

	get obj() {
		return this._obj;
	}

	update(input, delta) {
		if (input.test(Keycode.W)) {
			this._obj.translateZ(-CameraMoveSpeed * delta);
		}
		if (input.test(Keycode.A)) {
			this._obj.translateX(-CameraMoveSpeed * delta);
		}
		if (input.test(Keycode.S)) {
			this._obj.translateZ(CameraMoveSpeed * delta);
		}
		if (input.test(Keycode.D)) {
			this._obj.translateX(CameraMoveSpeed * delta);
		}
		if (input.test(Keycode.Shift)) {
			this._obj.translateY(CameraMoveSpeed * delta);
		}
		if (input.test(Keycode.Ctrl)) {
			this._obj.translateY(-CameraMoveSpeed * delta);
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
