"use strict";

import { localStorageHasKey } from "./localstorage.js";
import { getFromLocalStorage } from "./localstorage.js";

displayProductBasket();

//  Fonction qui récupère le panier de l'utilisateur et l'affiche avec appel de l'API pour les données manquantes
function displayProductBasket(data){
    let isBasketFilled = localStorageHasKey();
    let basket = getFromLocalStorage();

    if(isBasketFilled){
        for (let i = 0; i < basket.length; i++){
            let kanapId = basket[i].id;
            let kanapQuantity = basket[i].quantity;
            let kanapColor = basket[i].color;
            let totalBasketPrice = 0;
            let kanapUrl = 'http://localhost:3000/api/products/' + kanapId;
            fetch(kanapUrl)
                .then((response) => response.json())   
                .then((data) => {
                    const displayProduct = document.createElement("article");
                    displayProduct.setAttribute("class", "cart__item")
                    displayProduct.setAttribute("data-id", "{product-ID}")
                    displayProduct.setAttribute("data-color", "{product-color}")
                    displayProduct.innerHTML = `
                                <div class="cart__item__img">
                                    <img src="${data.imageUrl}" alt="Photographie d'un canapé">
                                </div>
                                <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${data.name}</h2>
                                        <p>${kanapColor}</p>
                                        <p>${data.price} €</p>
                                    </div>
                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : </p>
                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanapQuantity}">
                                        </div>
                                        <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                </div>  `;
                    document.getElementById("cart__items").appendChild(displayProduct);
                    
                    //  Total du prix du panier
                    totalBasketPrice += data.price * kanapQuantity;
                    document.getElementById("totalPrice").innerHTML = totalBasketPrice;
            });
    }
    } else {
        console.log("votre panier est vide")
        alert("VOTRE PANIER EST VIDE ZEBI :/")

}



    // const displayProduct = document.createElement("article");
    // displayProduct.setAttribute("class", "cart__item")
    // displayProduct.setAttribute("data-id", "{product-ID}")
    // displayProduct.setAttribute("data-color", "{product-color}")
    // displayProduct.innerHTML = `
    //             <div class="cart__item__img">
    //               <img src="../images/product01.jpg" alt="Photographie d'un canapé">
    //             </div>
    //             <div class="cart__item__content">
    //               <div class="cart__item__content__description">
    //                 <h2>Nom du produit</h2>
    //                 <p>${color}</p>
    //                 <p>42,00 €</p>
    //               </div>
    //               <div class="cart__item__content__settings">
    //                 <div class="cart__item__content__settings__quantity">
    //                   <p>Qté : </p>
    //                   <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
    //                 </div>
    //                 <div class="cart__item__content__settings__delete">
    //                   <p class="deleteItem">Supprimer</p>
    //                 </div>
    //               </div>
    //             </div>      `
    // document.getElementById("cart__items").appendChild(displayProduct);





}

