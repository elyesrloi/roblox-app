// ==========================================
// 1. INITIALISATION DE LA SCÈNE ET DU RENDU
// ==========================================
const container = document.getElementById('canvas-container') || document.body;

// Scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0d7ce); // Couleur de fond

// Caméra
const camera = new THREE.PerspectiveCamera(
  45, 
  container.clientWidth / container.clientHeight, 
  0.1, 
  1000
);
camera.position.set(0, 1.5, 5);

// Moteur de rendu WebGL
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// ==========================================
// 2. ÉCLAIRAGE
// ==========================================
// Lumière ambiante globale pour éclairer toutes les faces
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// Lumière directionnelle pour donner du relief et des ombres
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// ==========================================
// 3. CONTRÔLES DE CAMÉRA (Sourire / Tactile)
// ==========================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Effet d'inertie fluide
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0);

// ==========================================
// 4. CHARGEMENT DU MODÈLE (MTL + OBJ)
// ==========================================
const mtlLoader = new THREE.MTLLoader();

// Étape A: Chargement des matériaux (.mtl)
mtlLoader.load('avatar.mtl', (materials) => {
  materials.preload();

  // Étape B: Configuration du chargeur OBJ avec les matériaux
  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);

  // Étape C: Chargement du fichier géométrique (.obj)
  objLoader.load('avatar.obj', (object) => {

    // Calculate Bounding Box pour centrer et redimensionner automatiquement
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Re-centrage au point (0, 0, 0)
    object.position.x += (object.position.x - center.x);
    object.position.y += (object.position.y - center.y);
    object.position.z += (object.position.z - center.z);

    // Ajustement de l'échelle automatique
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2.5 / maxDim; // Modifier 2.5 pour agrandir ou réduire
      object.scale.set(scale, scale, scale);
    }

    // Ajout à la scène
    scene.add(object);
    console.log("Modèle 3D chargé avec succès !");

  }, 
  (xhr) => {
    // Suivi de la progression du chargement du OBJ
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(`Chargement OBJ : ${Math.round(percentComplete)}%`);
    }
  }, 
  (error) => {
    console.error("Erreur lors du chargement du fichier OBJ :", error);
  });

}, 
undefined, 
(error) => {
  console.error("Erreur lors du chargement du fichier MTL :", error);
});

// ==========================================
// 5. BOUCLE D'ANIMATION ET GESTION REDIMENSION
// ==========================================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Ajuster le rendu si l'écran ou la fenêtre change de taille
window.addEventListener('resize', () => {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});
