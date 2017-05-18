// ZANETODO: this class doesn't really work
// just here temporarily to clean up game.js
// until I have anything to actually load.
class Loader {
	constructor() {
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.setPreferredShading(THREE.SmoothShading);
		loader.load(
			'resources/models/teepee.dae',
			function(collada) {
				var teepee = collada.scene.children[0];
				teepee.traverse (function(child) {
					if (child instanceof THREE.Mesh) {
						// child.castShadow = true;
					}
				});
				teepee.position.z += 5;
				teepee.position.y += .5;
				// teepee.castShadow = true;
				self._scene.add(teepee);
				console.log(teepee);
			}
		);
	}
}
