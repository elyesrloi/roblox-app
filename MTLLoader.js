// 1. Instanciation du MTLLoader
const mtlLoader = new THREE.MTLLoader();

// Définir le dossier des textures si elles sont dans un sous-dossier (optionnel)
// mtlLoader.setPath('textures/');

mtlLoader.load('avatar.mtl', (materials) => {
  // Précharger les matériaux
  materials.preload();

  // 2. Instanciation du OBJLoader et application des matériaux
  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);

  // 3. Chargement du fichier .obj
  objLoader.load('avatar.obj', (object) => {
    
    // Facultatif : Recentrer le modèle 3D
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

    // Ajout du modèle à la scène
    scene.add(object);

  }, 
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% chargé');
  }, 
  (error) => {
    console.error('Erreur lors du chargement de OBJ :', error);
  });

}, 
undefined, 
(error) => {
  console.error('Erreur lors du chargement du MTL :', error);
});
