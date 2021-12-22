let totalQuantityProduct = 0;
let totalPriceProduct = 0;

/***
 * Affiche les produits commandées
 */
function displayProductOrder() {
  let itemProduct = document.getElementById('cart__items');

  // Boucle sur les produits ID commandés
  cart.map(productOrder => {
    // Boucle sur les produits de la couleur du choix et sa quantité
    productOrder.product.map(productOrderChoiceColorOfQuantity => {
      // Création des éléments HTML
      itemProduct.innerHTML += generateProductOrder(productOrder, productOrderChoiceColorOfQuantity);
      // Calcul le nombre et le prix total des produits commandés.
      calculateTotalPrice(productOrderChoiceColorOfQuantity.quantity, productOrder.price);
    });
  });
}

/***
 * Calcul le total des prix des commandes.
 * @param{obj}, {obj}. quantite produit commandés, produit prix.
 */
function calculateTotalPrice(quantite, price) {
  totalQuantityProduct += quantite;
  totalPriceProduct += quantite * price;
}

/***
 * Generation des éléments HTML des produits commandées
 * @param{obj}, {obj}. produit commandé, produit de choix couleur et sa quantité.
 */
function generateProductOrder(productOrder, productOrderChoiceColorOfQuantity) {
  return (
    `
    <article class="cart__item" data-id="${productOrder.id}">
                <div class="cart__item__img">
                  <img src="${productOrder.imageUrl}" alt="${productOrder.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                    <h2>${productOrder.name} ${productOrderChoiceColorOfQuantity.color}</h2>
                    <p>${productOrder.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${productOrderChoiceColorOfQuantity.quantity} </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productOrderChoiceColorOfQuantity.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
    `
  )
}

storageAlreadyExist();
displayProductOrder();

let totalQuantity = document.getElementById('totalQuantity');
totalQuantity.textContent = totalQuantityProduct;

let totalPrice = document.getElementById('totalPrice');
totalPrice.textContent = totalPriceProduct;



buttonDelete = document.getElementsByClassName('deleteItem');
// Affecte chaque bouton "supprimer" à écouter l'evenement click
for (button of buttonDelete) {
  button.addEventListener("click", function (e) {
    let sectionCartItems = document.getElementById('cart__items');
    let elementArticle = e.target.closest("article");

    // supprime l'article concernée.
    deleteArticle(findIdProduct(e), findColor(e))
    // enregistre le localstorage
    saveToStorage();
    // recalcul le nombre et le prix total des produits commandés
    recalculateTotalPrice();

    // supprime l'article concerné en HTML
    sectionCartItems.removeChild(elementArticle);
  });
}

buttonModifyQuantity = document.getElementsByClassName('itemQuantity');

// Affecte chaque input à écouter l'évenement change : augmenter ou diminuer la quantité du produit concernée
for (button of buttonModifyQuantity) {
  button.addEventListener("change", function (e) {
    // Récupere element HTML
    let elementSettingsQuantity = e.target.closest('div');
    let elementQuantity = elementSettingsQuantity.children[0];
    // Modifie la valeur sur l'element en HTML
    elementQuantity.innerHTML = regenerateQuantity(e.target.value);
    // Modifie la quantité du produit dans le tableau cart
    modifyQuantity(findIdProduct(e), findColor(e), parseInt(e.target.value));
    // Enregistre localStorage
    saveToStorage();
    // Recalcul le nombre et le total des prix des produits commandés
    recalculateTotalPrice();
  });
}

/***
 * Modifie la quantité du produit sur l'élément HTML
 * @param{}valeur quantite
 * @returns
 */
function regenerateQuantity(quantity) {
  return (
    `
    <p>Qté : ${quantity} </p>
    `
  );
}

/***
 * Cherche la couleur du produit dans l'element du titre en HTML
 * @param{object}element HTML
 * @returns
 */
function findColor(element) {
  // Trouve l'élément article de l'ancetre du l'element concernée en HTML
  let elementArticle = element.target.closest("article");
  // Trouve la valeur du titre de l'élément concernée en HTML
  let titleAndColor = elementArticle.children[1].children[0].children[0].textContent;
  // Enregistre les mots du titre de l'élément
  let splitWords = titleAndColor.split(' ');
  // Trouve la couleur concernée
  let color = splitWords[splitWords.length - 1];
  return color;
}

/***
 * Cherche l'ID du produit dans l'element de l'article en HTML
 * @param{object}element HTML
 * @returns
 */
function findIdProduct(element) {
  let elementId = element.target.closest("article").dataset.id;
  return elementId;
}

/**
* Création de l'element HTML produit
* @param{},{}valeur ID, valeur couleur
* @returns
*/
function deleteArticle(idProduct, color) {
  let index = cart.findIndex((element) => idProduct === element.id);
  let i = cart[index].product.findIndex((element) => color === element.color);

  // Supprime le produit de la couleur du choix et sa quantité.
  cart[index].product.splice(i, 1);
  // si la quantité vaut 0, supprime la couleur et sa quantite dans le tableau
  if (cart[index].product.length < 1) {
    cart.splice(index, 1);
  }
}

/**
* Modification quantité du produit commandé.
* @param{},{},{}valeur ID, valeur couleur, valeur quantite
*/
function modifyQuantity(idProduct, color, quantity) {
  let index = cart.findIndex((element) => idProduct === element.id);
  let i = cart[index].product.findIndex((element) => color === element.color);

  // Trie le tableau et modifie la quantité
  cart[index].product[i] = {
    ...cart[index].product[i],
    quantity: cart[index].product[i].quantity = quantity
  }
}

/**
* Recalcul le nombre et le total des prix des produits commandés
*/
function recalculateTotalPrice() {
  totalQuantityProduct = 0;
  totalPriceProduct = 0;

  cart.map(productOrder => {
    productOrder.product.map(productOrderChoiceColorOfQuantity => {
      calculateTotalPrice(productOrderChoiceColorOfQuantity.quantity, productOrder.price);
    });
  });
  totalQuantity.textContent = totalQuantityProduct;
  totalPrice.textContent = totalPriceProduct;
}

/**
* Vérifie le formatage des champs formulaires
* @param{},{},{},{object}regex, valeur input element, id element message erreur, valeur message erreur
* @returns
*/
function testRegex(regex, value, errorHTML, message) {
  // champs vide, alerte message et retourne faux boolean
  if (value === 'undefined') {
    errorHTML.innerText = message;
    return false;
  }
  // champ validé, pas d'alerte message et retourne vrai boolean
  if (regex.test(value)) {
    errorHTML.innerText = ' ';
    return true;
  } else {
    // champ invalide aux regex, alerte message et retourne faux boolean
    errorHTML.innerText = message;
    return false;
  }
}

/**
* Enregistre les valeurs dans l'objet contact
* @param{},{}valeur ID, valeur element
*/
function saveContactValueElement(id, elementValue) {
  switch (id) {
    case 'firstName':
      contact.firstName = elementValue;
      break;
    case 'lastName':
      contact.lastName = elementValue;
      break;
    case 'address':
      contact.address = elementValue;
      break;
    case 'city':
      contact.city = elementValue;
      break;
    case 'email':
      contact.email = elementValue;
      break;
    default:
      console.log('probleme');
  }
}

let contact = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  email: '',
}

// Bouton commande : Vérification des formatages formulaires avant l'envoie.
document.getElementById('order').addEventListener('click', (e) => {
  e.preventDefault();

  // Regex
  let regexSimple = new RegExp('^[a-zA-Z\-\' ]+$');
  let regexAddress = new RegExp('^[0-9a-zA-Z\-\' ]+$');
  let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

  let elementsHTML = [
    {
      id: "firstName", regex: regexSimple, messagError: 'Ne peut pas être vide et ne peut pas contenir des chiffres', isValid: false
    },
    {
      id: "lastName", regex: regexSimple, messagError: 'Ne peut pas être vide et ne peut pas contenir des chiffres', isValid: false
    },
    {
      id: "address", regex: regexAddress, messagError: 'Ne peut pas être vide.', isValid: false
    },
    {
      id: "city", regex: regexSimple, messagError: 'Ne peut pas être vide et ne peut pas contenir des chiffres', isValid: false
    },
    {
      id: "email", regex: regexEmail, messagError: 'Ne peut pas être vide et le format d\'un mail doit être : exemple@kanap.com', isValid: false
    }
  ];

  // Boucle vérification formatage et enregistre les valeurs dans l'objet contact
  elementsHTML.map((fields) => {
    let elementHTML = document.getElementById(fields.id);
    let errorHTML = document.getElementById(fields.id + 'ErrorMsg');
    let isValid = testRegex(fields.regex, elementHTML.value, errorHTML, fields.messagError);

    fields.isValid = isValid;
    saveContactValueElement(fields.id, elementHTML.value);
  });

  let products = [];

  // Vérification si tous les champs formulaires sont valides avant l'envoi au API
  let verificationFinal = elementsHTML.findIndex((elementsHTML) => elementsHTML.isValid === false);
  // Vérifie si le boolean False n'existe pas dans le tableau
  if (verificationFinal === -1) {
    // boucle pour enregistrer les ID dans l'objet produits.
    cart.map((product) => {
      products.push(product.id);
    });

    // Enregistre les valeurs du contact et des id produits dans l'objet data
    let data = {
      contact: contact,
      products: products
    }

    // Envoie au API
    sendOrder(data);
  } else {
    console.log('il y a erreur');
  }
});

/**
* Création de l'element HTML produit
* @param{object}données (de contact et de produits ID)
*/
async function sendOrder(data) {
  // Envoie au API avec methode POST
  let reponse = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    // si la reponse est ok, recevoir les données de leur réponse.
    .then((reponse) => reponse.json())
    // Dirige vers la page de confirmation avec l'url id (recu en reponse de l'API)
    .then(function (data) {
      window.location.href = "./confirmation.html?id=" + data.orderId;
    })
}