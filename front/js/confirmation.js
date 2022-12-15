// Récupération de l'url de la page afin d'afficher le numéro de commande contenu dans celui-ci

const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
const orderId = document.getElementById("orderId");
orderId.innerHTML = id;