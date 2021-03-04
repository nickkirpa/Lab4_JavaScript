var $input = $('#input-addr');
var map = null;
var $map = document.getElementById('order-map');
var callbacks = {};
const homeLatLng = {lng: 30.523011, lat: 50.465890};

function setAddressCenter(map, address){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function geocodeLatLng(latlng, callback){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location':latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng,	callback){
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"],
    }, function(response, status){
        console.log('Route response...');
        console.log(response);
        if(status == google.maps.DirectionsStatus.OK && response.routes){
            var leg = response.routes[0].legs[0];
            callback(null, {
                duration: leg.duration,
            });
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

function initMap() {
    var _center = homeLatLng;
    var mapOptions = {
        center: _center,
        zoom: 16,
    };

    map = new google.maps.Map($map, mapOptions);

    var _markerPos = _center;
    var marker = new google.maps.Marker({
        position: _markerPos,
        map: map,
        title: 'LanaPizza',
        icon: "/assets/images/map-icon.png",
    });

    $input.on('change', function(){
        setAddressCenter(map, $input.val());
    });


    google.maps.event.addListener(map, 'click', function(getCoordinates){
        var coordinates = getCoordinates.latLng;
        geocodeLatLng(coordinates, function(err, address){
            if(!err){
                console.log('Got address for click!..');
                console.log(address);
                (callbacks.onClickAddress || []).forEach(function(cb){
                    cb(address);
                });
            } else {
                console.log("No address")
            }
        });
    });

    return map;
}

function addListener(map, eventName, callback){
    google.maps.event.addListener(map, eventName, callback);
}

function setDestination(address){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({address: address}, function(results, status){
        if (status === 'OK') {
            calculateRoute(homeLatLng, results[0].geometry.location, function(err, result){
                if(!err && result.duration){
                    $('#output-time').text(result.duration.text);
                } else {
                    console.log('Error with the delivery time :(');
                }
            });
            $('#output-addr').text(address);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });
}

module.exports = {
    initMap: initMap,
    addMapListener: addListener,
    onClickAddress: function(callback){
        if(!callbacks.onClickAddress){
            callbacks.onClickAddress = [];
        }
        callbacks.onClickAddress.push(callback);
    },
    setDestinationAddress: setDestination,
};

