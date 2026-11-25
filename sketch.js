
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 描画先の要素
const container = document.getElementById('three-canvas');

//重力
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.82,0),
});
const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(10, 0.01, 10)),
    material: new CANNON.Material({ restitution: 0.5 }),
});
world.addBody(groundBody);

//シーンとカメラ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

//レンダラー（背景透過・アンチエイリアスあり）
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

//光（平行光源と環境光）
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//物体（ジオメトリ＋マテリアル＝メッシュ）
const cannonDebugger = new CannonDebugger(scene, world)
const geometry1 = new THREE.BoxGeometry(2, 2, 2, 1);
const geometry2 = new THREE.BoxGeometry(1.2, 1.2, 1.2, 1);
const material1 = new THREE.MeshLambertMaterial({ color: 0x55ffff });
const material2 = new THREE.MeshLambertMaterial({ color: 0xff9f43 });
const r1 = new THREE.Mesh(geometry1, material1);
const r2 = new THREE.Mesh(geometry2, material2);

const body1 = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
body1.position.set(-1.8, 4, 0);

const body2 = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.6, 0.6, 0.6)),
});
body2.position.set(1.8, 6, 0);

world.addBody(body1);
world.addBody(body2);
scene.add(r1, r2);

//マウスやタッチで視点を回せるようにする
const controls = new OrbitControls(camera, renderer.domElement);

//画面サイズが変わったときの処理
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//毎フレームの処理
renderer.setAnimationLoop(() => {
    world.step(1/60);

    r1.position.copy(body1.position);
    r1.quaternion.copy(body1.quaternion);
    r2.position.copy(body2.position);
    r2.quaternion.copy(body2.quaternion);

    cannonDebugger.update();
    controls.update();
    renderer.render(scene, camera);
});