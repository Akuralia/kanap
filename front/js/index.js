"use strict";

const itemsContainer = document.getElementById("items"); // Récup de la section Item

function createCardsItems (dataProduct){
  // console.log(product);
  const productLink = document.createElement("a");  // Création balise lien
  productLink.href = "./product.html?id=" + dataProduct._id;

  const productArticle = document.createElement("article"); // Création balise article
  productLink.appendChild(productArticle);

  const productImg = document.createElement("img"); // Création balise img
  productImg.src = dataProduct.imageUrl; 
  productImg.alt = dataProduct.altTxt
  productArticle.appendChild(productImg);

  const productTitle = document.createElement("h3");  // Création balise h3
  productTitle.textContent = dataProduct.name;
  productArticle.appendChild(productTitle);

  const productDescription = document.createElement("p"); // Création balise p
  productDescription.textContent = dataProduct.description;
  productArticle.appendChild(productDescription);

  itemsContainer.appendChild(productLink); // Indique que productLink devient enfant de itemsContainer
}



fetch('http://localhost:3000/api/products') //appel API
  .then((response) => response.json())   
  .then((data) => {
    for (const dataProduct of data){    // Création boucle qui appel les données du produit
      createCardsItems(dataProduct)
    }
  });
