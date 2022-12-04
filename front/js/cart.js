"use strict";

import { getFromLocalStorage } from "./localstorage.js";
import { saveToLocalStorage } from "./localstorage.js";

let basket = getFromLocalStorage();
let apiProducts = [];

if (basket) {
    init();
} else {
    // TODO : changer le titre panier vide
}

//  Fonction qui va afficher les produits de manière asynchrone
async function init(){
    await getApiProducts();
    
    displayProducts();
}

async function getApiProducts() {
    const arrayIds = basket.map(kanap => kanap.id);
    apiProducts = await Promise.all(
        arrayIds.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
    );
}

// Fonction qui créer les produits et insert les infos nécessaires pour celui-ci (id, prix, couleur, quantité, nom)
function createElement(index, productData) {
    const displayProduct = document.createElement("article");
    displayProduct.setAttribute("class", "cart__item");
    displayProduct.setAttribute("id", "cart__item");
    displayProduct.setAttribute("data-id", `${productData.id}` );
    displayProduct.setAttribute("data-color", `${productData.color}`);
    displayProduct.innerHTML = `
        <div class="cart__item__img">
            <img src="${apiProducts[index].imageUrl}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${apiProducts[index].name}</h2>
                <p>${productData.color}</p>
                <p>${apiProducts[index].price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productData.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p  class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById("cart__items").appendChild(displayProduct);
}

// Fonction qui gère l'affichage des produits avec une boucle ainsi que le prix total du panier et de la quantité totale de produit présent
function displayProducts() {
    basket.forEach((kanap, index) => {
        let id = kanap.id;
        let quantity = kanap.quantity;
        let color = kanap.color;
    
        createElement(index, { id: id, quantity: quantity, color: color });
    

        computeTotalQuantity();
    

        computeTotalPrice();
    
        // Event listener pour changer la quantité d'un produit ou le supprimer
        document.querySelectorAll(".itemQuantity").forEach(el => el.addEventListener("change", changeQuantityFromLocalStorage));
        document.querySelectorAll(".deleteItem").forEach(el => el.addEventListener("click", removeFromLocalStorage));
    });
}

// Fonction qui calcul le prix total du panier
function computeTotalPrice() {
    const prices = apiProducts.map(kanap => kanap.price);
    const quantities = basket.map(kanap => kanap.quantity);
    let totalPrice = 0;
    for(let i = 0; i < prices.length; i++) {
        totalPrice += prices[i] * quantities[i];
    }
    document.getElementById("totalPrice").innerHTML = totalPrice;
}
// Fonction qui calcul la quantité total de produit présent dans le panier
function computeTotalQuantity() {
    const quantities = basket.map(kanap => kanap.quantity);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    
    document.getElementById("totalQuantity").innerHTML = quantities.reduce(reducer);
}

// Fonction qui va modifier la quantité d'un produit et recharger la page afin de recalculer le prix total du panier et la quantité total de produit
function changeQuantityFromLocalStorage(){
    const value = Number(this.value);
    const article = this.closest('article');
    const id = article.dataset.id;
    const color = article.dataset.color;   
    const object = basket.find(x => x.id === id && x.color === color);
    const objectIndex = basket.findIndex(x => x.id === id && x.color === color);

    if(value === 0) {
        object.quantity = 1;
    } else if (value > 100){
        object.quantity = 100;
    } else{
        object.quantity = value;
    }
    
    saveToLocalStorage(basket);
    window.location.reload();
}

// Fonction qui va supprimer un article dans le localStorage et le supprimer aussi de l'array apiProducts
function removeFromLocalStorage(){
    const article = this.closest('article');
    const id = article.dataset.id;
    const color = article.dataset.color;  
    const object = basket.find(x => x.id === id && x.color === color);
    const objectIndex = basket.findIndex(x => x.id === id && x.color === color);
    basket.splice(objectIndex,1)
    apiProducts.splice(objectIndex,1)
    saveToLocalStorage(basket);
    window.location.reload();
}

// Vérfication des informations entrées par l'utilisateur et validation du formulaire de contact

