"use strict";

var MouseSensitivity = 0.002; // ZANETODO: hacky global stuff
var Gravity = 0.15;
var JumpVel = 0.05;
// var Ground = 1.0;

class Player {
	constructor(camera, ground) {
		this._obj = new THREE.Object3D();
		this._camera = camera;
		this._ground = ground;
		this._velY = 0;

		this._obj.add(camera);
	}

	get velocity() {
		return this._velocity;
	}

	get obj() {
		return this._obj;
	}

	// ZANETODO: encapsulate as part of ground class...
	calcY() {
		var groundRatio = 200 / 60;		
		var groundX = groundRatio * (this._obj.position.x + 30);
		var groundZ = groundRatio * (this._obj.position.z + 30);

		var floorX = ~~groundX;
		var floorZ = ~~groundZ;
		var base = 200 * floorZ + floorX;

		var deltaX = groundX - floorX;
		var deltaZ = groundZ - floorZ;

		var sup = deltaZ > deltaX ? 0 : 1;

		// var det = sup + -1 * (1 - sup);
		
		var l1 = -(deltaX - deltaZ);
		var l2 = -((-1 + sup) * deltaX + sup * deltaZ);
		var l3 = 1.0 - l1 - l2;
		
		return 1 + l1 * this._ground[base + (200 - 199 * sup)] + l2 * this._ground[base + 201] + l3 * this._ground[base] || 0;
	}

	update(input, delta) {
		this._obj.position.y = .9 * this._obj.position.y + .1 * this.calcY();

		if (input.test(Keycode.W) || input.test(Keycode.LMB)) {
			this._obj.translateZ(-2 * delta);
		}
		if (input.test(Keycode.A)) {
			this._obj.translateX(-2 * delta);
		}
		if (input.test(Keycode.S) || input.test(Keycode.RMB)) {
			this._obj.translateZ(2 * delta);
		}
		if (input.test(Keycode.D)) {
			this._obj.translateX(2 * delta);
		}
		// if (input.test(Keycode.Space) && this._obj.position.y <= Ground) {
		// 	this._velY = JumpVel;
		// }
		// this._obj.position.y = Math.max(this._obj.position.y + this._velY, Ground);
		// if (this._obj.position.y > Ground) {
		// 	this._velY -= delta * Gravity;
		// }
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
