
/**
* Récupération des produits avec la création des elements HTML
*/
async function getProducts() {
  // * 1 - Récupration des produits depuis l'API
  let response = await fetch("http://localhost:3000/api/products");
  if (response.ok) {
    try {
      // * 1.1 - Récupération des produits en json
      let products = await response.json();
      let itemsProduct = document.getElementById('items');
      // * 1.2 - Boucle sur les produits
      products.map((product) => {
        // * 1.3 - Création des elements HTML
        itemsProduct.innerHTML += createProduct(product);
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.warn("Error !");
  }
}

/**
* Création de l'element HTML produit
* @param{object}product 
* @returns
*/
function createProduct(product) {
  return (
    `
  <a href="./product.html?id=${product._id}">
  <article>
  <img src="${product.imageUrl}" alt="${product.altTxt}">
  <h3 class="productName">${product.name}</h3>
  <p class="productDescription">${product.description}</p>
  </article>
  </a>
  `
  )
}

getProducts();