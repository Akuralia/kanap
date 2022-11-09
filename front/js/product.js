"use strict";

const str = window.location.href; // Récupère le lien de la page actuelle
const url = new URL(str);  // construit un UrlObject
const id = url.searchParams.get("id"); // récupère l'id du produit de la page afin de récupérer les données de ce produit par la suite
const urlHost ="http://127.0.0.1:5500/front/html/product.html?id="; // à modif une fois sur gitpages
const itemUrl = 'http://localhost:3000/api/products/' + id; // (à modif une fois sur gitpages mais sera la suivante : host + './api/products/') Url qui permet de faire l'appel API du produit


const productImgLocation = document.getElementById("item_img");

fetch(itemUrl) //appel API avec l'id du produit de la page consulté
    .then((response) => response.json())   // Retour de la réponse
    .then((data) => {
        createProduct(data) 
    });


// Fonction qui va récupérer et créer les éléments à afficher pour le produit selectionné sur la page d'acceuil
function createProduct (dataProduct) {   
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

    // Boucle...

    const productColors = document.getElementById("colors");

    for (let i = 0; i < dataProduct.colors.length; i++) {
        let colorOption = document.createElement("option");
        colorOption.value = dataProduct.colors[i];
        colorOption.label = dataProduct.colors[i];
        productColors.add(colorOption);
    }
}


//  Vérification afin d'autoriser l'utilisateur à ajouter au panier (éviter d'avoir des valeurs nulles)
const selectColors = document.getElementById("colors");
const quantityProduct = document.getElementById("quantity");
selectColors.addEventListener("change", () => {
    if (quantityProduct.value > 0) {
        const styleAddToCartBtn = document.getElementById("addToCart");
        styleAddToCartBtn.style.opacity= "1";
        const statementButton = document.getElementById("addToCart");
        statementButton.removeAttribute("disabled");

    } else {
        quantityProduct.value = "1"
        const styleAddToCartBtn = document.getElementById("addToCart");
        styleAddToCartBtn.style.opacity= "1";
        const statementButton = document.getElementById("addToCart");
        statementButton.removeAttribute("disabled");
    }
});

// Fonction ajout au panier via le Bouton

const addToCart = document.getElementById("addToCart");


// Fonction qui sauvegarde le panier


addToCart.addEventListener("click", () => {
let product = {
    id : id,
    name : document.getElementById("title").textContent,
    color : selectColors.value,
    quantity : quantityProduct.value,
    price : document.getElementById("price").textContent,
}
console.log(product),
addBasket(product);

});

