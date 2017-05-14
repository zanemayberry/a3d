"use strict";

// var width = window.innerWidth;
// var height = window.innerHeight;
var Width = 1680;
var Height = 1050;

class Game {
	constructor() {
		var self = this;
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(75, Width / Height, 0.1, 1000);
		this._renderer = new THREE.WebGLRenderer();
		this._tick = Date.now();
		this._ground = []; // ZANETODO: hacky ground. needs to be a class.
		this._player = new Player(this._camera, this._ground);
		this._scene.add(this._player.obj);
		var canvas = this._renderer.domElement;
		this._input = new Input(canvas, function(e) { self._player.mouseLook(e); });

		this._renderer.setSize(Width, Height);
		this._renderer.shadowMapEnabled = true;
		this._scene.background = new THREE.Color(0xffffff);
		document.body.appendChild(canvas);

		this._renderer.domElement.onclick = function() {
			this.requestPointerLock();
		};

		this.debug_addCube(-3, 0, 0, 0xff0000);
		this.debug_addCube(0, 3, 0, 0x00ff00);
		this.debug_addCube(0, 0, -3, 0x0000ff);

		this.debug_addGround();

		var ambientLight = new THREE.AmbientLight(0x404040);
		this._scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5, 100);
		this._lightArm = new THREE.Object3D();
		this._lightArm.add(directionalLight);
		directionalLight.position.set(0, 20, 20);
		directionalLight.castShadow = true;
		this._scene.add(this._lightArm);

		var ground = new THREE.PlaneGeometry(60, 60, 199, 199);
		var material = new THREE.MeshLambertMaterial({color: 0x2222ee, transparent: true, opacity: 0.5});
		var plane = new THREE.Mesh(ground, material);
		plane.rotation.x = -Math.PI / 2;
		this._scene.add(plane);
	}

	debug_addCube(x, y, z, color) {
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshLambertMaterial({color: color});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;
		cube.castShadow = true;
		this._scene.add(cube);
	}

	debug_addGround() {
		for (var i = 0; i < 200; i++) {
			for (var j = 0; j < 200; j++) {
				var cell = i * 200 + j;
				this._ground[cell] = (cell / 20000) * (cell / 20000) - 1.5 + Math.random() / 10;
			}
		}

		var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);
		var material = new THREE.MeshLambertMaterial({
			color: 0xffee99,
			wireframe: false
		});
		for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			geometry.vertices[i].z = this._ground[i];
		}
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		var plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = -Math.PI / 2;
		plane.receiveShadow = true;
		this._scene.add(plane);
	}

	update() {
		var curTick = Date.now();
		var delta = (curTick - this._tick) / 1000;
		this._tick = curTick;
		this._lightArm.rotation.y += delta / 100;

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
