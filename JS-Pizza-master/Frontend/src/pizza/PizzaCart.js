var Templates = require('../Templates');
var basil	=	new (require('basil.js'))();

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var CartTotal = {
    quantity: 0,
    sum: 0,
    items: 0,
};
var CartOptions = {};

function saveCart(){
    console.log('saveCart()');
    console.log(Cart);
    basil.set('cart', Cart);
    console.log(basil.get('cart'));
}
function loadCart(){
    console.log('loadCart()');
    console.log(basil.get('cart'));
    Cart = basil.get('cart') || [];
    console.log(Cart);
    updateCart();
    return Cart;
}

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $cartItems = $("#cart-items");
var $cartSummary = $("#cart-summary");
var $totalQty = $cartSummary.find('.total.total-quantity');
var $totalSum = $cartSummary.find('.total.total-sum');
var $totalItems = $cart.find('.total.total-items');

function dropCart(){
    Cart = [];
    updateCart();
}
$cart.find('.cart-clear').click(function(){
    dropCart();
});

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var old_item = Cart.find(function(elem, index, array){
        return elem.pizza.id == pizza.id && elem.size == size;
    });
    if(old_item){
        old_item.quantity += 1;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart = Cart.filter(function(elem){
        return !(elem.pizza.id == cart_item.pizza.id && elem.size == cart_item.size);
    });

    updateCart();
}

function initialiseCart(options) {

    var _defaults = {
        // editable: true,
        editable: !$cart.hasClass('cart-const'),
    };
    Object.assign(CartOptions, _defaults, options || {});

    loadCart();

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function dropTotals() {
    CartTotal.quantity = 0;
    CartTotal.sum = 0;
    CartTotal.items = 0;
}

function updateTotals() {
    $totalQty.text(CartTotal.quantity);
    $totalSum.text(CartTotal.sum);
    $totalItems.text(CartTotal.items);
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
  //Очищаємо старі піци в кошику
    $cartItems.html("");
    dropTotals();

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(Object.assign({}, cart_item, {
            editable: CartOptions.editable,
        }));

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            if(cart_item.quantity > 1){
                cart_item.quantity -= 1;
            } else {
                removeFromCart(cart_item);
            }
            //Оновлюємо відображення
            updateCart();
        });
        $node.find('.delete').click(function(){
            removeFromCart(cart_item);
            updateCart();
        });

        $cartItems.append($node);
    }

    function processPizzaInCart(cart_item){
        CartTotal.quantity += cart_item.quantity;
        CartTotal.sum += cart_item.quantity*cart_item.pizza[cart_item.size].price;
        CartTotal.items += 1;
        showOnePizzaInCart(cart_item);
    }

    Cart.forEach(processPizzaInCart);
    updateTotals();
    if(CartTotal.quantity > 0){
        $cart.find('.cart-empty').hide();
    } else {
        $cart.find('.cart-empty').show();
    }

    saveCart();

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;

exports.getCart = function(){ return Cart; };
exports.getCartTotal = function(){ return CartTotal; };
