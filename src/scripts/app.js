// Google Maps JavaScript API
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: new google.maps.LatLng(11.00414, -74.8132908),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: false,
    disableDefaultUI: true,
    streetViewControl: false
});

/* ========= Marker  =========*/
var Marker = function (name, lat, long, category) {
    var self = this;
    self.name = ko.observable();
    self.lat = ko.observable(lat);
    self.long = ko.observable(long);
    /* ========= Images Icons  =========*/
    // Setup the different icons

    var img = {
        url: 'images/restaurants.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(35, 52),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    var img2 = {
        url: 'images/store.png'
    }

    var contentString = '<div id="content" style="width:250px;height:300px;"></div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        icon: img
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    self.category = ko.observable();

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    var pano = null;
        google.maps.event.addListener(infowindow, 'domready', function() {
        if (pano != null) {
            pano.unbind("position");
            pano.setVisible(false);
        }
        pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
            navigationControl: true,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.ANDROID},
            enableCloseButton: false,
            addressControl: false,
            linksControl: false
        });
        pano.bindTo("position", marker);
        pano.setVisible(true);
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {
    pano.unbind("position");
    pano.setVisible(false);
    pano = null;
    });

}

var ViewModel = function (name) {
    var self = this;
    self.title = ko.observable('Store and Restaurant');
    self.name = ko.onservable();
    self.locations = ko.observableArray([
      new Marker('Mc donald', 11.004012, -74.812481, 'restaurant'),
      new Marker('Hamburguesas El Corral', 11.004836, -74.812189, 'restaurant'),
      new Marker('Restaurante El Pulpo Paul', 11.003132, -74.810671, 'restaurant'),
      new Marker('Restaurante LUPI', 11.005128, -74.811161, 'restaurant'),
      new Marker('farma todo cll 82', 11.0030974, -74.81542189999999, 'store'),
      new Marker('farma todo kr 51b', 11.004114,  -74.813444, false, 'store')
    ]);

    self.validatorStreetView = function() {

    }

};

ko.applyBindings(new ViewModel());