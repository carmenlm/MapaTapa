/**
 * Created by carmen on 3/05/16.
 */

//array de lugares para la ruta
var places = [];

function init() {

    console.log('arranco');
    //marcadores
    var markers = [];

    //instancio el servicio de indicaciones
    var directionsService = new google.maps.DirectionsService;

    //propiedade del mapa
    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(36.510071, -4.882447)
    };

    //creo un mapa por defecto
    var mapa = new google.maps.Map(document.getElementById('map'), myOptions);

    //creo renderizador para las direcciones y lo asocio al mapa
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    //instancio un infowindow para cada paso de la ruta
    var stepDisplay = new google.maps.InfoWindow;

    //muestro la routa entre el punto inicial y y el final
    calculoMuestroRuta(directionsDisplay, directionsService, markers, stepDisplay, mapa);


    //evento click del formulario

}


/**
 * funcion que va a calcular la ruta entre los puntos señalados y mostrar en cada
 * info de cada restaurante
 * @param directionsDisplay --renderizador del mapa
 * @param directionsService --servicio de indicaciones
 * @param markers -- marcadores de la ruta
 * @param stepDisplay --infowindows de cada punto
 * @param map --mapa donde se muestra la ruta
 */
function calculoMuestroRuta(directionsDisplay, directionsService, markers, stepDisplay, map) {

    //reset de los marcadores existentes
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    //capturo el punto inicio y fin
    //creo una peticion directionsRequest

    directionsService.route({
            origin: "marbella",
            destination: "fuengirola",
            travelMode: google.maps.TravelMode.WALKING
        }, function (response, status) {

            //ruta con direciones y paso response a la funcion para crear un marcador en cada paso
            if (status === google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
                mostrarPasos(response, markers, stepDisplay, map);
            } else {
                console.log('la peticion ha fallado');
            }


        }
    );


}


/**
 * funcion que va a asociar un marcador personalizado a cada punto de la ruta
 * @param response -- respuesta de la peticion al servicio
 * @param markers --array marcadores
 * @param stepDisplay -- infowindow
 * @param map --mapa donde se muestra la ruta
 */
function mostrarPasos(response, markers, stepDisplay, map) {

    var texto = "prueba";

    //por cada paso, asocio un marcador personalizado
    //añado el marcador al array

    /*var myRoute = response.routes[0].legs[0];
     for (var i = 0; i < myRoute.steps.length; i++) {
     var marcador = markers[i] = markers[i] || new google.maps.Marker;
     marcador.setMap(map);
     marcador.setPosition(myRoute.steps[i].start_location);
     attachInstructionText(stepDisplay, marcador, texto, map);

     }*/

    var myRoute = response.routes[0];
    console.log(myRoute);
    for (var i = 0; i < myRoute.legs.length; i++) {
        var marcador = markers[i] = markers[i] || new google.maps.Marker;
        marcador.setMap(map);
        marcador.setPosition(myRoute.legs[i].start_location);
        attachInstructionText(stepDisplay, marcador, texto, map);

    }

}

/**
 * funcion que añade el texto personalizado al infowindow
 * @param stepDisplay --infowindow
 * @param marcador --punto de la ruta
 * @param texto --texto personalizado
 * @param map -- mapa donde se muestra la ruta
 */
function attachInstructionText(stepDisplay, marcador, texto, map) {

    google.maps.event.addListener(marcador, 'click', function () {

        //abro el infowindow cuando el marcador es clickado
        stepDisplay.setContent(texto);
        stepDisplay.open(map, marcador);
    });

}

window.onload = init;
