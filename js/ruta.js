/**
 * Created by Carmen on 28/04/2016.
 */

//TODO marcar primer restaurante
//TODO sacar info window, datos de restaurante


var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var places = new Array();


/**
 * funcion iniciar mapa
 */
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var centro = new google.maps.LatLng(36.510071, -4.882447);
    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: centro
    }

    //creo el mapa
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    directionsDisplay.setMap(map);

    var contenido = "hola";

    infowindow = new google.maps.InfoWindow({
        content: contenido
    });

    //boton
    var btnEnviar = document.getElementById('btnEnviar');

    //evento click del boton
    btnEnviar.onclick = function () {

        //añado la direccion al array places
        var address = document.getElementById('address').value;

        places.push(address);

        //y calculo la ruta
        calcRoute();


    };


}

function calcRoute() {


    //variables
    //array con paradas intermedias
    var paradas = [];
    //primer lugar
    var origen = places[0];
    var destino;


    //si tengo mas de dos lugares
    if (places.length >= 2) {
        //si tengo un lugar
        if (places.length == 1) {
            console.log('nada');

        } else {
            //si tengo más lugares
            for (var i = 1; i < places.length - 1; i++) {

                var obj = places[i];

                //añado los lugares intermedios
                //salto el primero y el ultimo
                paradas.push({
                    location: obj,
                    stopover: true
                });
            }
        }


        //
        destino = places[places.length - 1];
        //creo un objeto request para la peticion de ruta
        var request = {
            origin: origen,
            destination: destino,
            waypoints: paradas,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };
        //creo la peticion de ruta
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                console.log(route);

            } else {
                alert("directions response " + status);
            }
        });
    } else {
        console.log('nada');

    }


}

function showInfo(response, markers, info, map) {

    var myRoute = response.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marcador = markers[i] || new google.maps.Marker;
        marcador.setMap(map);
        marcador.setPosition();

    }

}


window.onload = initialize;