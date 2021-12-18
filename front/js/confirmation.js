// Récuperation ID de l'URL
let urlObject = new URL(window.location.href);
let urlId = urlObject.searchParams.get('id');

let elementOrderId = document.getElementById('orderId');
elementOrderId.innerText = urlId;