"use strict";

import { getFromLocalStorage, localStorageHasKey } from "./localstorage.js";
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
    } else{
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

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

// Regex 
const nameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s-]{3,20}$/;
const addressRegex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]{5,120}$/;
const cityRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ.\s-]{3,30}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ ;

// Vérification des inputs du formulaire
// Vérification First Name
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
function validateFirstName() {
    console.log(firstName)
    if(nameRegex.test(firstName.value) === false) {
        console.log(nameRegex.test(firstName))
        return false;
    } else {
        firstNameErrorMsg.innerHTML = null;
        return true;
    }
}

// Vérification Last Name
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
function validateLastName() {
    console.log(lastName)
    if(nameRegex.test(lastName.value) === false) {
        console.log(nameRegex.test(lastName))
        return false;
    } else {
        lastNameErrorMsg.innerHTML = null;
        return true;
    }
}

// Vérification Address
const addressErrorMsg = document.getElementById("addressErrorMsg");
function validateAddress() {
    console.log(address)
    if(addressRegex.test(address.value) === false) {
        console.log(addressRegex.test(address))
        return false;
    } else {
        addressErrorMsg.innerHTML = null;
        return true;
    }
}

// Vérification City
const cityErrorMsg = document.getElementById("cityErrorMsg");
function validateCity() {
    console.log(city)
    if(cityRegex.test(city.value) === false) {
        console.log(cityRegex.test(city))
        return false;
    } else {
        cityErrorMsg.innerHTML = null;
        return true;
    }
}

// Vérification Email
const emailErrorMsg = document.getElementById("emailErrorMsg");
function validateEmail() {
    console.log(email)
    if(emailRegex.test(email.value) === false) {
        console.log(emailRegex.test(email))
        return false;
    } else {
        emailErrorMsg.innerHTML = null;
        return true;
    }
}

// Fonction qui va vérifier le formulaire entier et retourner un message d'erreur

function validateContact() {
    let prenom = validateFirstName();
    let nom = validateLastName();
    let adresse = validateAddress();
    let ville = validateCity();
    let mail = validateEmail();

    if(prenom == false || 
        nom == false || 
        adresse == false || 
        ville == false || 
        mail == false ) {
        if(prenom == false) {
            firstNameErrorMsg.innerHTML = "Entrez un prénom valide (sans chiffres, sans espace, seule le '-' est autorisé)";
            return false;
        }
        if(nom == false) {
            lastNameErrorMsg.innerHTML = "Entrez un nom valide (sans chiffres, sans espace, seule le '-' est autorisé)";
            return false;
        }
        if(adresse == false) {
            addressErrorMsg.innerHTML = "Entrez une adresse valide";
            return false;
        }
        if(ville == false) {
            cityErrorMsg.innerHTML = "Entrez une ville valide (sans chiffres, sans espace, seule le '-' est autorisé)";
            return false;
        }
        if(mail == false) {
            emailErrorMsg.innerHTML = "Entrez une addresse e-mail valide";
            return false;
        }
        
    } else{
        return true;
    }
}

// Fonction qui va créer un objet contact avec le tableau du panier 
function createOrderJsonData(){
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    let cartItems = getFromLocalStorage();
    let products = [];

    for (let i = 0; i < cartItems.length; i++) {

        if(products.find((e) => e == cartItems[i])){
            console.log("not found");
        } else {
            products.push(cartItems[i].id);
        }
    }
    let orderJsonData = JSON.stringify({ contact, products });
    return orderJsonData;
}

// Requête POST API pour envoyer la commande 


// Event listener bouton commander 
const orderButton = document.getElementById("order");
orderButton.addEventListener("click", (e) => {
    e.preventDefault();
    let validateForm = validateContact();
    let orderJsonData = createOrderJsonData();
    const postUrl ="http://localhost:3000/" + "api/products/order/";

    if(validateForm){
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
                let confirmationUrl = `confirmation.html?id=${data.orderId}`;
                window.location.href = confirmationUrl;
            })
            .catch(() => {
                alert("Une erreur est survenue, veuillez essayer ultérieurement");
            });
    }



});