import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setClearColor(0xadd8e6, 1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);

renderer.render(scene, camera);

// Create the box
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const box = new THREE.Mesh(geometry, material);
box.position.z = -20;
scene.add(box);

// Create the box
const lidGeometry = new THREE.BoxGeometry(10, 1, 10);
const lidMaterial = new THREE.MeshStandardMaterial({ color: 0x2e5984 });
const lid = new THREE.Mesh(lidGeometry, lidMaterial);
lid.position.z = -20;
lid.position.y = 5.5;
scene.add(lid);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


const controls = new OrbitControls(camera, renderer.domElement);

// Fumo object setup
const fumoTexture = new THREE.TextureLoader().load("Fumo_Glasses.jpeg");

const fumo = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: fumoTexture })
);
scene.add(fumo);

fumo.position.z = -1;
// Nakano object setup
const nakano = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: fumoTexture })
);
scene.add(nakano);

nakano.position.x = 14;
nakano.position.z = 4;


// Confetti array
let confettiParticles = [];

// Function to create confetti
function createConfetti() {
  for (let i = 0; i < 100; i++) {
    const confettiGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const confettiMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    });
    const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);

    confetti.position.set(box.position.x, box.position.y, box.position.z);
    confetti.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 3,
      (Math.random() - 0.5) * 2
    );

    confettiParticles.push(confetti);
    scene.add(confetti);
  }
}

// Function to animate confetti
function animateConfetti() {
  confettiParticles.forEach((confetti, index) => {
    confetti.position.add(confetti.velocity);
    confetti.velocity.y -= 0.02; // Gravity effect

    // Remove confetti if it falls too low
    if (confetti.position.y < -10) {
      scene.remove(confetti);
      confettiParticles.splice(index, 1);
    }
  });
}

let boxOpened = false;

function addHearts() {
  const x = 0,
    y = 0;

  // Create the 2D heart shape
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  const extrudeSettings = {
    depth: 0.25,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // white heart
  const heart = new THREE.Mesh(geometry, material);

  heart.scale.set(0.05, -0.05, 0.05);

  // Random position for each heart
  const [px, py, pz] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  heart.position.set(px, py, pz);
  scene.add(heart);
}

Array(200).fill().forEach(addHearts);

// Move camera when scrolling
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  const scaledT = t / 100000;
  if (fumo.position.x >= -2.2) {
    fumo.position.x += -0.14;
  }

  if (nakano.position.x >= 2.2) {
    nakano.position.x += -0.18;
  } else if (nakano.position.x < 2.2 && nakano.position.z >= 0) {
    nakano.position.z += -0.18;
  }

  console.log(nakano.position.z)
  if (scaledT >= -0.02) {
    camera.position.z = 10 + t * -0.01;
    camera.position.y = t * -0.01;
  } else if (nakano.position.z >= 0) {
    nakano.rotation.y += 0.01
    fumo.rotation.y += -0.01
  } else if (!boxOpened) {
    boxOpened = true;
    lid.position.y += 5;
    createConfetti();
  } else {
    nakano.rotation.y += 0.04
    fumo.rotation.y += -0.04

  }
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  animateConfetti();

  renderer.render(scene, camera);
}
animate();
