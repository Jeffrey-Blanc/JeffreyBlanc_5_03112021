// Récuperation ID de l'URL
let urlObject = new URL(window.location.href);
let urlId = urlObject.searchParams.get('id');

// Affecte la valeur ID de la commande sur l'élément HTML
let elementOrderId = document.getElementById('orderId');
elementOrderId.innerText = urlId;