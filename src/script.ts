import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import $ from "jquery";

/**
 * Base
 */
// Debug
//const gui = new GUI({
//    width: 400,
//});

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const modelNames = ["cassettiera", "divano", "frigorifero", "lavandino", "lavatrice", "piano", "tv"];
const loadedModels: { [key: string]: THREE.Group } = {};
let currentModel: THREE.Group | null = null;

modelNames.forEach((model) => {
    gltfLoader.load("models/" + model + ".glb", (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.visible = false;
        scene.add(loadedModel);
        loadedModels[model] = loadedModel;

        if (model === modelNames[0]) {
            loadedModel.visible = true;
            currentModel = loadedModel;
        }
    });
});

const showModel = (model: string) => {
    if (currentModel) {
        currentModel.visible = false;
    }

    const newModel = loadedModels[model];
    if (newModel) {
        newModel.visible = true;
        currentModel = newModel;
    }
};

$(() => {
    $('input[name="model"]').on("change", () => {
        const selectedModel = $('input[name="model"]:checked').val() as string;

        showModel(selectedModel);
    });
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
//const sizes = {
//    width: window.innerWidth,
//    height: window.innerHeight,
//};
const sizes = {
    width: 800,
    height: 600,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    if (currentModel) {
        currentModel.rotation.y = elapsedTime;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
