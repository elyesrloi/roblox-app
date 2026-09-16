// Exemple de logique de rotation d'objet (ex: Three.js / JavaScript)
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const modalContainer = document.getElementById('interface-image2');

modalContainer.addEventListener('mousedown', () => { isDragging = true; });
modalContainer.addEventListener('mouseup', () => { isDragging = false; });

modalContainer.addEventListener('mousemove', (e) => {
  const deltaMove = {
    x: e.clientX - previousMousePosition.x,
    y: e.clientY - previousMousePosition.y
  };

  if (isDragging) {
    // Rotation horizontale (droite / gauche)
    characterModel.rotation.y += deltaMove.x * 0.01;
    
    // Rotation verticale (haut / bas) avec blocage des angles extrêmes
    characterModel.rotation.x += deltaMove.y * 0.01;
    characterModel.rotation.x = Math.max(-0.5, Math.min(0.5, characterModel.rotation.x));
  }

  previousMousePosition = { x: e.clientX, y: e.clientY };
});
