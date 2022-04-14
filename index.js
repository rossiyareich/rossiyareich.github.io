import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

window.addEventListener("resize", onWindowResize);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('#bg'),
  });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x02061c));
camera.position.setZ(3);
renderer.render(scene, camera);

const mtl = new MTLLoader();
var cookie;
mtl.load(
  'res/cookie1.mtl',
  function (creator) {
    creator.preload();
    const loader = new OBJLoader();
    loader.load(
      'res/cookie1.obj',
      function (object) {
        cookie = object;
        scene.add(cookie);
      }
    );
    loader.setMaterials(creator);
  }
);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
ambientLight.intensity = 5.0;
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(3, 3, 0);
pointLight.intensity = 5.0;

const controls = new OrbitControls(camera, renderer.domElement);
scene.add(ambientLight, pointLight);
Array(1000).fill().forEach(addStar);

animate();

function animate() {
  requestAnimationFrame(animate);

  if (cookie) {
    cookie.rotation.x += 0.01;
    cookie.rotation.y += 0.005;
    cookie.rotation.z += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.3, 24, 24);
  const material = new THREE.MeshStandardMaterial(
    {
      color: 0xFFFFFF,
    });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
  star.position.set(x, y, z);
  scene.add(star);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}