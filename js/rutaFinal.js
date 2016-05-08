/**
 * Created by Carmen on 08/05/2016.
 */
var places = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var mapa;

//TODO poner tapas
//TODO poner imagenes uy videos al info

/**
 * funcion iniciar mapa
 */
function initialize() {

    var markers = [];


    var centro = new google.maps.LatLng(36.510071, -4.882447);
    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: centro
    }


    //creo el mapa por defecto
    mapa = new google.maps.Map(document.getElementById("map"), myOptions);


    //creo renderizador para las direcciones y lo asocio al mapa
    directionsDisplay = new google.maps.DirectionsRenderer(
        {
            map: mapa,
            //aqui quito los marcadores que se crean por defecto
            suppressMarkers: true
        }
    );


    //instancio un infowindow para cada paso de la ruta
    var infoWindow = new google.maps.InfoWindow;


    //boton
    var btnEnviar = document.getElementById('btnEnviar');

    //evento click del boton
    btnEnviar.onclick = function () {

        //capturo la informacion del restaurante y de la tapa
        var address = document.getElementById('address').value;
        var name = document.getElementById('name').value;
        var phone = document.getElementById('phone').value;
        var email = document.getElementById('email').value;

        //creo un objeto restaurante
        var restaurante = {
            nombre: name,
            telefono: phone,
            email: email,
            direccion: address,
            tapas: []
        };

        //añado el objeto al array
        places.push(restaurante);
        console.log(places);

        // console.log(places);
        //y calculo la ruta
        calcRoute(directionsDisplay, directionsService, markers, infoWindow, mapa);

        //creo el select con los restaurantes en el formulario de las tapas

        //capturo el select
        var select = document.getElementById('numRestaurante');

        //reseteo el select de los options
        select.innerHTML = "";

        //itero por cada places y añado un option para cada restaurante
        for (var i = 0; i < places.length; i++) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt);

        }


    };

    //boton para añadir las tapas
    var btnTapa = document.getElementById('btnTapa');


    btnTapa.onclick = function () {

        var puntoSeleccionado;

        //capturo los datos de la tapa
        var id = document.getElementById('numRestaurante').value;
        var nombreTapa = document.getElementById('nameTapa').value;
        /* var punto = document.getElementsByName('rate');
         for (var i = 0; i < punto.length; i++) {
         if (punto[i].checked) {
         puntoSeleccionado = punto[i].value;
         }

         }

         console.log(puntoSeleccionado);*/


        //creo un ob literal tapa
        var tapa = {
            nombre: nombreTapa
        };

        places[id].tapas.push(tapa);

    };


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
function calcRoute(directionsDisplay, directionsService, markers, stepDisplay, map) {

    //reset de los marcadores existentes
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }


    //variables
    //array con paradas intermedias
    var paradas = [];
    //primer lugar
    var origen = places[0].direccion;
    var destino;
    console.log(origen);

    //recorro el array de restaurantes
    for (var i = 1; i < places.length; i++) {

        //añado los restaurante intermedios entre el origen y el destino a los waypoints
        var lugar = places[i].direccion;

        //añado los lugares intermedios
        //salto el primero y el ultimo
        paradas.push({
            location: lugar,
            stopover: true
        });
    }

    destino = places[places.length - 1].direccion;
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

            //muestro los marcadores con el metododo
            mostrarPasos(response, markers, stepDisplay, map);
            //señalo las direcciones
            directionsDisplay.setDirections(response);

        } else {
            alert("directions response " + status);
        }
    });


}

/**
 * funcion que va a asociar un marcador personalizado a cada punto de la ruta
 * @param response -- respuesta de la peticion al servicio
 * @param markers --array marcadores
 * @param stepDisplay -- infowindow
 * @param map --mapa donde se muestra la ruta
 */
function mostrarPasos(response, markers, stepDisplay, map) {


    //por cada paso, asocio un marcador personalizado
    //añado el marcador al array

    var myRoute = response.routes[0];

    //recorro los distintos legs de la ruta
    for (var i = 0; i < myRoute.legs.length; i++) {
        //ceo un marcador con esas propiedades por defecto
        var marcador = markers[i] = markers[i] || new google.maps.Marker(
                {
                    title: 'Restaurante ' + (i + 1),
                    icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/marker' + (i + 1) + '.png'
                }
            );

        //creo el contenido del marcador
        var texto = "<h3>Nombre: <small>" +
            places[i].nombre +
            "</small></h3><h3>Telefono: <small>" +
            places[i].telefono +
            "</small></h3><h3>Email: <small>" +
            places[i].email +
            "</small></h3><h3>Dirección: <small>" +
            places[i].direccion +
            "</small></h3>";

        //TODO controlar cuando se añade una tapa
       /* for (var j = 0; j < places[i][4].length; j++) {
            var obj = places[j];
            console.log(obj);

        }*/
        //asocio el marcador al mapa
        marcador.setMap(map);
        //añado el marcador a la posicion del mapa correspondiente
        marcador.setPosition(myRoute.legs[i].start_location);

        //le pongo el texto al marcador
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

window.onload = initialize;
