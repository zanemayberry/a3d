"use strict";

var Width = 1680;
var Height = 1050;
// var LightSpeed = 1/100;
var LightSpeed = 1/5;
var Zero = new THREE.Vector2();

// ZANETODO: get rid of hacky static stuff
// This'll have to go in its own class...
// probably belongs in grid?
// except for last click. maybe.
var intersected = undefined;
var lastColor = undefined;
var lastClick = 0;

class Game {
	constructor() {
		var self = this;

		// Set up the scene
		this._scene = new THREE.Scene();
		this._scene.background = new THREE.Color(0xf9f9ff);

		// Add the renderer
		this._renderer = new THREE.WebGLRenderer();
		var canvas = this._renderer.domElement;
		canvas.onclick = function() {
			this.requestPointerLock();
		};
		this._renderer.setSize(Width, Height);
		document.body.appendChild(canvas);

		this._tick = Date.now(); // ZANETODO: use the built-in three.js clock

		// Add the camera
		this._cameraController = new CameraController(new THREE.PerspectiveCamera(75, Width / Height, 0.1, 1000));
		this._scene.add(this._cameraController.obj);

		// Add the input
		this._input = new Input(canvas, function(e) { self._cameraController.mouseLook(e); });

		// Add the grid
		this._grid = new Grid(10, 10, 10);
		this._scene.add(this._grid.obj);

		// Add some ambient light
		var ambientLight = new THREE.AmbientLight(0x404040);
		this._scene.add(ambientLight);

		// Add the sun
		var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5, 100);
		this._lightArm = new THREE.Object3D();
		this._lightArm.add(directionalLight);
		directionalLight.position.set(0, 40, 40);
		this._scene.add(this._lightArm);

		// Add the ground
		var ground = new THREE.PlaneGeometry(60, 60, 60, 60);
		var material = new THREE.MeshLambertMaterial({color: 0xaaaadd, wireframe: true});
		var plane = new THREE.Mesh(ground, material);
		plane.rotation.x = -Math.PI / 2;
		plane.position.x = -0.5;
		plane.position.y = -0.5;
		plane.position.z = -0.5;
		this._scene.add(plane);

		// Add a cube
		this._grid.add(0, 0, 0);

		// Add the raycaster
		this._raycaster = new THREE.Raycaster();
	}

	update() {
		var curTick = Date.now();
		var delta = (curTick - this._tick) / 1000;
		var deltaClick = (curTick - lastClick) / 1000;
		this._tick = curTick;
		this._lightArm.rotation.y += LightSpeed * delta;
		this._cameraController.update(this._input, delta);

		this._raycaster.setFromCamera(Zero, this._cameraController.camera);
		var intersects = this._raycaster.intersectObjects(this._grid.obj.children);
		if (intersects.length > 0) {
			if (intersected) {
				intersected.face.color.copy(lastColor);
				var n = intersected.face.normal;
				for (var i = 0; i < 12; i++) {
					var f = intersected.object.geometry.faces[i];
					if (n.equals(f.normal)) {
						f.color.copy(lastColor);
					}
				}
				intersected.object.geometry.colorsNeedUpdate = true;
			}
			intersected = intersects[0];
			lastColor = new THREE.Color();
			lastColor.copy(intersected.face.color);
			intersected.face.color.copy(new THREE.Color("#ff0000"));
			var n = intersected.face.normal;
			for (var i = 0; i < 12; i++) {
				var f = intersected.object.geometry.faces[i];
				if (n.equals(f.normal)) {
					f.color.copy(new THREE.Color("#ff0000"));
				}
			}
			intersected.object.geometry.colorsNeedUpdate = true;
		}

		if (this._input.test(Keycode.Mouse0) && intersected && deltaClick > 0.3) {
			var vec = new THREE.Vector3();
			vec.addVectors(intersected.object.position, intersected.face.normal);
			this._grid.add(vec.x, vec.y, vec.z);
			lastClick = curTick;
		}
		if (this._input.test(Keycode.Mouse1) && intersected && deltaClick > 0.3) {
			var pos = intersected.object.position;
			this._grid.remove(pos.x, pos.y, pos.z);
			intersected = undefined;
			lastClick = curTick;
		}
	}

	draw() {
		this._renderer.render(this._scene, this._cameraController.camera);
	}

	loop() {
		// ZANETODO: closure looks weird, but I think the
		// only way around it would require a global static
		var self = this;
		requestAnimationFrame(function() { self.loop(); });
		this.update();
		this.draw();
	}

	start() {
		this.loop();
	}
}
