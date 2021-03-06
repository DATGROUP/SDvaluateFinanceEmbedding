var map;
var infowindow;
var marker;

var zoom_slider_value = $("#zoom_slider_value");
var map_height_slider = $("#map_height_slider");
var map_height_value = $("#map_height_value");
var map_container = $("#map-container");
var map_canvas = $("#map-canvas");
var map_width_slider = $("#map_width_slider");
var map_width_value = $("#map_width_value");


function initialize() {

    var title_value = $("#title").attr('placeholder');
    var street_value = $("#street").attr('placeholder');
    var city_value = $("#city").val();
    var zip_value = $("#zip").val();

    var lat_value = $("#geoip_lat").val();
    var lot_value = $("#geoip_lon").val();

    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(lat_value, lot_value)
    };

    var contentString = '<strong>' + title_value + '</strong><br>' +
        street_value + '<br>' +
        zip_value + ' ' + city_value + '<br><br>';

    infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat_value, lot_value),
        map: map
    });

    infowindow.open(map, marker);
}

function changeMarkerLocation() {
    var street = $("#street").val();
    var city = $("#city").val();

    var address = street + ',' + city;

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (data, status) {
        if (status == "OK") {
            var suggestion = data[0];
            var location = suggestion.geometry.location;
            console.debug(location);
            var latLng = new google.maps.LatLng(location.lat(), location.lng());

            marker.setPosition(latLng);
            map.setCenter(latLng);
        }
    });
}

function changeInfoWindowContent() {
    var title = $("#title").val();
    var street = $("#street").val();
    var zip = $("#zip").val();
    var city = $("#city").val();

    var contentString = '<strong>' + title + '</strong><br>' +
        street + '<br>' +
        zip + ' ' + city + '<br><br>';

    infowindow.setContent(contentString);
}

function getFinalWidgetCode(map) {
    var height = $("#map_height_value").val();
    var width = $("#map_width_value").val();
    var zoom = $("#zoom_combo").val();

    var title = $("#title").val().replace(/'/g, "\\'");;
    var street = $("#street").val().replace(/'/g, "\\'");;
    var zip = $("#zip").val().replace(/'/g, "\\'");;
    var city = $("#city").val().replace(/'/g, "\\'");;

    var center = map.getCenter();
    var lat = center.lat();
    var lon = center.lng();

    var mapType = map.getMapTypeId();
    var mapTypeStr = "";

    switch (mapType) {
        case "roadmap":
            mapTypeStr = "google.maps.MapTypeId.ROADMAP";
            break;
        case "satellite":
            mapTypeStr = "google.maps.MapTypeId.SATELLITE";
            break;
        case "hybrid":
            mapTypeStr = "google.maps.MapTypeId.HYBRID";
            break;
        case "terrain":
            mapTypeStr = "google.maps.MapTypeId.TERRAIN";
            break;
    }

    $.ajaxSetup({
        async: false
    });

    var hashId = '';

    var lbCode = "<a href='http://maps-generator.com/'>Maps Generator</a>\n";
    $.get('/google-maps-authorization/code.js').success(function (data) {
        if(data != null && data != '' && data != 'Something Went Wrong!') {
            lbCode = data;
            regExpMatches = data.match(/id=(.*)'/i);
            hashId = regExpMatches[1];
        }
    });

    var finalWidgetCode = "<script src='https://maps.googleapis.com/maps/api/js?v=3.exp'><\/script>" +
        "<div style='overflow:hidden;height:" + height + "px;width:" + width + "px;'><div id='gmap_canvas' style='height:" + height + "px;width:" + width + "px;'></div>" +
        "<style>#gmap_canvas img{max-width:none!important;background:none!important}</style></div>" +
        lbCode +
        "<script type='text/javascript'>function init_map(){" +
        "var myOptions = {" +
        "zoom:" + zoom + ",center:new google.maps.LatLng(" + lat + "," + lon + ")," +
        "mapTypeId: " + mapTypeStr + "};" +
        "map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);" +
        "marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(" + lat + "," + lon + ")});" +
        "infowindow = new google.maps.InfoWindow({" +
        "content:'<strong>" + title + "</strong><br>" + street + "<br>" + zip + " " + city + "<br>'" +
        "});" +
        "google.maps.event.addListener(marker, 'click', function(){" +
        "infowindow.open(map,marker);" +
        "});" +
        "infowindow.open(map,marker);" +
        "}" +
        "google.maps.event.addDomListener(window, 'load', init_map);" +
        "<\/script>";

    // send to server post request with finalWidgetCode
    if(hashId != '')
    {
        $.post('/save-widget-code', { uniqid: hashId, code: finalWidgetCode })
         .success(function (data) {
            //
        });
    }

    return finalWidgetCode;
}

google.maps.event.addDomListener(window, 'load', initialize);

//initSliders(map, marker);

$("#get_code_btn").click(function () {
    var finalCode = getFinalWidgetCode(map);
    $("#final_widget_code").val(finalCode);
});

$("#map_type_combo").change(function () {
    changeMapType(map, this.value);
});

$("#zoom_combo").change(function () {
    changeMapZoom(map, this.value);
});

$("#title").change(function () {
    changeInfoWindowContent();
});

$("#street").change(function () {
    changeMarkerLocation();
    changeInfoWindowContent();
});

$("#zip").change(function () {
    changeInfoWindowContent();
});

$("#city").change(function () {
    changeMarkerLocation();
    changeInfoWindowContent();
});

map_height_slider.slider({
    max: 1080,
    min: 200,
    value: 400,
    slide: function (event, ui) {
        map_height_value.val(ui.value);
        map_container.height(ui.value);
        map_canvas.height(ui.value);
        google.maps.event.trigger(map, 'resize');
        map.setCenter(marker.getPosition());
    }
});

map_width_slider.slider({
    max: 1920,
    min: 200,
    value: 520,
    slide: function (event, ui) {
        map_width_value.val(ui.value);
        map_container.width(ui.value);
        map_canvas.width(ui.value);
        google.maps.event.trigger(map, 'resize');
        map.setCenter(marker.getPosition());
    }
});

map_height_value.change(function () {
    if ($(this).val() < 200)
        $(this).val(200);

    map_container.height($(this).val());
    map_canvas.height($(this).val());
    google.maps.event.trigger(map, 'resize');
    map.setCenter(marker.getPosition());
});

map_width_value.change(function () {
    if ($(this).val() < 200)
        $(this).val(200);

    map_container.width($(this).val());
    map_canvas.width($(this).val());
    google.maps.event.trigger(map, 'resize');
    map.setCenter(marker.getPosition());
});

function changeMapType(map, mapTypeId) {
    map.setMapTypeId(mapTypeId);
}

function changeMapZoom(map, zoom) {
    zoom = zoom * 1;
    map.setZoom(zoom);
}
