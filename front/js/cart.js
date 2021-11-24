let totalQuantityProduct = 0;
let totalPriceProduct = 0;

function displayProductOrder(){
  let itemProduct = document.getElementById('cart__items');

  cart.map(productOrder => {
   productOrder.product.map(productOrderChoiceColorOfQuantity =>{
    itemProduct.innerHTML += generateProductOrder(productOrder, productOrderChoiceColorOfQuantity);
    totalQuantityProduct++;
    calculateTotalPrice(productOrderChoiceColorOfQuantity.quantity, productOrder.price);
   });
  });
}

function calculateTotalPrice(quantite, price){
  return totalPriceProduct += quantite * price;
}

function generateProductOrder(productOrder, productOrderChoiceColorOfQuantity){
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