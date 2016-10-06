var camera, scene,renderer;
var cube,group;
var pointLight;

var scale = 150; //   scale/n

// data statistics
var maxXcordinate = 0;
var minXcordinate = 999999999;
var maxYcordinate = 0;
var minYcordinate = 999999999;
var middleX;
var middleY;

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {
    var viewAngle = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 400000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    // calculate statistics
    for (var i = 0; i < graffitData.length; i++) {
      if (maxXcordinate < parseInt(graffitData[i][1])) {
        maxXcordinate = parseInt(graffitData[i][1]);
      }
      if (minXcordinate > parseInt(graffitData[i][1])) {
        minXcordinate = parseInt(graffitData[i][1]);
      }
      if (maxYcordinate < parseInt(graffitData[i][2])) {
        maxYcordinate = parseInt(graffitData[i][2]);
      }
      if (minYcordinate > parseInt(graffitData[i][2])) {
        minYcordinate = parseInt(graffitData[i][2]);
      }
    }

    middleX = maxXcordinate - minXcordinate;
    middleY = maxYcordinate - minYcordinate;

    console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
    console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);

    createCubes();
    createLines();

    pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.z = 10;
    camera.position.z = 200;

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 40;
    controls.domElement = container;
    controls.rollSpeed = 0.3;
    controls.autoForward = false;
    controls.dragToLook = false;

    scene.fog = new THREE.Fog(0xffffff, near, 600);

    scene.add(group);
    scene.add(pointLight);
    scene.add(camera);

    // console.log(graffitData);
    // console.log(graffitData[600])0
}

function createLines() {
  var geometry = new THREE.BufferGeometry();
	var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
	var positions = new Float32Array( graffitData.length * 3 );
	var colors = new Float32Array( graffitData.length * 3 );

  for ( var i = 0; i < graffitData.length; i ++ ) {
			var x = ((parseInt(graffitData[i][1]) - minXcordinate) - middleX/2)/scale;
			var y = ((parseInt(graffitData[i][2]) - minYcordinate) - middleY/2)/scale;
			var z = Math.random()*20 - 20;
			// positions
			positions[ i * 3 ] = x;
			positions[ i * 3 + 1 ] = y;
			positions[ i * 3 + 2 ] = z;
			// colors
			colors[ i * 3 ] = 0.8;
			colors[ i * 3 + 1 ] = 0.8;
			colors[ i * 3 + 2 ] = 0.8;
		}

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    mesh1 = new THREE.Line( geometry, material );
		scene.add( mesh1 );
}

function createCubes() {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
        vertexColors: THREE.FaceColors,
        wireframe: false
    });
    group = new THREE.Group();

    for (var i = 0; i < graffitData.length; i++) {

      cube = new THREE.Mesh(geometry, material);
      cube.position.x = ((parseInt(graffitData[i][1]) - minXcordinate) - middleX/2)/scale;
      cube.position.y = ((parseInt(graffitData[i][2]) - minYcordinate) - middleY/2)/scale;
      cube.position.z = Math.random()*20;

      cube.updateMatrix();
      group.add(cube);

    }
}

function animatedRender() {
    requestAnimationFrame(animatedRender);

    // just for fly controls
    var delta = clock.getDelta();
    controls.update(delta);

    renderer.render(scene, camera);

    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
