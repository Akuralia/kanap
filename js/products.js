"use strict";

const str = window.location.href; // Récupère le lien de la page actuelle
const url = new URL(str);  // construit un UrlObject
const id = url.searchParams.get("id"); // récupère l'id du produit de la page afin de récupérer les données de ce produit par la suite
const urlHost ="http://127.0.0.1:5500/front/html/product.html?id="; // à modif une fois sur gitpages
const itemUrl = 'http://localhost:3000/api/products/' + id; // (à modif une fois sur gitpages mais sera la suivante : host + './api/products/') Url qui permet de faire l'appel API du produit


const productImgLocation = document.getElementById("item_img");


function productInfos (dataProduct) {   // Fonction qui va récupérer et créer les éléments à afficher pour le produit selectionné sur la page d'acceuil


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


// Boucle qui va afficher les options de couleurs en fonction du produit sélectionné

const productColors = document.getElementById("colors");

for (let i = 0; i < dataProduct.colors.length; i++) {
    let colorOption = document.createElement("option");
    colorOption.value = dataProduct.colors[i];
    colorOption.label = dataProduct.colors[i];
    productColors.add(colorOption);
}




fetch(itemUrl) //appel API avec l'id du produit de la page consulté
    .then((response) => response.json())   // Retour de la réponse
    .then((data) => {
        productInfos(data) 
    });
