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