import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

let cubes = [];
const loader = new THREE.TextureLoader();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const sideRed = new THREE.MeshBasicMaterial({ map: loader.load('images/Red.png') });
const sideBlue = new THREE.MeshBasicMaterial({ map: loader.load('images/Blue.png') });
const sideGreen = new THREE.MeshBasicMaterial({ map: loader.load('images/Green.png') });
const sideYellow = new THREE.MeshBasicMaterial({ map: loader.load('images/Yellow.png') });
const sideOrange = new THREE.MeshBasicMaterial({ map: loader.load('images/Orange.png') });
const sideWhite = new THREE.MeshBasicMaterial({ map: loader.load('images/White.png') });
const sideNone = new THREE.MeshBasicMaterial({ color: 0x000000 });
const materials = [
    sideRed, sideBlue, sideGreen, sideYellow, sideOrange, sideWhite, sideNone
];

const fov = 45;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 50;

var canvas;
var renderer;
var gui;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;
camera.position.y = 3;
camera.rotation.x = -0.3;

const wholeCube = new THREE.Object3D();

const scene = new THREE.Scene();

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
}

scene.add(wholeCube);


window.setupScene = (c) => {
    alert(c);
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setClearColor(0x808080);
    gui = new GUI();

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
    cubes.push(makeCube(x, y, z, [rightSide, leftSide, topSide, bottomSide, frontSide, backSide]));
}

window.clearScene = () => {
    cubes.forEach((cube) => {
        cube.parent.remove(cube);
    });
    cubes = [];
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

function makeCube(x, y, z, sides) {
    const cube = new THREE.Mesh(geometry, sides);
    const twist = new THREE.Object3D();
    wholeCube.add(twist);
    twist.add(cube);
    cube.position.x = x * 1.02;
    cube.position.y = y * 1.02;
    cube.position.z = z * 1.02;
    return twist;
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

    const rot = time;
    wholeCube.rotation.y = rot * .2;

    //for (let c = 0; c < 9; c++) {
    //    cubes[c].rotation.x = rot * 1;
    //}

    //cubes.forEach((cube, ndx) => {
    //    const speed = .2 + ndx * .1;
    //    const rot = time * speed;
    //    cube.rotation.x = rot;
    //    cube.rotation.y = rot;
    //});

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}


