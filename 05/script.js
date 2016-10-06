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

// for storing variables that need to refered to later
var groupNotebook = [];

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
    camera.position.z = 100;

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 40;
    controls.domElement = container;
    controls.rollSpeed = 0.3;
    controls.autoForward = false;
    controls.dragToLook = false;

    scene.fog = new THREE.Fog(0xffffff, near, 400);

    scene.add(group);
    scene.add(pointLight);
    scene.add(camera);

    // console.log(graffitData);
    // console.log(graffitData[600])0
}

function createCubes() {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
        opacity: 0.4,
        transparent: true,
        vertexColors: THREE.FaceColors,
        wireframe: false
    });
    group = new THREE.Group();

    for (var i = 0; i < graffitData.length; i++) {

      cube = new THREE.Mesh(geometry, material);
      cube.position.x = ((parseInt(graffitData[i][1]) - minXcordinate) - middleX/2)/scale;
      cube.position.y = ((parseInt(graffitData[i][2]) - minYcordinate) - middleY/2)/scale;
      var positionZ = Math.random()*30;
      cube.position.z = positionZ;

      cube.rotation.x = Math.PI * Math.random();
      cube.rotation.y = Math.PI * Math.random();
      cube.rotation.z = Math.PI * Math.random();

      groupNotebook.push({
        posZ : positionZ
      });

      cube.updateMatrix();
      group.add(cube);

    }

}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();

    // fly over control
    controls.update(delta);
    renderer.render(scene, camera);

    // get current date in milliseconds
    var t = Date.now();

    // update cubes
    for (var i = 0; i < group.children.length; i++) {

      group.children[i].rotation.x += 0.01;
      group.children[i].rotation.y += 0.01;
      group.children[i].rotation.y += 0.01;

      group.children[i].position.z = groupNotebook[i].posZ * Math.abs(Math.cos(t/2000));
    }

    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Aceleromtere stuff
var onOrientationChange = function(data) {
  console.log("DEVICE DATA UPDATE!", data);

  camera.rotation.z = data.alpha/100;
  camera.rotation.x = data.beta/100;
  camera.rotation.y = data.gamma/100;

  var output = document.getElementById("data-output");
  output.innerHTML = "ALPHA: " + data.alpha + "<br>BETA: " + data.beta + "<br>GAMMA: " +  data.gamma;
}

if(window.DeviceOrientationEvent) {
  console.log("YES!");
  window.addEventListener('deviceorientation', onOrientationChange, false);
} else {
  console.log("NOPE!");
}
