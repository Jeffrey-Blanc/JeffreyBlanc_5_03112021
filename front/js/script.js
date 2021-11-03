let urlLocation = window.location.href;
let urlObject = new URL(urlLocation);
let urlId = urlObject.searchParams.get('id');

// console.log(urlId);

fetch("http://localhost:3000/api/products/" + urlId)
  .then((response) => response.json())
  .then(product => {
    let productImg = document.getElementsByClassName('item__img');
    let productTitle = document.getElementById('title');
    let productPrice = document.getElementById('price');
    let productDescription = document.getElementById('description');
    let productColors = document.getElementById('colors');

    document.title = `${product.name}`;
    for(image of productImg){
      image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    }
    productTitle.innerHTML = `${product.name}`;
    productDescription.innerHTML = `${product.description}`;
    productPrice.innerHTML = `${product.price}`;
    for(color of product.colors)
    productColors.innerHTML += `<option value="${color}">${color}</option>`;
  })
  .catch(function(err){
    console.log(err);
  })