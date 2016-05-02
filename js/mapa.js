/**
 * Created by Carmen on 27/04/2016.
 */

'use strict';
//funcion anonima de autollamada
(function () {

    // Defino las variables globales
    var map,
        geocoder,
        marker,
        infowindow;

    //variable global de lugares para almacenar varios
    var places = [];

    window.onload = function () {
        // creo un nuevo mapa
        var options = {
            zoom: 15,
            center: new google.maps.LatLng(37.09, -95.71),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'), options);
        // Code for catching the form submit event goes here

        //capturo el nodo del formulario
        var form = document.getElementById('formRestaurante');
        //capturo el evento submit del formulario
        form.onsubmit = function () {

            //capturo el input del address
            var address = document.getElementById('address').value;
            //hago la llamada al geocoder
            getCoordinates(address);
            //evito que el formulario se envie
            return false;
        };

        // Function que obtiene las coordenadas de una direccion mediante geocoding
        function getCoordinates(address) {

            //compruebo si existe ya el objeto geocode, si no creo uno
            if (!geocoder) {
                geocoder = new google.maps.Geocoder();
            }

            //objeto literal de tipo GeocoderRequest
            var geocoderRequest = {
                address: address
            };

            //hago un request de Geocode
            geocoder.geocode(geocoderRequest, function (results, status) {
                //compruebo si el estado es OK antes de seguir
                if (status == google.maps.GeocoderStatus.OK) {

                    //centrar el mapa a la location devuelta
                    map.setCenter(results[0].geometry.location);
                    //guardo este mapa dentro de un array
                    places.push(map);

                    for (var i = 0; i < places.length; i++) {
                        //compruebo si existe el marcador
                        //if (!marker) {
                        marker = new google.maps.Marker({
                            position: {
                                lat: places[i].center.lat(),
                                lng: places[i].center.lng()
                            },
                            map: map

                        });
                        //	};
                        //hay que meter el listener en una funcion anonima para llamarla inmediatamente y pasar la variable i
                        (function (i, marker) {

                            google.maps.event.addListener(marker, 'click', function () {

                                // compruebo si el infowindow no esta creado
                                if (!infowindow) {
                                    // creo el infowindow
                                    infowindow = new google.maps.InfoWindow();
                                }

                                //creo el contenido del infowindow con la direccion  y la posicion devuelta

                                var content = '<strong>' + results[0].formatted_address + '</strong><br />';
                                content += 'Lat: ' + results[0].geometry.location.lat() + '<br />';
                                content += 'Lng: ' + results[0].geometry.location.lng();

                                //añado el contenido al infowindow
                                infowindow.setContent(content);

                                //abro la ventana infowindow
                                infowindow.open(map, marker);
                            });

                        })(i, marker);

                    }
                    ;

                }
                ;
            });
        }

    };
})();

