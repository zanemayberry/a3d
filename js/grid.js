// We want bright colors only for our cubes!
var ColorBytes = ["99", "aa", "bb", "cc", "dd", "ee", "ff"];

class Grid {
	constructor(x, y, z) {
		this._obj = new THREE.Object3D();
		this._lenX = x;
		this._lenY = y;
		this._lenZ = z;
		this._grid = {};
	}

	add(x, y, z) {
		var str = ""+x+","+y+","+z;
		var cube = this._createCube(x, y, z);
		this._grid[str] = cube;
		this._obj.add(cube);
	}

	remove(x, y, z) {
		var str = ""+x+","+y+","+z;
		var cube = this._grid[str];
		delete this._grid[str];
		if (cube) {
			this._obj.remove(cube);
		}
	}

	get obj() {
		return this._obj;
	}

	_createCube(x, y, z) {
		var color = "#";
		for (var i = 0; i < 3; i++) {
			color += ColorBytes[Math.floor(Math.random() * 7)];
		}

		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshLambertMaterial({
			vertexColors: THREE.FaceColors,
			shading: THREE.FlatShading,
			polygonOffset: true,
			polygonOffsetUnits: 1,
			polygonOffsetFactor: 1,
		});

		for (var i = 0; i < geometry.faces.length; i++) {
			geometry.faces[i].color = new THREE.Color(color);
		}

		var cube = new THREE.Mesh(geometry, material);
		var wireCube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true }));
	
		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;
		cube.add(wireCube);

		return cube;
	}
}
