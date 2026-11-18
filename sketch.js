import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 描画先の要素
const container = document.getElementById('three-canvas');

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
const geometry = new THREE.BoxGeometry(2, 2, 2, 16);
const material = new THREE.MeshLambertMaterial({ color: 0x55ffff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
    mesh.rotation.x += 0;
    mesh.rotation.y += 0;
    controls.update();
    renderer.render(scene, camera);
});