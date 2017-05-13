"use strict";

class Game {
	constructor() {
		var self = this;
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this._renderer = new THREE.WebGLRenderer();
		this._tick = Date.now();
		this._player = new Player(this._camera);
		this._scene.add(this._player.obj);
		this._input = new Input(function(e) { self._player.mouseLook(e); });

		this._renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this._renderer.domElement);

		this._renderer.domElement.onclick = function() {
			this.requestPointerLock();
		};

		this.debug_addCube(-3, 0, 0, 0xff0000);
		this.debug_addCube(0, 3, 0, 0x00ff00);
		this.debug_addCube(0, 0, -3, 0x0000ff);
	}

	debug_addCube(x, y, z, color) {
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshNormalMaterial();
		// var material = new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.5});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;
		this._scene.add(cube);
	}

	update() {
		var curTick = Date.now();
		var delta = (curTick - this._tick) / 1000;
		this._tick = curTick;

		this._player.update(this._input, delta);
	}

	draw() {
		this._renderer.render(this._scene, this._camera);
	}

	loop() {
		// ZANETODO: figure out something better than this closure.
		var self = this;
		requestAnimationFrame(function() { self.loop(); });
		this.update();
		this.draw();
	}

	start() {
		this.loop();
	}
}
