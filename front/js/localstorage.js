export function localStorageHasKey() {
    return !!localStorage.getItem("userBasket");
}

export function getFromLocalStorage() {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem("userBasket")) : [];
}

