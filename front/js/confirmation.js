// Récuperation ID de l'URL
let urlObject = new URL(window.location.href);

console.log(urlObject);

let urlId = urlObject.searchParams.get('id');

console.log(urlId);

let elementOrderId = document.getElementById('orderId');
elementOrderId.innerText = urlId;