class Product {
  constructor(jsonProduct){
   jsonProduct && Object.assign(this, jsonProduct);
 }
}

fetch("http://localhost:3000/api/products")
 .then((response) => response.json())
 .then(jsonListProduct => {
   let itemsProduct = document.getElementById('items');
   for(jsonProduct of jsonListProduct){
     let product = new Product(jsonProduct);
     itemsProduct.innerHTML += `<a href="./product.html?id=${product._id}">
                                    <article>
                                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                                      <h3 class="productName">${product.name}</h3>
                                      <p class="productDescription">${product.description}</p>
                                    </article>
                                  </a>`;

   }
 })
 .catch(function(err){
   console.log(err);
 })