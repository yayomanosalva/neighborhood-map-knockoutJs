// Google Maps JavaScript API
var map;
var marker;
'use strict'; // turn on Strict Mode
function Mapa() {
    
    /* ========= class for the Map function =========*/
    var myLatLng = {
        lat: 11.00414,
        lng: -74.8132908
    };

    var myOptions = {
        zoom: 17,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        disableDefaultUI: true,
        streetViewControl: false
    };

    this.infoShow = '';

    this.map = new google.maps.Map(document.getElementById('map'), myOptions);

    var contentString = '<div id="CSSinfowindow">'+
                            '<div id="title"></div>'+
                            '<div id="content" style="width:250px;height:280px;margin-top:1rem;">'+
                            '</div>'+
                        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });    
    /* ========= View model taht work whit knockout js =========*/
    var ViewModel = function() {
        var self = this;
        self.title = ko.observable('Store and Restaurant');
        /* ========= Marker function, so define the markers =========*/
        self.Marker = function(name, lat, long, category) {
            this.name = ko.observable(name);
            this.lat = ko.observable(lat);
            this.long = ko.observable(long);
            this.category = ko.observable(category);
            var marker;
            
            /* ========= Images Icons  =========*/
            // Setup the different icons
            //images restaurants
            this.img = {
                url: 'images/restaurants.png',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(35, 52),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
            };
            //images store
            this.img2 = {
                url: 'images/store.png'
            };

            var markerOptions = {
                position: new google.maps.LatLng(lat, long),
                title: name,
                map: map,
                icon: this.img,
                draggable: false,
                animation: google.maps.Animation.DROP
            };

            //marker
            marker = new google.maps.Marker(markerOptions);

            //click event close and open streetview
            marker.addListener('click',toggleBounce, function() {
                if (infowindow) {
                    infowindow.close();
                }
                infowindow.setContent(contentString);
                infowindow.open(map, this);
                map.setZoom(18);
            });

            //Click on item in list view
            this.listViewClick = function() {
                marker.map.setZoom(18);
                infowindow.setContent(contentString);
                marker.map.setCenter(marker.getPosition());
                infowindow.open(map,marker);
                self.getinfo(marker.position, name);
                toggleBounce();             
            };

            function toggleBounce() {
              if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
              }
            } 
            this.isVisible = ko.observable(false);

            this.isVisible.subscribe(function(currentState) {
                if (currentState) {
                    marker.setMap(map);
                } else {
                    marker.setMap(null);
                }
            });

            this.isVisible(true);    
        }


        /* ========= Array knockout js =========*/
        self.locations = ko.observableArray([
            new self.Marker('Mc donald', 11.004012, -74.812481, 'restaurant'),
            new self.Marker('Hamburguesas El Corral', 11.004836, -74.812189, 'restaurant'),
            new self.Marker('Restaurante El Pulpo Paul', 11.003132, -74.810671, 'restaurant'),
            new self.Marker('Restaurante LUPI', 11.005128, -74.811161, 'restaurant'),
            new self.Marker('farma todo cll 82', 11.0030974, -74.81542189999999, 'store'),
            new self.Marker('farma todo kr 51b', 11.004114, -74.813444, 'store')
        ]);

        /* ========= Computed Observables Search =========*/
        self.query  = ko.observable('');
        /* object to hold our map instance  */
        self.search = ko.computed(function() {
            return ko.utils.arrayFilter(self.locations(), function(i) {
                var mostrar = i.name().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
                i.isVisible(mostrar);

                return mostrar;
            });
        });

        //Ajax request 
        self.getinfo = function(location, name){
            var point = ''+location+'';
            point= point.substr(1, point.length-2);
            var client_id = 'L5X0WMFH5DSAT3IIJZLJPXUBL0ZGROL3SUOFVBNXTLQOOHVU';
            var client_secret = 'PEULSESS3KAZOGSS2WB5LAJBVRBJ1VER2WCWAYNFNZYFNKZD';
            var base_url = 'https://api.foursquare.com/v2/';
            var endpoint = 'venues/search?';

            var params = '&ll=' + point; 
            var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20160602';
            var url = base_url+endpoint+params+key;
            console.log(url);

            $.getJSON(url)
                .done(function(response) {
                    console.log( "second success" );
                    var venue = response.response.venues[0];
                    var encabezado='';
                    var div=$('#title');
                    var venueName = venue.name;
                    if (venueName !== null && venueName !== undefined){
                        encabezado = encabezado + 'name: ' +
                        venueName + '<br>';
                    }
                    /* phone number */
                    var venuephoneNum = venue.contact.formattedPhone;
                    if (venuephoneNum !== null && venuephoneNum !== undefined){
                        encabezado = encabezado + 'phone: ' +
                            venuephoneNum + '<br>';
                    }
                    /* twitter */
                    var twitterId = venue.contact.twitter;
                    if (twitterId !== null && twitterId !== undefined){
                        encabezado = encabezado + 'twitter name: ' +
                            twitterId + '<br>';
                    }
                    /* facebook */
                    var facebookId = venue.contact.facebookUsername;
                    if (facebookId !== null && facebookId !== undefined){
                        encabezado = encabezado + 'facebook name: ' +
                            facebookId + '<br>';
                    }
                    /* address */
                    var address = venue.location.address;
                    if (address !== null && address !== undefined){
                        encabezado = encabezado + 'address: ' +
                            address + '<br>';
                    }
                    /* city */
                    var city = venue.location.city;
                    if (city !== null && city !== undefined){
                        encabezado = encabezado + 'city: ' +
                            city + '<br>';
                    }
                    /* categories */
                    var categoria = venue.categories.name;
                    if (categoria !== null && categoria !== undefined){
                        encabezado = encabezado + 'categories: ' +
                            categoria + '<br>';
                    }
                    console.log(encabezado);
                    console.log(venueName);
                    div.append(encabezado);
                })
                .fail(function() {
                    encabezado = encabezado + 'Fouresquare has failed' +
                    console.log( "error" );
                });
        };

        

        //show streetview into infowindow
        var pano = null;
        google.maps.event.addListener(infowindow, 'domready', function() {
            if (pano !== null) {
                pano.unbind("position");
                pano.setVisible(false);
            }
            pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.ANDROID
                },
                enableCloseButton: false,
                addressControl: false,
                linksControl: false
            });
            pano.bindTo("position", this);
            pano.setVisible(true);
        });

        google.maps.event.addListener(infowindow, 'closeclick', function() {
            pano.unbind("position");
            pano.setVisible(false);
            pano = null;
        });

    };

    /* ========= Call the functions ViewModel =========*/
    ko.applyBindings(new ViewModel());
}
