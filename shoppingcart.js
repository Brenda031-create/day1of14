class product {
    constructor(name, price, availableQuantity) {
        this.name = name;
        this.price = price;
        this.availableQuantity = availableQuantity;
    }
}
class cartItem {
    constructor(product, quantityinthecart) {
        this.product = product;
        this.quantityinthecart = quantityinthecart;
    }
}
class shoppingCart {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    getItems() {
        return this.items;
    }
    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }
    updateItemQuantity(item, newQuantity) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items[index].quantityinthecart = newQuantity;
        }
    }
    clear() {
        this.items = [];
    }
    getTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantityinthecart), 0);
    }
}

const products =[];
products.push(new product("Laptop", 30000, 5));
products.push(new product("Mobile", 20000, 10));
products.push(new product("Tablet", 15000, 8));
console.log("Available products:", products);

const cart = new shoppingCart();
const item1 = new cartItem(products[0], 1);
const item2 = new cartItem(products[1], 2);
const item3 = new cartItem(products[2], 3);


cart.addItem(item1);
cart.addItem(item2);
cart.addItem(item3);
console.log("this are the items in the cart:", cart.getItems());
console.log("Total:", cart.getTotal());

const updateditem = new cartItem(products[1], 5);
cart.updateItemQuantity(item2, 5);
console.log("Updated items in the cart:", cart.getItems());
console.log("Updated total:", cart.getTotal());