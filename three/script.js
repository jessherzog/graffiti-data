

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

var scale = 400;

var maxXcordinate = 0;
var minXcordinate = 999999999;
var maxYcordinate = 0;
var minYcordinate = 999999999;

var rangeX;
var rangeY;

for (var i = 0; i < graffitData.length; i++) {
  if (graffitData[i][9] != null && graffitData[i][9] != null) {
    if (maxXcordinate < parseInt(graffitData[i][9])) {
      maxXcordinate = parseInt(graffitData[i][9]);
    }
    if (minXcordinate > parseInt(graffitData[i][9])) {
      minXcordinate = parseInt(graffitData[i][9]);
    }
    if (maxYcordinate < parseInt(graffitData[i][10])) {
      maxYcordinate = parseInt(graffitData[i][10]);
    }
    if (minYcordinate > parseInt(graffitData[i][10])) {
      minYcordinate = parseInt(graffitData[i][10]);
    }
  }
}


function init() {

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    createCube();
    console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
    console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);

    rangeX = maxXcordinate - minXcordinate;
    rangeY = maxYcordinate - minYcordinate;

    scene.add(group);
    scene.add(pointLight);
    camera.position.z = 300;
    camera.position.x = rangeX/2/scale;
    camera.position.y = rangeY/2/scale;
    scene.add(camera);


    console.log(rangeX, rangeY);

    // console.log(graffitData);
    // console.log(graffitData[600]);
    // console.log(graffitData[600][8]);
    // console.log(graffitData[600][9]);
    // console.log(graffitData[600][10]);


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

      if (graffitData[i][9] != null && graffitData[i][9] != null) {
        cube = new THREE.Mesh(geometry, material);
        // cube.position.x = Math.random() * 2000 - 1000;
        // cube.position.y = Math.random() * 2000 - 1000;
        cube.position.x = (parseInt(graffitData[i][9]) - minXcordinate)/scale;
        cube.position.y = (parseInt(graffitData[i][10]) - minYcordinate)/scale;
        cube.position.z = 0;

        // console.log(parseInt(graffitData[i][9]), minXcordinate, parseInt(graffitData[i][9]) - minXcordinate);


        // cube.scale.z = Math.random() * 30;
        // cube.scale.set(Math.random(), Math.random(), 1.0);
        cube.updateMatrix();
        group.add(cube);
      }

    }

    // console.log(group);
}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    // console.log("mouseX: " + mouseX);
    // console.log("mouseY: " + mouseY);
    camera.rotation.y -= (mouseX - camera.position.x) * 0.00005;
    camera.rotation.x += (-mouseY - camera.position.y) * 0.0001;

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
