// Récuperation ID de l'URL
let urlObject = new URL(window.location.href);
let urlId = urlObject.searchParams.get('id');

let cart = [];
let colorChoice = '';
let quantityChoice = 0;

let productOrder = {
};


/**
 * Récuperation du produit en détails avec la création des elements HTML
 */
async function getProduct() {
  // 1 - Récuperation du produit depuis l'API 
  let reponse = await fetch("http://localhost:3000/api/products/" + urlId);
  if (reponse.ok) {
    try {
      // 1.1 - Récupération du produit en json
      let product = await reponse.json();
      // 1.2 Création des elements HTML
      createProductDescription(product);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.warn("error");
  }
}

/**
 * Création de l'element HTML produit en détails
 * @param{object} product 
 */
function createProductDescription(product) {
  // Enregistre les données en objet.
  productOrder = {
    id: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
    altTxt: product.altTxt,
    product: []
  }
  // Récuperation des elements HTML
  let productImg = document.getElementsByClassName('item__img');
  let productTitle = document.getElementById('title');
  let productPrice = document.getElementById('price');
  let productDescription = document.getElementById('description');
  let productColors = document.getElementById('colors');
  // Affecte les valeurs des elements HTML
  document.title = `${product.name}`;
  for (image of productImg) {
    image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  }
  productTitle.innerHTML = `${product.name}`;
  productDescription.innerHTML = `${product.description}`;
  productPrice.innerHTML = `${product.price}`;
  for (color of product.colors) {
    productColors.innerHTML += `<option value="${color}">${color}</option>`;
  }
}

getProduct();
storageAlreadyExist();

// Récupération valeur du choix des couleurs
let colorSelect = document.getElementById('colors');
colorSelect.addEventListener('change', () => {
  colorChoice = colorSelect.value;
});

// Récupération valeur du choix des quantités
let quantitySelect = document.getElementById('quantity');
quantitySelect.addEventListener('change', () => {
  quantityChoice = quantitySelect.value;
  quantityChoice = parseInt(quantityChoice);
});

let addToCart = document.getElementById('addToCart').addEventListener('click', () => {
  // Verifie le formatage de l'ajout au panier
  if (quantityChoice < 1 || quantityChoice > 100) {
    return;
  }
  if (colorChoice == '') {
    return;
  } else {
    // Verifie si l'ID n'existe pas dans un tableau cart, l'ajouter dans le tableau concernée et enregistre sur localStorage.
    let index = cart.findIndex((productOrder) => urlId === productOrder.id);
    if (index === -1) {
      productOrder.product.push({
        color: colorChoice,
        quantity: quantityChoice
      });
      cart.push(productOrder);
      saveToStorage();
      reset();
    } else { 
      // ID existe dans le tableau, on procède donc si la couleur existe.
      let color = colorChoice;
      let i = cart[index].product.findIndex((e) => e.color === color);
      // Verifie si la couleur n'existe pas dans un tableau, l'ajouter dans le tableau product et enregistre sur localStorage.
      if (i === -1) {
        cart[index].product.push({
          color: colorChoice,
          quantity: quantityChoice
        });
        saveToStorage();
        reset();
      } else { 
        // La couleur existe dans le tableau, modifie juste sa quantité et enregistre sur localstorage.
        cart[index].product[i] = {
          ...cart[index].product[i],
          quantity: cart[index].product[i].quantity += quantityChoice
        }
        saveToStorage();
        reset();
      }
    }
  }
});

/**
 * Réinitialise la valeur des choix de couleurs et la quantité quand l'ajout au panier est ok.
 */
function reset() {
  colorSelect.textContent = `--SVP, choisissez une couleur --`;
  quantitySelect.value = 0;
}