"use strict";

const str = window.location.href;
const url = new URL(str);
const id = url.searchParams.get("id");
const urlHost ="http://127.0.0.1:5500/front/html/product.html?id="; // à modif une fois sur gitpages
const itemUrl = 'http://localhost:3000/api/products/' + id; // à modif une fois sur gitpages
console.log(itemUrl);


const itemsContainer = document.getElementsByClassName("item");
const productImgLocation = document.getElementById("item_img");


function productInfos (dataProduct) {

const productImg = document.createElement("img");
    productImg.src = dataProduct.imageUrl;
    productImg.alt = dataProduct.altTxt;
    productImgLocation.appendChild(productImg);

const productTitle = document.getElementById("title");
    productTitle.textContent = dataProduct.name;

const productPrice = document.getElementById("price");
    productPrice.textContent = dataProduct.price;

const productDescription = document.getElementById("description");
    productDescription.textContent = dataProduct.description;


//couleur du produit
const productColorSection = document.getElementById("colors");
console.log(dataProduct.colors.length)
if(dataProduct.colors.length > 2 && dataProduct.colors.length < 4 ){

const productColorOptionOne = document.createElement("option");
const productColorOptionTwo = document.createElement("option");
const productColorOptionThree = document.createElement("option");
productColorOptionOne.textContent = dataProduct.colors[0];
productColorOptionTwo.textContent = dataProduct.colors[1];
productColorOptionThree.textContent = dataProduct.colors[2];
productColorSection.appendChild(productColorOptionOne);
productColorSection.appendChild(productColorOptionTwo);
productColorSection.appendChild(productColorOptionThree);

} else if ( dataProduct.colors.length >= 4) {
    const productColorOptionOne = document.createElement("option");
    const productColorOptionTwo = document.createElement("option");
    const productColorOptionThree = document.createElement("option");
    const productColorOptionFour = document.createElement("option");
        productColorOptionOne.textContent = dataProduct.colors[0];
        productColorOptionTwo.textContent = dataProduct.colors[1];
        productColorOptionThree.textContent = dataProduct.colors[2];
        productColorOptionFour.textContent = dataProduct.colors[3];
            productColorSection.appendChild(productColorOptionOne);
            productColorSection.appendChild(productColorOptionTwo);
            productColorSection.appendChild(productColorOptionThree);
            productColorSection.appendChild(productColorOptionFour);
} else if (dataProduct.colors.length < 3){
    const productColorOptionOne = document.createElement("option");
    const productColorOptionTwo = document.createElement("option");
        productColorOptionOne.textContent = dataProduct.colors[0];
        productColorOptionTwo.textContent = dataProduct.colors[1];
            productColorSection.appendChild(productColorOptionOne);
            productColorSection.appendChild(productColorOptionTwo);
} else {
    console.log(`Something went wrong check your code`);
}

};





fetch(itemUrl) //appel API avec l'id du produit de la page consulté
    .then((response) => response.json())   // Retour de la réponse
    .then((data) => {
        productInfos(data)
    });
