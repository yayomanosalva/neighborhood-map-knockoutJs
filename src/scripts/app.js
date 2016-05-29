// Google Maps JavaScript API
var map;

function Mapa() {
    'use strict'; // turn on Strict Mode
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

    var map = new google.maps.Map(document.getElementById('map'), myOptions);

    var infowindow = new google.maps.InfoWindow({});

    /* ========= Marker function, so define the markers =========*/
    this.Marker = function(name, lat, long, category) {
        var self = this;
        self.name = ko.observable(name);
        self.lat = ko.observable(lat);
        self.long = ko.observable(long);
        self.category = ko.observable(category);
        var contentString = '<div id="content" style="width:250px;height:280px;"></div>';
        /* ========= Images Icons  =========*/
        // Setup the different icons
        //images restaurants
        var img = {
            url: 'images/restaurants.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(35, 52),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };
        //images store
        var img2 = {
            url: 'images/store.png'
        };

        //marker
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: name,
            map: map,
            icon: img,
            draggable: false,
            animation: google.maps.Animation.DROP
        });

        //click event close and open streetview
        marker.addListener('click', function() {
            if (infowindow) {
                infowindow.close();
            }
            infowindow.setContent(contentString);
            infowindow.open(map, this);
            map.setZoom(18);
            map.setCenter(marker.getPosition());
        });

        //function click knockout list view name
        //Click on item in list view
        this.listViewClick = function() {
            map.setZoom(18);
            infowindow.setContent(contentString);
            map.setCenter(marker.getPosition());
            infowindow.open(map, marker);
        };

        //Animation marker
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };
    }

    /* ========= Array knockout js =========*/
    this.locations = ko.observableArray([
        new Marker('Mc donald', 11.004012, -74.812481, 'restaurant', self),
        new Marker('Hamburguesas El Corral', 11.004836, -74.812189, 'restaurant', self),
        new Marker('Restaurante El Pulpo Paul', 11.003132, -74.810671, 'restaurant', self),
        new Marker('Restaurante LUPI', 11.005128, -74.811161, 'restaurant', self),
        new Marker('farma todo cll 82', 11.0030974, -74.81542189999999, 'store', self),
        new Marker('farma todo kr 51b', 11.004114, -74.813444, 'store', self)
    ]);

    /* ========= Computed Observables Search =========*/
    this.query = ko.observable('');
    /* object to hold our map instance  */
    this.search = ko.computed(function() {
        return ko.utils.arrayFilter(locations(), function(i) {
            return i.name().toLowerCase().indexOf(query().toLowerCase()) >= 0;
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
    /* ========= View model taht work whit knockout js =========*/
    var ViewModel = function() {
        var self = this;
        self.title = ko.observable('Store and Restaurant');
    };
    /* ========= Call the functions ViewModel =========*/
    ko.applyBindings(new ViewModel());
}