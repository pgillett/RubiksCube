import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
//import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

const loader = new THREE.TextureLoader();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const sideRed = new THREE.MeshPhongMaterial({ map: loader.load('images/Red.png') });
const sideBlue = new THREE.MeshPhongMaterial({ map: loader.load('images/Blue.png') });
const sideGreen = new THREE.MeshPhongMaterial({ map: loader.load('images/Green.png') });
const sideYellow = new THREE.MeshPhongMaterial({ map: loader.load('images/Yellow.png') });
const sideOrange = new THREE.MeshPhongMaterial({ map: loader.load('images/Orange.png') });
const sideWhite = new THREE.MeshPhongMaterial({ map: loader.load('images/White.png') });
const sideNone = new THREE.MeshBasicMaterial({ color: 0x000000 });
const materials = [
    sideRed, sideBlue, sideGreen, sideYellow, sideOrange, sideWhite, sideNone
];

const fov = 35;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 50;

var canvas;
var renderer;
var gui;

var showBack = false;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

const wholeCube = new THREE.Object3D();
wholeCube.rotation.x = 0.3;
wholeCube.rotation.y = -0.2;
wholeCube.position.x = -2;

const wholeCubeBack = new THREE.Object3D();
wholeCubeBack.rotation.x = 3.44;
wholeCubeBack.rotation.y = -0.2;
wholeCubeBack.position.x = 3;
wholeCubeBack.position.z = -4;

const scene = new THREE.Scene();

{
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(0, 0, 10);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 0.3;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 0, 10);
    scene.add(light);
}

scene.add(wholeCube);
scene.add(wholeCubeBack);

var cubes = [];

var rotating = null;

window.setupScene = (c) => {
    canvas = c;
    renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setClearColor(0x808080);
//    gui = new GUI();

    requestAnimationFrame(render);

}

// Right 0
// Left 1
// Top 2
// Bottom 3
// Front 4
// Back 5

window.addPiece = (x, y, z, colour) => {
    const rightSide = getColour(colour[0]);
    const leftSide = getColour(colour[1]);
    const topSide = getColour(colour[2]);
    const bottomSide = getColour(colour[3]);
    const frontSide = getColour(colour[4]);
    const backSide = getColour(colour[5]);
    const ci = cubeIndex(x, y, z);
    makeCube(ci, x, y, z, [rightSide, leftSide, topSide, bottomSide, frontSide, backSide]);
}

window.clearScene = (back) => {
    cubes.forEach((cube) => {
        cube.parent.remove(cube);
    });
    cubes = [];
    showBack = back;

    if (showBack) {
        wholeCube.rotation.x = 0.3;
        wholeCube.rotation.y = -0.2;
        wholeCube.position.x = -2;
    } else {
        wholeCube.rotation.x = 0.3;
        wholeCube.rotation.y = 0.3;
        wholeCube.position.x = 0;
    }
}

window.rotate = (fx, fy, fz, tx, ty, tz, xr, yr, zr, callBack) => {
    rotating = {
        fromX: fx,
        fromY: fy,
        fromZ: fz,
        toX: tx,
        toY: ty,
        toZ: tz,
        rotateX: xr,
        rotateY: yr,
        rotateZ: zr,
        time: 0,
        callBack: callBack
    }
}

function cubeIndex(x, y, z) {
    var ci = (((z + 1) * 3 + (y + 1)) * 3 + x + 1);
    return showBack ? ci * 2 : ci;
}

function getColour(colour) 
{
    if (colour == "O") return sideOrange;
    if (colour == "R") return sideRed;
    if (colour == "W") return sideWhite;
    if (colour == "Y") return sideYellow;
    if (colour == "B") return sideBlue;
    if (colour == "G") return sideGreen;
    return sideNone;
}

function makeCube(ci, x, y, z, sides) {
    {
        const cube = new THREE.Mesh(geometry, sides);
        const twist = new THREE.Object3D();
        wholeCube.add(twist);
        twist.add(cube);
        cube.position.x = x * 1.02;
        cube.position.y = y * 1.02;
        cube.position.z = z * 1.02;
        cubes[ci] = twist;
    }

    if(showBack)
    {
        const cube = new THREE.Mesh(geometry, sides);
        const twist = new THREE.Object3D();
        wholeCubeBack.add(twist);
        twist.add(cube);
        cube.position.x = x * 1.02;
        cube.position.y = y * 1.02;
        cube.position.z = z * 1.02;
        cubes[ci + 1] = twist;
    }
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render(time) {
    time *= 0.001;  // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    if (rotating != null) {
        if (rotating.time == 0) {
            rotating.time = time;
        }
        var pieceRotDeg = Math.min((time - rotating.time) * 2 * 90, 90);
        var pieceRot = pieceRotDeg * Math.PI / 180;
        for (let x = rotating.fromX; x <= rotating.toX; x++) {
            for (let y = rotating.fromY; y <= rotating.toY; y++) {
                for (let z = rotating.fromZ; z <= rotating.toZ; z++) {
                    var ci = cubeIndex(x, y, z);
                    for(let i=0; i<(showBack ? 2 : 1); i++) {
                        cubes[ci+i].rotation.x = rotating.rotateX * pieceRot;
                        cubes[ci+i].rotation.y = rotating.rotateY * pieceRot;
                        cubes[ci+i].rotation.z = rotating.rotateZ * pieceRot;
                    }
                }
            }
        }
        if (pieceRotDeg == 90) {
            rotating.callBack.invokeMethodAsync('RotateComplete');
            rotating = null;
        }
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}


