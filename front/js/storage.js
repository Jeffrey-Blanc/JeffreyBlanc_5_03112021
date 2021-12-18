/***
 * Extrait les données localStorage s'il existe.
 */
function storageAlreadyExist() {
  if (localStorage.getItem('panier')) {
    return extractStorages();
  }
}

/***
 * Extrait des données localStorage
 */
function extractStorages() {
  let storage = localStorage.getItem('panier');
  let panier = JSON.parse(storage);
  return cart = panier;
}

/***
 * Enregistre les données de l'objet cart dans localStorage.
 */
function saveToStorage() {
  localStorage.setItem('panier', JSON.stringify(cart));
}