(function($, window, undefined) {
    var nsd = {};
    var config = {};
    window.nsd = nsd;
    config.api_path = "api/action.aspx";
    function adjust() {
        $('body').css('overflow-y', 'scroll');
        $('body').css('overflow-x', 'hidden');
        var wh = $(window).height(), ww = $(window).width(), sw = ww < 1280 ? 1280 : ww, sh = wh < 480 ? 480 : wh;
        $('body').css('overflow', '');
        $('.screen,.pattern,#google_map,#nav .expand').css({
            height : sh,
            width : sw
        });
        var iw = Math.floor((sw - 20) / 9);
        $('.pattern i').not(':first').css('margin-left', iw - 20);
        $('#map_control').css('bottom', 30);
        $('#ui_board').css('left', iw * 7);
        $('#nav').css('width', sw);
        $('#nav .col1').css('width', iw - 20);
        $('#nav .contract > p').css('width', sw - (iw + 20));
        $('#nav .expand .home').css({
            'margin-right' : (iw - 20) - (iw - 20) / 2,
            width : (iw - 20) / 2
        });
        $('.col-square').each(function() {
            $(this).css('height', $(this).width());
        });
    }

    function initMap() {
        if (window.google === undefined)
            return;
        var _maker = ["img/ol-dest-a.png", "img/ol-dest-b.png", "img/ol-dest-c.png", "img/ol-stop.png", "img/ol-spot.png"];
        var wayPoints = [];
        var initPoint = new google.maps.LatLng(28.68883, 115.884);
        var mapOptions = {
            center : initPoint,
            zoom : 5,
            minZoom : 4,
            mapTypeId : google.maps.MapTypeId.SATELLITE,
            disableDefaultUI : true,
            noClear : true,
            scrollwheel : false
        }, movePattern = function() {
            var trans = $('.pattern').parent().css('transform');
            var m = /matrix\(([\d\s-,]+)\)/.exec(trans);
            if (m) {
                var args = m[1].replace(/\s/g, '').split(',');
                var x = Number(args[args.length - 2]);
                var y = Number(args[args.length - 1]);
                $('.pattern').css('transform', 'matrix(1,0,0,1,' + (-x) + ',' + (-y) + ')');
            }
        };
        nsd.map = new google.maps.Map(document.getElementById("google_map"), mapOptions);
        google.maps.event.addListener(nsd.map, 'bounds_changed', movePattern);
        google.maps.event.addListener(nsd.map, 'zoom_changed', movePattern);
        google.maps.event.addListenerOnce(nsd.map, 'idle', function() {
            var pt = $('.pattern').remove();
            $('#google_map:first-child > :first > :first > :first').prepend(pt);
        });
        google.maps.event.addDomListener($('#map_control')[0], 'click', function() {
            nsd.map.panTo(initPoint)
        });
        google.maps.event.addDomListener($('#map_control i')[0], 'click', function(e) {
            e.stopPropagation();
            nsd.map.setZoom(nsd.map.getZoom() + 1);
        });
        google.maps.event.addDomListener($('#map_control i')[1], 'click', function(e) {
            e.stopPropagation();
            nsd.map.setZoom(nsd.map.getZoom() - 1);
        });

        $.getJSON(config.api_path, {
            ac : "getlocation"
        }, function(data) {
            if (data.code == 0) {
                nsd.data.location = data.list;
                for (var i in data.list) {
                    var loc = data.list[i];
                    var pt = new google.maps.LatLng(loc.Latitude, loc.Longitude);
                    var beachMarker = new google.maps.Marker({
                        position : pt,
                        map : nsd.map,
                        icon : _maker[loc.Type - 1],
                        title : loc.Location,
                        zIndex : 6 - loc.Type
                    });
                    if (loc.Type == 5)
                        wayPoints.push({
                            location : pt
                        });
                }
            }
        });

        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(nsd.map);
        var request = {
            origin : new google.maps.LatLng(43.9171867, 81.3241043),
            destination : new google.maps.LatLng(43.82264, 87.60498),
            travelMode : google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
    
    function delegateListener(){
        $('#nav .btn').click(function(){
           $('#nav .contract').hide();
           $('#nav .expand').show(); 
        });
        $('#nav .expand').click(function(){
           $('#nav .contract').show();
           $('#nav .expand').hide(); 
        });
    }

    $(function() {
        nsd.data = {};
        adjust();
        $(window).resize(adjust);
        initMap();
        delegateListener();
    });
})(jQuery, window);