/**
 * Created by chaika on 25.01.16.
 */

$(function(){

    (function initTpls(tpls){
        var Templates = require('./Templates');
        for(var key in tpls){
            var selector = tpls[key];
            var $node = $(selector);
            var _html = (Templates[key])({});
            $node.html(_html);
        }
    })({
        header: '#header',
        footer: '#footer',
        cart: '#cart',
    });

    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var OrderForm = require('./OrderForm');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    OrderForm.init();

    if (window.google) {
        (require('./map')).initMap();}
});