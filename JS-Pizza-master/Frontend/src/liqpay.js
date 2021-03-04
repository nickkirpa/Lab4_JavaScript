const SELECTOR = '#liqpay';

function initLiqPay(options, callbacks){
    options = options || {};
    options.embedTo = options.embedTo || SELECTOR;
    options.mode = options.mode || 'popup';
    var _checkout = LiqPayCheckout.init(options);
    for(var key in callbacks || {}){
        _checkout.on('key', callbacks[key]);
    }
    return _checkout;
}

module.exports.initLiqPay = initLiqPay;
