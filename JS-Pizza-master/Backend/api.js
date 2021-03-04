const LIQPAY_PUBLIC_KEY = 'sandbox_i46839080240';
const LIQPAY_PRIVATE_KEY = 'sandbox_SG5uRPMdoHFnzmUje8NBCYcs7M3IulUj1chfhkC4';

var Pizza_List = require('./data/Pizza_List');

function liqpayOrder(order_info){
    var info = [];
    info.push('Name: ' + order_info.name);
    info.push('Address: ' + order_info.addr);
    info.push('Phone: ' + order_info.phone);
    info.push('Pizzas: ');
    var cart = [];
    if(order_info.cart) {
        try {
            cart = JSON.parse(order_info.cart);
        } catch(e) {
            console.log(e);
        }
    }
    const sizes = {big_size: 'велика', small_size: 'мала'};
    var sum = 0;
    cart.forEach(function(item){
        var size = item.size;
        var price = item.pizza[size].price;
        var qty = item.quantity;
        info.push('- ' + item.pizza.title + ' (' + sizes[size] + '): ' + qty + '*' + price);
        sum += qty * price;
    });
    info.push('Total sum: ' + sum);

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: 'pay',
        sandbox: 1,
        amount: sum,
        currency: 'UAH',
        description: info.join("\n"),
        order_id: Math.random(),
    };

    return order;
}

function liqpayData(order){
    return new Buffer(JSON.stringify(order)).toString('base64');
}

var crypto	=	require('crypto');
function sha1(string){
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

function liqpaySignature(data){
    return sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
}

exports.getPizzaList = function(req, res) {
    var Pizza_List = require('./data/Pizza_List');
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var order = liqpayOrder(order_info);
    var data = liqpayData(order);

    res.send({
        success: true,
        order: order,
        data: data,
        signature: liqpaySignature(data),
    });
};