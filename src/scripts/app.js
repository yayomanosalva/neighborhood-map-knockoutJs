// Google Maps JavaScript API
var map;
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

    this.map = new google.maps.Map(document.getElementById('map'), myOptions);

    var contentString = '<div class="nytimes-container">'+'<h3 id="nytimes-header">New York Times Articles</h3>'+'<ul id="nytimes-articles" class="article-list">'+
        '<li><a href=""></a></li>'+'</div>';
    
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    /* ========= View model taht work whit knockout js =========*/
    var ViewModel = function() {
        var self = this;
        var marker;
        self.title = ko.observable('Store and Restaurant');
        /* ========= Marker function, so define the markers =========*/
        self.Marker = function(name, lat, long, category) {
            this.name = ko.observable(name);
            this.lat = ko.observable(lat);
            this.long = ko.observable(long);
            this.category = ko.observable(category);
            var contentString = '<div id="content" style="width:250px;height:280px;"></div>';
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
            this.marker = new google.maps.Marker(markerOptions);

            //click event close and open streetview
            this.marker.addListener('click',toggleBounce, function() {
                if (infowindow) {
                    infowindow.close();
                }
                infowindow.setContent(contentString);
                infowindow.open(map, this);
                map.setZoom(18);
                map.setCenter(this.marker.getPosition());
                marker.setAnimation(google.maps.Animation.BOUNCE)
                getApi();
                  if (marker.getAnimation() !== null) {
                      marker.setAnimation(null);
                  } else {
                      marker.setAnimation(google.maps.Animation.BOUNCE);
                  }
                  setTimeout(function() {
                      marker.setAnimation(null);
                  }, 1400);
            });

            //Click on item in list view
            this.listViewClick = function() {
                this.marker.map.setZoom(18);
                infowindow.setContent(contentString);
                this.marker.map.setCenter(this.marker.getPosition());
                infowindow.open(map, this.marker);                
            };            
        }

        //Animation marker
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };        

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
                return i.name().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            });
        });

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

        //api

    };

    /* ========= Call the functions ViewModel =========*/
    ko.applyBindings(new ViewModel());
}
