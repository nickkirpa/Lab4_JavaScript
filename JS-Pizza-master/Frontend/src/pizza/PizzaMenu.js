var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = [];
var Pizza_Filters = require('../Pizza_Filters');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $filters = $('#pizza_filters');

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){

        if (filter.filter(pizza)){
            pizza_shown.push(pizza);

        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function showFilters(filters) {
    var _html = Templates.filters({filters: filters});
    $filters.html(_html).find("li:first").addClass("active");
    filters.forEach(function (filter){
        $filters.find("[href='#filter-" + filter.key + "']").click(function () {
            filterPizza(filter);
        });
    });
}

function initialiseMenu() {
    $.ajax('/api/get-pizza-list/', {
        dataType: 'json',
        success: function(json){
            Pizza_List = json;
            showPizzaList(json);
            showFilters(Pizza_Filters);
        },
    });

}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
