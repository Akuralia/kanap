"use strict";

import { getFromLocalStorage } from "./localstorage.js";

const str = window.location.href; // Récupère le lien de la page actuelle
const url = new URL(str);  // construit un UrlObject
const id = url.searchParams.get("id"); // récupère l'id du produit de la page afin de récupérer les données de ce produit par la suite
const urlHost ="http://127.0.0.1:5500/front/html/product.html?id="; // à modif une fois sur gitpages
const itemUrl = 'http://localhost:3000/api/products/' + id; // (à modif une fois sur gitpages mais sera la suivante : host + './api/products/') Url qui permet de faire l'appel API du produit

let product = null;

const productImgLocationElement = document.getElementById("item__img");
const buttonElement = document.getElementById("addToCart");

// Appel API avec l'id du produit de la page consulté
fetch(itemUrl)
    .then((response) => response.json())   // Retour de la réponse
    .then((data) => {
        product = createProduct(data);
    });

// Fonction qui va récupérer et créer les éléments à afficher pour le produit selectionné sur la page d'acceuil
function createProduct (dataProduct) {
    const productImg = document.createElement("img");
    productImg.src = dataProduct.imageUrl;
    productImg.alt = dataProduct.altTxt;
    productImgLocationElement.appendChild(productImg);
    const productTitle = document.getElementById("title");
    productTitle.textContent = dataProduct.name;
    const productPrice = document.getElementById("price");
    productPrice.textContent = dataProduct.price;
    const productDescription = document.getElementById("description");
    productDescription.textContent = dataProduct.description;
    
    // Boucle...
    const productColors = document.getElementById("colors");
    
    for (let i = 0; i < dataProduct.colors.length; i++) {
        let colorOption = document.createElement("option");
        colorOption.value = dataProduct.colors[i];
        colorOption.label = dataProduct.colors[i];
        productColors.add(colorOption);
    }
    
    return dataProduct;
}

// Vérification afin d'autoriser l'utilisateur à ajouter au panier (éviter d'avoir des valeurs nulles)
const selectColors = document.getElementById("colors");
const quantityProduct = document.getElementById("quantity");

selectColors.addEventListener("change", buttonValidation);
quantityProduct.addEventListener("change", buttonValidation);

function buttonValidation() {
    // Vérifier que la couleur sélectionnée est bien une couleur valide
    const currentColor = selectColors.value;
    const isColorValid = product.colors.includes(currentColor);
    
    const currentQuantity = Number(quantityProduct.value);
    const isQuantityValid = currentQuantity >= 1 && currentQuantity <= 100;
    
    if (isColorValid && isQuantityValid) {
        buttonElement.removeAttribute('disabled');
    } else {
        buttonElement.setAttribute('disabled', 'true');
    }
}

buttonElement.addEventListener("click", addProduct);




function processLocalStorage(kanap) {
    let basket = getFromLocalStorage();
    const foundProduct = basket.find(basketProduct => basketProduct.id === id && basketProduct.color === selectColors.value);
    if(foundProduct){
        foundProduct.quantity += kanap.quantity;
        if(foundProduct.quantity > 100){
            foundProduct.quantity = 100;
        }
    } else{
        basket.push(kanap);
    }
    localStorage.setItem("userBasket", JSON.stringify(basket));
}

function addProduct() {
    const kanap = {
        id : id,
        quantity : Number(quantityProduct.value),
        color : selectColors.value,
    };

    processLocalStorage(kanap);
}
