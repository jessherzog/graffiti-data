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
      cube.position.z = 0;

      cube.updateMatrix();
      group.add(cube);

    }
}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();
    controls.update(delta);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);

    var d = new Date();
    var n = d.getMilliseconds();
    // console.log(n);
    // var skyColor = new THREE.Color(Math.sin(n*0.0003) + 0.4, Math.cos(n*0.0001) + 0.4, Math.sin(n*0.0002) + 0.4);
    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
