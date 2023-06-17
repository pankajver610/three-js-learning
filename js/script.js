import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import nebula from '../images/nebula.jpg';
import stars from '../images/stars.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(100, window.innerWidth/ window.innerHeight, 0.1, 1000);

const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 30, 30);
orbit.update();



// Added the plane geometry
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({color: '#FFFFFF', side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.receiveShadow = true;

plane.rotation.x = -Math.PI / 2;
const gridHelper = new THREE.GridHelper(30, 30);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50); 
const sphereMaterial = new THREE.MeshStandardMaterial({color: '#ff0000', wireframe: true, side: THREE.DoubleSide});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;

 sphere.position.set(0, 0, 0);

 const ambientLight = new THREE.AmbientLight(0x333333);
 scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 12;

directionalLight.position.set(30, 50, 0);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);
const dLightShadowHelper  = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);


const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
 
const TextureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars, 
    stars, 
    stars, 
    stars, 
]);

 const gui = new dat.GUI();
 const options = {
    sphereColor: '#ffea00',
    wireframe: true,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
 }

 // Added the box geometry
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const boxMaterial = new THREE.MeshBasicMaterial({ map: TextureLoader.load(nebula)});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(8, 15, 0);
box.castShadow = true;

 gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
 })
 gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e;
 })
 gui.add(options, 'speed', 0, 0.1);
 gui.add(options, 'angle', 0, 1);
 gui.add(options, 'penumbra', 0, 1);
 gui.add(options, 'intensity', 0, 1);


scene.add(box); 
scene.add(plane);
scene.add(gridHelper);
scene.add(sphere);

let step = 0;
 
let mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(ev) {
     mousePosition.x = (ev.clientX / window.innerWidth) * 2 - 1;
     mousePosition.y = -(ev.clientY / window.innerWidth) * 2 + 1;
})

const rayCoster = new THREE.Raycaster(); 

function animate(time) {
    box.rotation.x = time/ 1000;
    box.rotation.y = time/ 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.cos(step));
    spotLight.penumbra = options.penumbra;
    spotLight.angle = options.angle;
    spotLight.intensity = options.intensity;
    
    spotLightHelper.update();  

    rayCoster.setFromCamera(mousePosition, camera);
    const intersects = rayCoster.intersectObjects(scene.children);
    
    intersects.forEach((intersect)=> {
        if(intersect.object.id === box.id) {
            intersect.object.material.color.set(0xFF0000);
        }
    })
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});