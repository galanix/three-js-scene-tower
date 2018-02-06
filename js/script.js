window.onload = function() {
	//render, scene, camera
	var width = window.innerWidth;
	var height = window.innerHeight;
	var scene = new THREE.Scene();	
	var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 5000);
	var quaternion = new THREE.Quaternion();
	camera.useQuaternion = true;
	// camera.quaternion.slerp();
	var render = new THREE.WebGLRenderer({antialias: true});
	render.setSize(window.innerWidth, window.innerHeight);
	render.setClearColor(0x000000);	
	document.body.appendChild(render.domElement);
	var projector = new THREE.Projector(), 
	    mouse_vector = new THREE.Vector3(),
	    mouse = { x: 0, y: 0, z: 1 },
	    ray = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) ),
	    intersects = []; 

	// AXES HELPER
	var axesHelper = new THREE.AxesHelper( 50);
	scene.add( axesHelper );

var dir = new THREE.Vector3( 1, 2, 0 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

var origin = new THREE.Vector3( 0, 0, 0 );
var length = 1;
var hex = 0xffff00;

var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );

	//CAMERA POSITION
	camera.position.x = 140;
	camera.position.y = 50;
	camera.position.z = 100;




	//LOADERS 
	var manager = new THREE.LoadingManager();
	var loader = new THREE.ImageLoader(manager);
	var textureLoader = new THREE.TextureLoader();
	var objLoader = new THREE.OBJLoader();
	
	// GRASS FLOOR
	var grassTexture = new THREE.Texture();
	// TOWER TEXTURE
	var towerTexture = new THREE.Texture();


loader.load("/model/textures/grass-background-6.jpg", function(image){
		grassTexture.image = image;
		grassTexture.needsUpdate = true;
		grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
		grassTexture.offset.set(0,0);
		grassTexture.repeat.set(5,5);
	});



	//add grass floor to the scene
	var geometry = new THREE.PlaneGeometry( 500, 500, 32 );
	var material = new THREE.MeshPhongMaterial( { map: grassTexture, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	plane.rotation.x = Math.PI/2;
	scene.add( plane );

// CUBE MATERIALS
var materials = [
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/posx.jpg'),
           side: THREE.BackSide
       }),
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/negx.jpg'),
           side: THREE.BackSide
       }),
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/posy.jpg'),
           side: THREE.BackSide
       }),
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/negy.jpg'),
           side: THREE.BackSide
       }),
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/posz.jpg'),
           side: THREE.BackSide
       }),
       new THREE.MeshLambertMaterial({
           map: textureLoader.load('cube_images/negz.jpg'),
           side: THREE.BackSide,
           depthWrite: false
       })
    ];
    console.log(materials);
    var boxGeo = new THREE.BoxGeometry(562, 562, 562, 1, 1, 1);
    var dice = new THREE.Mesh(boxGeo, materials);
    // var dice = new THREE.Mesh( geometry, materials );
		group = new THREE.Group();
	  group.add(dice);
		scene.add(group);


		// LIGHTS
		var ambient = new THREE.AmbientLight( 0xffffff );
		group.add( ambient );
		pointLight = new THREE.PointLight( 0xffffff, 2 );
		group.add( pointLight );


	//LOADING TOWER TEXTURES
	loader.load("model/textures/Wood_Tower_Col.jpg", function(image) {
		towerTexture.image = image;
		towerTexture.needsUpdate = true;
	});	

	var normalTowerTexture = loader.load("model/textures/Wood_Tower_Nor.jpg", function(image){
			normalTowerTexture.image = image;
			normalTowerTexture.needsUpdate = true;
	});

	//LOADING CASTLE TEXTURES
	var castleTexture = new THREE.Texture();
 	loader.load("model/Castle/tex/DSC_2334.JPG", function(image){
		castleTexture.image = image;
		castleTexture.needsUpdate = true;
		castleTexture.wrapS = castleTexture.wrapT = THREE.RepeatWrapping;
		castleTexture.offset.set(0,0);
		castleTexture.repeat.set(1,1);
	});

	// console.log(castleTexture);







	var meshes = [];
	var castle_meshes = [];
	//LOAD TOWER OBJ TO THE SCENE
	objLoader.load("model/wooden_watch_tower2.obj", function (object){
		// console.log(object);
		object.traverse(function( child ){
			if( child instanceof THREE.Mesh ){
				meshes.push(child);
			}
		});

		var WoodenHouse = meshes[0];

		
		
		pointLight.add(WoodenHouse);
		
		WoodenHouse.material = new THREE.MeshPhongMaterial({
			color: 0xaaaaaa,
		  shininess: 20,
			map: towerTexture,
			normalMap: normalTowerTexture
			// wireframe: true
		});
		WoodenHouse.position.y = -4;
		WoodenHouse.scale.set(6,6,6);
		scene.add(WoodenHouse);
	
// window.addEventListener( 'mousemove', onDocumentMouseMove, false );
	});
var groupCastle = new THREE.Object3D();//create an empty container

	//LOAD CASTLE TO THE SCENE
	objLoader.load("model/Castle/Castle.obj", function(object, materials){
			
			var material2 = new THREE.MeshPhongMaterial({map: castleTexture});
		
			object.traverse(function( child ){
				if( child instanceof THREE.Mesh ){
					// var materials = child.material.materials;
					child.material = material2;
					// materials.map = castleTexture;
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

				object.position.x = 120;
				object.position.z = 120;
				object.position.y = 0;
				object.scale.set(0.07, 0.07, 0.07);

				scene.add(object);
				// groupCastle.add(castleMesh);
		});
	
	var barrelTexture = new THREE.Texture();
loader.load("model/test_barrel/barrel.jpg", function(image){
		barrelTexture.image = image;
		barrelTexture.needsUpdate = true;
		barrelTexture.wrapS = castleTexture.wrapT = THREE.RepeatWrapping;
		barrelTexture.offset.set(0,0);
		barrelTexture.repeat.set(1,1);
});
var kek = [];
for(var i = 5; i < 9; i++){

objLoader.load("model/test_barrel/barrelkekkek.obj", function(object, materials){
				var material2 = new THREE.MeshPhongMaterial({ shininess: 20,map: barrelTexture});
				console.log(object);

				object.traverse(function( child ){
								if( child instanceof THREE.Mesh ){
									// var materials = child.material.materials;
									child.material = material2;
									// materials.map = castleTexture;
									child.castShadow = true;
									child.receiveShadow = true;
								}
							});

								object.position.x = Math.floor((Math.random() * 70) + 1) * i;
								object.position.z = Math.floor((Math.random() * 70) + 1) * i;
								object.position.y = 0;
								console.log(object.position);
								object.scale.set(3, 3, 3);
								scene.add(object);
});
}


objLoader.load("model/test_barrel/blue_barrel_ready.obj", function(object, materials){
				var material2 = new THREE.MeshPhongMaterial({ shininess: 20, color: 0x0000ff});
				console.log(object);

				object.traverse(function( child ){
								if( child instanceof THREE.Mesh ){
									// var materials = child.material.materials;
									child.material = material2;
									// materials.map = castleTexture;
									child.castShadow = true;
									child.receiveShadow = true;
								}
							});

								object.position.x = -150;
								object.position.z = -150;
								object.position.y = 0;
								console.log(object.position);
								object.scale.set(3, 3, 3);
								scene.add(object);
});



	//FOREST

// Helper function to transform the vertices and faces
function newTreeGeometry(tree, isTwigs) {
  var output = new THREE.Geometry();

  tree[ isTwigs ? 'vertsTwig' : 'verts'].forEach(function(v) {
    output.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
  });

  var uv = isTwigs ? tree.uvsTwig : tree.UV;
  tree[ isTwigs ? 'facesTwig' : 'faces'].forEach(function(f) {
    output.faces.push(new THREE.Face3(f[0], f[1], f[2]));
    output.faceVertexUvs[0].push(f.map(function(v) {
      return new THREE.Vector2(uv[v][0], uv[v][1]);
    }));
  });

  output.computeFaceNormals();
  output.computeVertexNormals(true);

  return output;
}

var treesTexture = new THREE.Texture();

 	loader.load("model/Trees/tree_texture.jpg", function(image){
		treesTexture.image = image;
		treesTexture.needsUpdate = true;
		treesTexture.wrapS = treesTexture.wrapT = THREE.RepeatWrapping;
		// castleTexture.offset.set(0,0);
		// castleTexture.repeat.set(1,1);
	});



for(var i = -40; i <= 40; i+=1){
	if(i == 0) continue;
var myTree = new Tree({
		"seed": 262,
		"segments": 6,
		"levels": 5,
		"vMultiplier": 2.36,
		"twigScale": 0.39,
		"initalBranchLength": 0.49,
		"lengthFalloffFactor": 0.85,
		"lengthFalloffPower": 0.99,
		"clumpMax": 0.454,
		"clumpMin": 0.404,
		"branchFactor": 2.45,
		"dropAmount": -0.1,
		"growAmount": 0.235,
		"sweepAmount": 0.01,
		"maxRadius": 0.139,
		"climbRate": 0.371,
		"trunkKink": 0.093,
		"treeSteps": 5,
		"taperRate": 0.947,
		"radiusFalloffRate": 0.73,
		"twistRate": 3.02,
		"trunkLength": 2.8});

var trunkGeo = newTreeGeometry(myTree);
var trunkMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd, wireframe: false, map:treesTexture, shininess: 20 } );
var trunkMesh = new THREE.Mesh(trunkGeo, trunkMaterial);
trunkMesh.position.x = -Math.floor((Math.random() * 10) + 1) * i;
trunkMesh.position.z = Math.floor((Math.random() * 10) + 1) * i;
trunkMesh.scale.set(5,5,5);
scene.add(trunkMesh); // Use your own scene
}





// var twigsGeo = newTreeGeometry(myTree, true);
// var twigsMaterial = new THREE.MeshLambertMaterial( { color: 0x999999, wireframe: false } );
// var twigsMesh = new THREE.Mesh(twigsGeo, twigsMaterial);
// scene.add(twigsMesh); // Use your own scene

	var objects = [];
	var geometry = new THREE.BoxGeometry(30,30,30);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff});
	for(var i = -2; i <= 2; i++){
		if(i == 0) continue;
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		console.log(cube);
		var divider = i/(i);
		console.log(divider);

		if(i == 1 || i == -1){
		cube.position.x = i * 200;
		cube.position.z = -i * 200;
	}else{
		cube.position.x = i * 100;
		cube.position.z = i * 100;		
	}

		cube.position.y  = 15;

		cube.scale.set(1,1,1);
		objects.push(cube);
	}


	// ORBIT CONTROLS 
	var controls = new THREE.OrbitControls(camera);
		controls.autoRotate = true;
		controls.autoRotateSpeed = 2;
		controls.enableKeys = true;
		// controls.keys = {
		//   LEFT: 37, //left arrow
		//   UP: 38, // up arrow
		//   RIGHT: 39, // right arrow
		//   BOTTOM: 40 // down arrow
		// }
		// controls.minDistance = 100;
		// controls.maxDistance = 400;
		// controls.minPolarAngle = -Math.PI;
 var btn = document.getElementById("autorotate");
 btn.addEventListener("click", function(){
 		controls.autoRotate = true;
 		controls.autoRotateSpeed = 2;
 		btn.style.display = "none";
 });

// find intersections
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var count = 0;
// mouse listener
document.addEventListener( 'mousedown', function( event ) {
    
    // For the following method to work correctly, set the canvas position *static*; margin > 0 and padding > 0 are OK
    mouse.x = ( ( event.clientX - render.domElement.offsetLeft ) / render.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - render.domElement.offsetTop ) / render.domElement.clientHeight ) * 2 + 1;
    
    // For this alternate method, set the canvas position *fixed*; set top > 0, set left > 0; padding must be 0; margin > 0 is OK
    //mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
    //mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
    		var intersectedOBJ = intersects[0].object;
        camera.lookAt(intersectedOBJ.position);
        console.log(intersectedOBJ.position);
        console.log('INTERSECT Count: ' + ++count);
        var destination = intersectedOBJ.position;
     			camera.position.x = destination.x;
					camera.position.y = destination.y;
					camera.position.z = destination.z;
					camera.position.set( destination.x, destination.y, destination.z );
					controls.autoRotate = false;
					btn.style.display = "block";
    }

}, false );




	//RENDERER
	var rendering = function(){
		
		controls.update();

		render.render(scene,camera);
		requestAnimationFrame(rendering);
	};

	rendering();


}