let totalQuantityProduct = 0;
let totalPriceProduct = 0;

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
    localStorage.clear();
  } else {
    console.log('il y a erreur');
  }
});