var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 400000;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var cube;
var group;
var sphere;
var pointLight = new THREE.PointLight(0xFFFFFF);
var mouseX = 0;
var mouseY = 0;

// data
var scale = 150;

var maxXcordinate = 0;
var minXcordinate = 999999999;
var maxYcordinate = 0;
var minYcordinate = 999999999;

var rangeX;
var rangeY;

for (var i = 0; i < graffitData.length; i++) {
  if (graffitData[i][1] != null && graffitData[i][2] != null) {
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
}


function init() {

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    rangeX = maxXcordinate - minXcordinate;
    rangeY = maxYcordinate - minYcordinate;

    console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
    console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);

    createCube();

    pointLight.position.z = 10;
    camera.position.z = 200;

    scene.add(group);
    scene.add(pointLight);
    scene.add(camera);

    console.log(rangeX, rangeY);

    // console.log(graffitData);
    // console.log(graffitData[600])0
}

function createCube() {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    for (var i = 0; i < geometry.faces.length; i += 2) {
        // var hex = Math.random()+0.5 * 0xCCCCCC;
        var hex =  0xCCCCCC + i/geometry.faces.length;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
    }
    var material = new THREE.MeshStandardMaterial({
        vertexColors: THREE.FaceColors,
        wireframe: false
    });
    group = new THREE.Group();

    for (var i = 0; i < graffitData.length; i++) {

      if (graffitData[i][1] != null && graffitData[i][2] != null) {
        cube = new THREE.Mesh(geometry, material);
        cube.position.x = (parseInt(graffitData[i][1]) - minXcordinate)/scale - rangeX/scale/2;
        cube.position.y = (parseInt(graffitData[i][2]) - minYcordinate)/scale - rangeY/scale/2;
        cube.position.z = 0;

        cube.updateMatrix();
        group.add(cube);
      }

    }
}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    camera.rotation.y -= mouseX * 0.00005;
    camera.rotation.x -= mouseY * 0.00005;

    var d = new Date();
    var n = d.getMilliseconds();
    // console.log(n);
    // var skyColor = new THREE.Color(Math.sin(n*0.0003) + 0.4, Math.cos(n*0.0001) + 0.4, Math.sin(n*0.0002) + 0.4);
    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);

    if (charStr == "w" || charStr == "W") {
        camera.position.z -= 2.0;
    }
    if (charStr == "s" || charStr == "S") {
        camera.position.z += 2.0;
    }
    if (charStr == "a" || charStr == "A") {
        camera.position.x -= 2.0;
    }
    if (charStr == "d" || charStr == "D") {
        camera.position.x += 2.0;
    }
};

init();
animatedRender();
