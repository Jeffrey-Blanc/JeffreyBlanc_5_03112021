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