let totalQuantityProduct = 0;
let totalPriceProduct = 0;

/***
 * Affiche les produits commandées
 */
function displayProductOrder() {
  let itemProduct = document.getElementById('cart__items');

  cart.map(productOrder => {
    productOrder.product.map(productOrderChoiceColorOfQuantity => {
      itemProduct.innerHTML += generateProductOrder(productOrder, productOrderChoiceColorOfQuantity);
      //totalQuantityProduct++;
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

for (button of buttonDelete) {
  button.addEventListener("click", function (e) {
    let sectionCartItems = document.getElementById('cart__items');
    let elementArticle = e.target.closest("article");

    deleteArticle(findIdProduct(e), findColor(e))
    saveToStorage();
    recalculateTotalPrice();

    sectionCartItems.removeChild(elementArticle);
  });
}

buttonModifyQuantity = document.getElementsByClassName('itemQuantity');

for (button of buttonModifyQuantity) {
  button.addEventListener("change", function (e) {
    let elementSettingsQuantity = e.target.closest('div');
    let elementQuantity = elementSettingsQuantity.children[0];
    elementQuantity.innerHTML = regenerateQuantity(e.target.value);
    modifyQuantity(findIdProduct(e), findColor(e), parseInt(e.target.value));
    saveToStorage();
    recalculateTotalPrice();
  });
}

function regenerateQuantity(quantity) {
  return (
    `
    <p>Qté : ${quantity} </p>
    `
  );
}

function findColor(element) {
  let elementArticle = element.target.closest("article");
  let titleAndColor = elementArticle.children[1].children[0].children[0].textContent;
  let splitWords = titleAndColor.split(' ');
  let color = splitWords[splitWords.length - 1];
  return color;
}

function findIdProduct(element) {
  let elementId = element.target.closest("article").dataset.id;
  return elementId;
}

function deleteArticle(idProduct, color) {
  let index = cart.findIndex((element) => idProduct === element.id);
  let i = cart[index].product.findIndex((element) => color === element.color);

  cart[index].product.splice(i, 1);
  if (cart[index].product.length < 1) {
    cart.splice(index, 1);
  }
}

function modifyQuantity(idProduct, color, quantity) {
  let index = cart.findIndex((element) => idProduct === element.id);
  let i = cart[index].product.findIndex((element) => color === element.color);

  cart[index].product[i] = {
    ...cart[index].product[i],
    quantity: cart[index].product[i].quantity = quantity
  }
}

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

function testRegex(regex, value, errorHTML, message) {
  if (value === 'undefined') {
    errorHTML.innerText = message;
    return false;
  }
  if (regex.test(value)) {
    errorHTML.innerText = ' ';
    return true;
  } else {
    errorHTML.innerText = message;
    return false;
  }
}

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

  elementsHTML.map((fields) => {
    let elementHTML = document.getElementById(fields.id);
    let errorHTML = document.getElementById(fields.id + 'ErrorMsg');
    let isValid = testRegex(fields.regex, elementHTML.value, errorHTML, fields.messagError);

    fields.isValid = isValid;
    saveContactValueElement(fields.id, elementHTML.value);
  });

  let products = [];

  let verificationFinal = elementsHTML.findIndex((elementsHTML) => elementsHTML.isValid === false);
  if (verificationFinal === -1) {
    cart.map((product) => {
      products.push(product.id);
    });

    let data = {
      contact: contact,
      products: products
    }

    sendOrder(data);
  } else {
    console.log('il y a erreur');
  }
});

async function sendOrder(data) {
  let reponse = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then((reponse) => reponse.json())
    .then(function (data) {
      console.log(data);
      window.location.href = "./confirmation.html?id=" + data.orderId;
    })
}