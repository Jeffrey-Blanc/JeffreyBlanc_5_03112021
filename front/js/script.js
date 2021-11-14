  // Récuperation ID de l'URL
  let urlObject = new URL(window.location.href);
  let urlId = urlObject.searchParams.get('id');

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

let cart = [];

let colorChoice = '';
let quantityChoice = 0;


let colorSelect = document.getElementById('colors');
colorSelect.addEventListener('change', ()=>{
  colorChoice = colorSelect.value;
});

let quantitySelect = document.getElementById('quantity');
quantitySelect.addEventListener('change', ()=>{
  quantityChoice = quantitySelect.value;
  quantityChoice = parseInt(quantityChoice);
});

let addToCart = document.getElementById('addToCart').addEventListener('click', () => {
  let productOrder = {
    id: urlId,
    product: []
  };
  // Verifie le formatage de l'ajout au panier
  if(quantityChoice < 1 || quantityChoice > 100){
    return console.log('erreur : le chiffre 1 ne doit pas etre inferieur a 0 et ne doit pas etre superieur a 100.');
  } 
  if (colorChoice == ''){
    return console.log('Choissisez une couleur SVP');
  }else{
    // Verifie si l'ID n'existe pas dans un tableau. l'ajouter dans le panier.
    let index = cart.findIndex((productOrder) => urlId === productOrder.id);
    if(index === -1){
      console.log('Produit id inexistant, on ajoute le produit d une couleur choisie avec sa quantite au tableau');
      productOrder.product.push({
        color: colorChoice,
        quantity: quantityChoice
      });
      cart.push(productOrder);
    }else{
      console.log('Produit id existant, on procede une verification supplementaire si la couleur existe deja.');
      let color = colorChoice;
      let i = cart[index].product.findIndex((e) => e.color === color);
      if(i === -1){
        console.log('la couleur n existe pas, on l ajoute au tableau et on enregistre la quantite.');
        productOrder.product.push(
          productOrder.product.color = colorChoice,
          productOrder.product.quantity = quantityChoice
        );
        cart[index].product.push(productOrder.product);
        // cart.push(productOrder);
      }else{
        console.log('la couleur existe, on additionne la quantite.');
        cart[index].product[i] = {
          ...cart[index].product[i],
          quantity: cart[index].product[i].quantity += quantityChoice
        }
      }
    }
  }
});