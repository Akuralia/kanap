"use strict";

import { getFromLocalStorage, localStorageHasKey, saveToLocalStorage } from "./localstorage.js";

// Regex
const firstNameRegex = /^[a-zA-ZçéèêëïöÇÉÈÊËÏÖ\s-]{3,20}$/;
const lastNameRegex = /^[A-Z\s-]{3,20}$/;
const addressRegex = /^[a-zA-Z0-9àçéèêëïöæœÀÇÉÈÊËÏÖÆŒ._\s-]{3,120}$/;
const cityRegex = /^[a-zA-ZàçéèêëïöæœÀÇÉÈÊËÏÖÆŒ.\s-]{3,120}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

let contactVerification = {
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    email: false
};


let basket = getFromLocalStorage();
let apiProducts = [];

if (basket.length > 0) {
    init();
} else {
    const emptyBasket = document.createElement("article");
    emptyBasket.innerHTML = `
        <div class="cart__item__content__description">
            <h2>Votre panier est vide</h2>
        </div>
    `;
    document.getElementById("cart__items").appendChild(emptyBasket);
}

// Fonction qui active ou désactive le bouton commande en fonction de la validité du formulaire de contact
function orderButtonState() {
    const isFormValid = Object.values(contactVerification).every((v) => v === true);
    const orderButton = document.getElementById("order");

    if(isFormValid) {
        orderButton.disabled = false;
        return isFormValid;
    } else {
        orderButton.disabled = true;
        return isFormValid;
    }
}

//  Fonction qui va afficher les produits de manière asynchrone (on attend la fin de l'execution de l'appel api avant d'executer la fonction d'affichage des produits)
async function init() {
    await getApiProducts();

    displayProducts();

    orderButtonState();

    // Vérfication des informations entrées par l'utilisateur et validation du formulaire de contact
    const firstNameElement = document.getElementById("firstName");
    const lastNameElement = document.getElementById("lastName");
    const addressElement = document.getElementById("address");
    const cityElement = document.getElementById("city");
    const emailElement = document.getElementById("email");



    // Vérification des inputs du formulaire
    // Event listener pour vérifier les inputs en temps réel lors du focus
    firstNameElement.addEventListener("change", function() {
        contactVerification.firstName = validateFirstName(this);
        orderButtonState();
    });
    lastNameElement.addEventListener("change", function() {
        contactVerification.lastName = validateLastName(this);
        orderButtonState();
    });
    addressElement.addEventListener("change", function() {
        contactVerification.address = validateAddress(this);
        orderButtonState();
    });
    cityElement.addEventListener("change", function() {
        contactVerification.city = validateCity(this);
        orderButtonState();
    });
    emailElement.addEventListener("change", function() {
        contactVerification.email = validateEmail(this);
        orderButtonState();
    });

    // Requête POST API pour envoyer la commande
    // Event listener bouton commander
    const orderButton = document.getElementById("order");
    orderButton.addEventListener("click", (e) => {
        e.preventDefault();
        const postUrl ="http://localhost:3000/" + "api/products/order/";
        const contactData = {
            firstName: firstNameElement.value,
            lastName: lastNameElement.value,
            address: addressElement.value,
            city: cityElement.value,
            email: emailElement.value,
        };
        const orderJsonData = createOrderJsonData(contactData);
        const validForm = Object.values(contactVerification).every((v) => v === true);
        if(validForm) {
            fetch(postUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: orderJsonData
            })
                .then((response) => response.json())
                .then ((data) => {
                    localStorage.clear();
                    window.location.href = `confirmation.html?id=${data.orderId}`;
                })
                .catch(() => {
                    alert("Une erreur est survenue, veuillez essayer ultérieurement");
                });
        }
    });
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
    const isLocalStorageFilled = localStorageHasKey();
    if(isLocalStorageFilled){
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
    } else {
        const displayProduct = document.createElement("article");
        displayProduct.innerHTML = `
            <div class="cart__item__content__description">
                <h2>Votre panier est vide</h2>
            </div>
        `;
        document.getElementById("cart__items").appendChild(displayProduct);
    }

}

// Fonction qui calcul le prix total du panier
function computeTotalPrice() {
    const prices = apiProducts.map(kanap => kanap.price);
    const quantities = basket.map(kanap => kanap.quantity);
    let totalPrice = 0;
    for(let i = 0; i < prices.length; i++) {
        totalPrice += prices[i] * quantities[i];
    }
    document.getElementById("totalPrice").innerHTML = String(totalPrice);
}

// Fonction qui calcul la quantité total de produit présent dans le panier
function computeTotalQuantity() {
    const quantities = basket.map(kanap => kanap.quantity);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    
    document.getElementById("totalQuantity").innerHTML = quantities.reduce(reducer, 0);
}

// Fonction qui va modifier la quantité d'un produit et recharger la page afin de recalculer le prix total du panier et la quantité total de produit
function changeQuantityFromLocalStorage(){
    const value = Number(this.value);
    const article = this.closest('article');
    const id = article.dataset.id;
    const color = article.dataset.color;   
    const object = basket.find(x => x.id === id && x.color === color);

    if(value === 0) {
        object.quantity = 1;
    } else if (value > 100){
        object.quantity = 100;
    } else{
        object.quantity = value;
    }

    saveToLocalStorage(basket);
    computeTotalPrice();
    computeTotalQuantity();


}

// Fonction qui va supprimer un article dans le localStorage et le supprimer aussi de l'array apiProducts
function removeFromLocalStorage(){
    const article = this.closest('article');
    const id = article.dataset.id;
    const color = article.dataset.color;
    const objectIndex = basket.findIndex(x => x.id === id && x.color === color);

    basket.splice(objectIndex, 1);
    apiProducts.splice(objectIndex, 1);
    article.remove();

    computeTotalPrice();
    computeTotalQuantity();
    saveToLocalStorage(basket);
}

// Vérification input First Name
function validateFirstName(element) {
    const errorElement = element.nextElementSibling;

    if(lastNameRegex.test(element.value)) {
        errorElement.innerHTML = "";
        return true;
    } else {
        errorElement.innerHTML = "Entrez un prénom valide (sans chiffres, sans espace, seule le - est autorisé)";
        return false;
    }
}

// Vérification input Last Name
function validateLastName(element) {
    const errorElement = element.nextElementSibling;

    if(lastNameRegex.test(element.value)) {
        errorElement.innerHTML = "";
        return true;
    } else {
        errorElement.innerHTML = "Entrez un nom valide (sans chiffres, sans espace, seule le '-' est autorisé)";
        return false;
    }
}

// Vérification input Address
function validateAddress(element) {
    const errorElement = element.nextElementSibling;

    if(addressRegex.test(element.value)) {
        errorElement.innerHTML = "";
        return true;
    } else {
        errorElement.innerHTML = "Entrez une adresse valide";
        return false;
    }
}

// Vérification input City
function validateCity(element) {
    const errorElement = element.nextElementSibling;

    if(cityRegex.test(element.value)) {
        errorElement.innerHTML = "";
        return true;
    } else {
        errorElement.innerHTML = "Entrez une ville valide (sans chiffres, sans espace, seule le '-' est autorisé)";
        return false;
    }
}

// Vérification input Email
function validateEmail(element) {
    const errorElement = element.nextElementSibling;

    if(emailRegex.test(element.value)) {
        errorElement.innerHTML = "";
        return true;
    } else {
        errorElement.innerHTML = "Entrez une addresse e-mail valide";
        return false;
    }
}

// Fonction qui va créer un objet contact avec le tableau du panier 
function createOrderJsonData(contactData) {
    let contact = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        address: contactData.address,
        city: contactData.city,
        email: contactData.email,
    };
    let products = basket.map(object => object.id);

    return JSON.stringify({ contact, products });
}

