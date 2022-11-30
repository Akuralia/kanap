"use strict";

import { localStorageHasKey } from "./localstorage.js";
import { getFromLocalStorage } from "./localstorage.js";

displayProductBasket();
let currentProductId = null;
let currentProductColor = null;
//  Fonction qui récupère le panier de l'utilisateur et l'affiche avec appel de l'API pour les données manquantes
function displayProductBasket(){
    let isBasketFilled = localStorageHasKey();
    let basket = getFromLocalStorage();
    let totalBasketPrice = 0;
    let totalBasketProduct =0;
    if(isBasketFilled){
        for (let i = 0; i < basket.length; i++){
            let kanapId = basket[i].id;
            let kanapQuantity = basket[i].quantity;
            let kanapColor = basket[i].color;
            let kanapUrl = 'http://localhost:3000/api/products/' + kanapId;
            fetch(kanapUrl)
                .then((response) => response.json())   
                .then((apiData) => {
                    const displayProduct = document.createElement("article");
                    displayProduct.setAttribute("class", "cart__item");
                    displayProduct.setAttribute("id", "cart__item");
                    displayProduct.setAttribute("data-id", `${kanapId}` );
                    displayProduct.setAttribute("data-color", `${kanapColor}`);
                    displayProduct.innerHTML = `
                                <div class="cart__item__img">
                                    <img src="${apiData.imageUrl}" alt="Photographie d'un canapé">
                                </div>
                                <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${apiData.name}</h2>
                                        <p>${kanapColor}</p>
                                        <p>${apiData.price} €</p>
                                    </div>
                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : </p>
                                            <input type="number"  data-id="${kanapId}" data-color="${kanapColor}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanapQuantity}">
                                        </div>
                                        <div class="cart__item__content__settings__delete">
                                            <p  class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                </div>  `;
                    document.getElementById("cart__items").appendChild(displayProduct);

                    //  Calcul du total des articles dans le panier
                    totalBasketProduct += kanapQuantity;
                    document.getElementById("totalQuantity").innerHTML = totalBasketProduct;

                    //  Calcul du prix total du panier
                    let totalProductPrice = apiData.price * kanapQuantity;
                    totalBasketPrice += totalProductPrice;
                    document.getElementById("totalPrice").innerHTML = totalBasketPrice;

                    //  Event listener pour changer la quantité d'un produit ou le supprimer 
                    document.querySelectorAll(".itemQuantity").forEach(el => el.addEventListener("change", changeQuantityFromLocalStorage));
                    document.querySelectorAll(".deleteItem").forEach(el => el.addEventListener("click", removeFromLocalStorage));
            });
    }
    } else {
        alert("Votre panier est vide... Dommage :/")
}
}


function changeQuantityFromLocalStorage(){
    let basket = getFromLocalStorage();
    console.log("quantité article modifiée")
}



function removeFromLocalStorage(){
console.log("article supprimé")
}








