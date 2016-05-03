/**
 * Created by Carmen on 02/05/2016.
 */


var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var gmarkers = new Array();
var places = new Array();

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var centro = new google.maps.LatLng(36.510071, -4.882447);
    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: centro
    }
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    directionsDisplay.setMap(map);

    var btnEnviar = document.getElementById('btnEnviar');

    btnEnviar.onclick = function () {

        var address = document.getElementById('address').value;

        places.push(address);

        calcRoute();


    };
}

function calcRoute() {


    var paradas = [];
    var origen = places[0];
    var destino;


    if (places.length >= 2) {
        if (places.length == 1) {
            console.log('nada');
        } else {
            for (var i = 1; i < places.length - 1; i++) {

                var obj = places[i];

                paradas.push({
                    location: obj,
                    stopover: true
                });
            }
        }


        destino = places[places.length - 1];

        var request = {
            origin: origen,
            destination: destino,
            waypoints: paradas,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
            } else {
                alert("directions response " + status);
            }
        });
    } else {
        destino = null;

    }


}


window.onload = initialize;