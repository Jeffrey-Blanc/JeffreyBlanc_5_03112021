/**
 * Récuperation du produit en détails avec la création des elements HTML
 */
async function getProduct() {
  // * 1 - Récuperation ID de l'URL
  let urlLocation = window.location.href;
  let urlObject = new URL(urlLocation);
  let urlId = urlObject.searchParams.get('id');
  // * 2 - Récuperation du produit depuis l'API 
  let reponse = await fetch("http://localhost:3000/api/products/" + urlId);
  if (reponse.ok) {
    try {
      // * 2.1 - Récupération du produit en json
      let product = await reponse.json();
      // * 2.2 Création des elements HTML
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