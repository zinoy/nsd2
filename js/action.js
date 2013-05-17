(function($, window, undefined) {
    var nsd = {};
    var config = {};
    var markers = [];
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
        $('.col1').css('width', iw - 20);
        $('#nav .contract > p').css('width', sw - (iw + 20));
        $('#nav .expand .home').css({
            'margin-right' : (iw - 20) - (iw - 20) / 2,
            width : (iw - 20) / 2
        });
        $('.col-square').each(function() {
            $(this).css('height', $(this).width());
        });
    }

    function getProgressSymbolPath(p) {
        if (p > 1) {
            p = 1;
        } else if (p < 0) {
            p = 0;
        }

        var cx = 12;
        var cy = 12;
        var r = 12;
        var deg = p * Math.PI * 2;

        var x, y;
        x = cx + r * Math.sin(deg);
        y = cy - r * Math.cos(deg);

        $('#done').hide();
        if (p <= .5)
            return "M " + cx + "," + cy + " V 0 A " + r + "," + r + " 0 0,1 " + x + "," + y + " z";
        else if (p < 1)
            return "M " + cx + "," + cy + " V 0 A " + r + "," + r + " 0 1,1 " + x + "," + y + " z";
        else
            return getProgressSymbolPath(.999);
    }

    function initMap() {
        if (window.google === undefined)
            return;
        var _maker = ["ol-vehicle.png", "img/ol-dest-a.png", "img/ol-dest-b.png", "img/ol-dest-c.png", {
            url : "img/ol-stop.png",
            anchor : new google.maps.Point(11, 10.5)
        }, {
            url : "img/ol-spot.png",
            anchor : new google.maps.Point(8, 7.5)
        }];
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
        }, findMarkerFromList = function(m, list) {
            for (var i = 0; i < list.length; i++) {
                if (m === list[i].obj) {
                    return list[i];
                }
            }
            return null;
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

                for (var i = 0; i < data.list.length; i++) {
                    var loc = data.list[i];
                    var pt = new google.maps.LatLng(loc.Latitude, loc.Longitude);
                    var marker = new google.maps.Marker({
                        position : pt,
                        map : nsd.map,
                        icon : _maker[loc.Type],
                        title : loc.Location,
                        zIndex : (_maker.length - loc.Type) * 10
                    });
                    markers.push({
                        id : loc.ID,
                        index : i,
                        obj : marker,
                        type : loc.Type
                    });
                    if (loc.Type < 5) {
                        wayPoints.push({
                            location : pt
                        });
                    }
                    google.maps.event.addListener(marker, 'mouseover', function(e) {
                        this.setIcon({
                            url : 'img/ol-hover.png',
                            anchor : new google.maps.Point(70, 44)
                        });
                    });
                    google.maps.event.addListener(marker, 'mouseout', function(e) {
                        var obj = findMarkerFromList(this, markers);
                        this.setIcon(_maker[obj.type]);
                    });
                    google.maps.event.addListener(marker, 'click', function(e) {
                        var progress = new google.maps.Marker({
                            position : this.getPosition(),
                            clickable : false,
                            map : nsd.map,
                            icon : {
                                fillColor : '#e05206',
                                fillOpacity : 1,
                                strokeOpacity : 0,
                                path : getProgressSymbolPath(.73),
                                anchor : new google.maps.Point(12, 12)
                            },
                            optimized : true
                        });
                        $('#content').data('progress', progress);
                    });
                }
            }
        });

        var dashed = {
            path : 'M 0,0 0,1',
            strokeColor : "#ffffff",
            strokeOpacity : 1,
            scale : 2
        };
        var directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions : {
                strokeOpacity : 0,
                icons : [{
                    icon : dashed,
                    offset : '0',
                    repeat : '6px'
                }]
            },
            suppressMarkers : true
        });
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

    function delegateListener() {
        $('#nav .btn').click(function() {
            $('#nav .contract').hide();
            $('#nav .expand').show();
        });
        $('#nav .expand').click(function() {
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
