var $form = $('#order-form');
var $btn = $('#order-btn');
var $map = $('#order-map');
var $addr = $form.find('[name="addr"]');
var map = require('./map');
var liqpay = require('./liqpay');
var cart = require('./pizza/PizzaCart');

var Fields = [
    {
        name: 'phone',
        validator: function(value){
            return /^\+?[0-9]{3}-?[0-9]{6,12}$/.test(value);
        },
        errorMessage: 'Invalid phone number!',
    },
    {
        name: 'name',
        validator: function(value){
            return value.length >= 4 && value.length <= 36;
        },
        errorMessage: 'Ім\'я має бути від 4 до 36 символів!',
    },
    {
        name: 'addr',
        validator: function(value){
            return true;
        },
        errorMessage: 'Неправильна адреса!',
    },
];
var FormValid = false;
var $fields = {};

function initFields(){
    Fields.forEach(function(field){
        var $node = $('[name="' + field.name + '"]');
        $fields[field.name] = $node;
        $node.on('change blur', function(){
            doValidate(field);
        });
    });
}

function doValidate(field_info){
    var $node = $fields[field_info.name];
    var _isValid = (!field_info.validator || field_info.validator($node.val()));
    showValidness($node, _isValid, field_info.errorMessage);
    FormValid = FormValid && _isValid;
    return _isValid;
}

function formValidate(){

    FormValid = true;
    Fields.forEach(doValidate);
    return FormValid;
}

function showValidness($node, isValid, message){
    var $group = $node.closest('.form-group');
    var $help = $group.find('.help-block');
    if(isValid){
        $group.removeClass('has-error').addClass('has-success');
        $help.text('').slideUp();
    } else {
        $group.removeClass('has-success').addClass('has-error');
        if(message){
            $help.text(message).slideDown();
        } else {
            $help.text('').slideUp();
        }
    }
    return $node;
}

function onSubmit(){
    console.log('Form submitted....');

    if(formValidate()){
        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize() + '&cart=' + JSON.stringify(cart.getCart()),
            method: $form.attr('method'),
            success: function(response){
                console.log('API answered...'),
                console.log(response);
                liqpay.initLiqPay({
                    data: response.data,
                    signature: response.signature,
                });
            },
        });
    } else {
        //TODO: ...
    }
}

function initForm(){
    initFields();

    $btn.click(function(){
        onSubmit();
    });

    map.onClickAddress(function(addr){
        $addr.val(addr).trigger('change');
    });

    $addr.on('change', function(){
        map.setDestinationAddress($addr.val());
    });
}

module.exports = {
    init: initForm,
};
