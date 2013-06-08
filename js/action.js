(function($, window, undefined) {
    var nsd = {};
    var config = {};
    var shared = {};
    var effect = {};
    var markers = [];
    var spots;
    window.nsd = nsd;
    window.setuser = setWeiboUser;
    var connecting = false;
    config.api_path = "api/action.aspx";
    shared.animation = {};
    shared.screen = {};
    shared.animation.flash = function(obj) {
        var icon = obj.getIcon();
        icon.fillOpacity = .45;
        obj.setIcon(icon);
    };
    nsd.user = {};
    nsd.user.weibo = false;
    nsd.geoinfo = {};
    shared.gallery_id = 0;
    shared.mode = {};
    shared.mode.map = true;
    shared.mode.panorama = false;
    shared.mode.gallery = false;
    shared.mode.detail = false;
    shared.mode.my_journey = false;

    effect.fadeIn = function(obj, duration, delay, callback) {
        TweenLite.delayedCall(delay, function() {
            $(obj).show()
        });
        TweenLite.fromTo(obj, duration, {
            opacity : 0
        }, {
            opacity : 1,
            delay : delay === undefined ? 0 : delay,
            ease : Power2.easeOut,
            onComplete : callback
        });
    };
    effect.fadeOut = function(obj, duration, delay, callback) {
        TweenLite.to(obj, duration, {
            opacity : 0,
            delay : delay === undefined ? 0 : delay,
            ease : Power2.easeOut,
            onComplete : function() {
                $(obj).hide();
                if (callback !== undefined)
                    callback();
            }
        });
    };
    effect.spin = function() {
    };

    function showAlert(txt) {
        $('#alert').show();
        $('#alert p').html(txt);
        adjust();
        var pos = $('#alert').addClass('visible').position();
        TweenLite.fromTo('#alert', .4, {
            top : shared.screen.height * .1,
            opacity : 0
        }, {
            top : pos.top,
            opacity : 1,
            ease : Power2.easeOut,
            onComplete : function() {
                setTimeout(function() {
                    TweenLite.to('#alert', .2, {
                        top : shared.screen.height * .1,
                        opacity : 0,
                        ease : Power2.easeOut,
                        onComplete : function() {
                            $('#alert').hide();
                        }
                    });
                }, 2000);
            }
        });
    }

    function showUserAlert(type) {
        $('#auth').show();
        adjust();
        var pos = $('#auth').addClass('visible').position();
        TweenLite.fromTo('#auth', .4, {
            top : shared.screen.height * .1,
            opacity : 0
        }, {
            top : pos.top,
            opacity : 1,
            ease : Power2.easeOut
        });
    }

    function showBrowserAlert() {
        $('#chromeframe').show();
        adjust();
        $('#chromeframe').addClass('visible');
        TweenLite.fromTo('#chromeframe', .4, {
            top : 0,
            opacity : 0
        }, {
            top : shared.screen.height * .1,
            opacity : 1,
            ease : Power2.easeOut
        });
    }

    function formatNumber(num) {
        var str = String(Math.floor(num));
        if (str.length <= 3)
            return str;
        var r = "";
        for (var i = 0; i <= Math.floor(str.length / 3); i++) {
            var idx = str.length - 3 * (i + 1), len = 3;
            if (idx < 0) {
                len += idx;
                idx = 0;
            }
            if (len == 0)
                break;
            if (i > 0)
                r = ',' + r;
            r = str.substr(idx, len) + r
        }
        return r;
    }

    function formatFloat(num) {
        num = Math.floor(num * 10);
        return num / 10;
    }

    //cookie
    function getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }

    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    function adjust() {
        $('body').css('overflow-y', 'scroll');
        $('body').css('overflow-x', 'hidden');
        var wh = $(window).height(), ww = $(window).width(), sw = ww < 1280 ? 1280 : ww, sh = wh < 480 ? 480 : wh;
        $('body').css('overflow', '');
        shared.screen.height = sh;
        shared.screen.width = sw;
        $('.screen,#google_map .pattern,#google_map,#nav .expand,#user_action').css({
            height : sh,
            width : sw
        });
        var iw = Math.floor((sw - 20) / 9);
        nsd.size = {
            column : iw,
            height : sh,
            width : sw
        };
        shared.screen.column = iw;
        $('#google_map .pattern i').not(':first').css('margin-left', iw - 20);
        $('#ui_board').css('left', iw * 7);
        $('#main .copy').css('left', iw + 10);
        $('.col1').width(iw - 20);
        $('.col1-full').css('width', iw);
        $('#detail,#points_history').css({
            height : sh - 40,
            'padding-left' : iw + 10,
            width : iw * 4
        });
        $('#detail .article').height(sh - 40 - 88);
        $('#content .gallery-list .frame').height(sh - 20);
        $('#content .order1').css('right', -iw * 2);
        $('#content .order2,.gallery-list').css('right', -iw);
        $('#content .img > img').width($('#content .content').width());
        $('#content p.float-left > img,#content p.float-right > img').width($('#content .content').width() / 2);
        $('#content .gallery-list img').width($('#content .gallery-list ul').width()).removeAttr('height');
        $('#content .img-share span.ready').removeClass('ready');
        $('#content .img-hover > span,#content .img-expand,#content .img-expand > span,#content .img-share,#kv_index').each(setImageSize);
        $('#content .img-share input').width($('#content .img-share span').width() - 90 - 30);
        $('#content .img-share span').addClass('ready');
        $('#gallery .frame').each(setImageSize);
        $('#gallery .switch a').each(setImageSize);
        $('#nav .contract > p').css('width', sw - (iw + 20));
        $('#nav .expand .home').css({
            'margin-right' : (iw - 20) - (iw - 20) / 2,
            width : (iw - 20) / 2
        });
        if ($('#user_action').length > 0) {
            $('#user_action .bg').css('top', (sh - $('#user_action .bg').height()) / 2);
            $('#user_action .select p').css('left', $('#user_action .select a.email').position().left + $('#user_action .select a.email').width() - $('#user_action .select p').width() + 40);
        }
        $('#points_history blockquote > img').width($('#points_history blockquote').width());
        $('.col-square').each(function() {
            $(this).css('height', $(this).width());
        });
        if (shared.mode.panorama) {
            var ow = $('#panorama .view').data('width'), oh = $('#panorama .view').data('height'), pimg = $('#panorama .view img');
            pimg.css({
                height : '',
                left : 0
            });
            pimg.width(sw).css('top', (sh - pimg.height()) / 2);
            checkImageSize(pimg);
            $('#panorama .info .circle').css('left', (sw - 90) / 2);
            var rx = pimg.width() / ow, ry = pimg.height() / oh, pos = pimg.position();
            $('#panorama .dot').each(function() {
                $(this).css({
                    left : $(this).data('left') * rx + pos.left,
                    top : $(this).data('top') * ry + pos.top
                })
            });
            $('#panorama .hint .circle').css('margin-top', (shared.screen.height - $('#panorama .hint .circle').height()) / 2);
        }
        $('.overlay').each(function() {
            $(this).css({
                left : (shared.screen.width - $(this).width()) / 2 - 10,
                top : shared.screen.height * .2
            })
        });
    }

    function setImageSize(idx, obj) {
        var img = $(obj).prev(), frame = false, _switch = false, _content = false;
        if (img.length == 0 || img.prop('tagName').toLowerCase() != 'img') {
            img = $(obj).children();
            if ($(obj).hasClass('frame'))
                frame = true;
            else if ($(obj).parent().hasClass('switch'))
                _switch = true;
            else
                _content = true;
        }
        if (img.height() == 0) {
            setTimeout(function() {
                setImageSize(idx, obj);
            }, 200);
        } else {
            var sw = shared.screen.width, sh = shared.screen.height, iw = shared.screen.column;
            if (_content) {
                $(obj).children('img').width($(obj).width());
            } else if (frame) {
                if (img.height() > img.width()) {
                    img.height(sh).css('left', (sw - img.width()) / 2);
                } else {
                    img.css({
                        'height' : '',
                        'left' : 0
                    });
                    img.width(sw).css('top', (sh - img.height()) / 2);
                    checkImageSize(img);
                }
            } else if (_switch) {
                $(obj).width(iw * .6);
                var ih = img.height();
                $(obj).css({
                    height : ih,
                    top : (sh - ih) / 2
                })
            } else {
                $(obj).css({
                    height : img.height(),
                    width : img.width()
                }).children('a').css({
                    height : img.height() - 6,
                    width : img.width() - 6
                });
            }
        }
    }

    function checkImageSize(img) {
        if (img.height() < shared.screen.height) {
            img.css('width', '');
            img.height(shared.screen.height).css({
                'top' : 0,
                'left' : (shared.screen.width - img.width()) / 2
            });
        }
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

    function findMarkerFromList(m, list) {
        for (var i = 0; i < list.length; i++) {
            if (m === list[i].obj) {
                return list[i];
            }
        }
        return null;
    }

    function dateFormat(date) {
        var str = date.getFullYear() + '.';
        str += (date.getMonth() + 1) + '.';
        str += date.getDate()
        return str;
    }

    function dayPass(date) {
        var start = new Date(2013, 4, 24);
        var span = date.getTime() - start.getTime();
        return Math.ceil(span / 1000 / 3600 / 24);
    }

    function switchMenu(idx) {
        $('#nav .active').removeClass('active');
        $('#nav .contract span').eq(idx).addClass('active');
        $('#nav .expand .blocks > p').eq(idx + 1).addClass('active');
    }

    function showLatestPic() {
        if ($('#content:visible').length > 0)
            return;
        if (nsd.user.token == null) {
            showUserAlert();
            return;
        }

        var loc;
        var dist = 0;
        for (var i = nsd.data.location.length - 1; i >= 0; i--) {
            var obj = nsd.data.location[i];
            if (obj.Status == 2 || obj.Status == 3) {
                loc = obj;
                break;
            }
        }
        if (loc === undefined)
            return;
        $.post(config.api_path, {
            ac : "imgbyloc",
            loc : loc.ID
        }, function(data) {
            if (generalErrorHandle(data)) {
                nsd.data.gallery = data;
                initGallery(data, loc, true);
                adjust();
            }
        });
    }

    function markerClickHandle(e) {
        if (nsd.user.token == null) {
            showUserAlert();
            google.maps.event.addListenerOnce(this, 'click', markerClickHandle);
            return;
        }
        var loc, loc_data;
        var dist = 0;
        for (var i = 0; i < markers.length; i++) {
            dist += markers[i].distance;
            if (this === markers[i].obj) {
                loc = markers[i];
                loc_data = nsd.data.location[i];
                break;
            }
        }

        showLocation(loc, loc_data, dist);
    }

    function showLocation(loc, loc_data, dist) {
        var progress;
        if (nsd.user.token != null && loc.status == 2) {
            progress = new google.maps.Marker({
                position : loc.obj.getPosition(),
                clickable : false,
                map : nsd.map,
                icon : {
                    fillColor : '#e05206',
                    fillOpacity : 1,
                    strokeOpacity : 0,
                    path : getProgressSymbolPath(0),
                    anchor : new google.maps.Point(12, 12)
                },
                optimized : false,
                zIndex : 1
            });
        }
        $('#content').data('progress', {
            p : 0,
            origin : loc.obj,
            obj : progress,
            location : loc_data
        });

        $('#ui_info li').eq(0).children('span').html(loc_data.Location);
        var currTime = new Date(loc_data.CurrentTime + "+0800");
        $('#ui_info li').eq(1).children('b').html(dayPass(currTime));
        $('#ui_info li').eq(1).children('span').html(dateFormat(currTime));
        $('#ui_info li').eq(2).children('b').html(formatNumber(dist));
        $('#ui_info li').eq(3).children('span').html(formatFloat(loc_data.Latitude) + ', ' + formatFloat(loc_data.Longitude));
        $('#ui_info li').eq(4).children('b').html(loc_data.PhotoCount);

        shared.location = loc.id;
        $.post(config.api_path, {
            ac : "imgbyloc",
            loc : loc.id,
            seed : Math.random()
        }, function(data) {
            if (generalErrorHandle(data)) {
                nsd.data.gallery = data;
                if (loc.status == 2) {
                    var item = nsd.data.location[loc.index];
                    $('#detail h2').html(item.Title);
                    $('#detail .content').html(item.RichContent);
                    $('#content').show();
                    $('#detail .panorama a').click(function(e) {
                        e.stopPropagation();
                        getPanorama(0);
                    });
                }
                initGallery(data, loc);
                adjust();
                $('#content').addClass('visible');
                $('#detail,.right-button .browse').show();

                TweenLite.fromTo('#content', .4, {
                    left : -$('#content').width()
                }, {
                    left : 0,
                    ease : Power2.easeOut
                });
                //$('#content .order2,#content .order1').css('right', 0);
                var cw = $('#content .order2').width();
                TweenLite.fromTo('#content .order2', .2, {
                    right : 0
                }, {
                    right : -cw,
                    delay : .4,
                    ease : Power2.easeOut
                });
                TweenLite.fromTo('#content .order1', .2, {
                    right : 0
                }, {
                    right : -cw * 2,
                    delay : .4,
                    ease : Power2.easeOut,
                    onComplete : function() {
                        $(document).scrollTop(0);
                        $('#content .article').scrollTop(0);
                    }
                });
                if (loc.status == 2) {
                    nsd.map.setZoom(7);
                    nsd.map.panTo($('#content').data('progress').origin.getPosition());
                    var by = nsd.size.height / 2 - (nsd.size.height - $('#ui_board').height() + 10) / 2 - 20;
                    var bx = nsd.size.width / 2 - nsd.size.column;
                    nsd.map.panBy(-bx, -by);
                    nsd.map.setOptions({
                        draggable : false
                    });
                    clearInterval(config.timer);
                    var timer_sec = 0;
                    config.timer = setInterval(function() {
                        timer_sec++;
                        if (timer_sec < 5) {
                            movePattern();
                        } else {
                            clearInterval(config.timer);
                        }
                    }, 500);
                }
            }
        });
    }

    function initGallery(data, loc, show) {
        if (data === undefined)
            return;
        var list = data.list;
        shared.gallery_id = 0;
        var hideGallery = function() {
            $('#gallery').css('top', '100%');
            $('#ui_info,#nav').show();
        };
        //event register
        $('#content .img-share').append('<span><input type="text" placeholder="发表您的观点能赢取更多积分" /><a class="btn"><b>分享至：</b><i class="icon-weibo"></i></a></span>').find('span').click(function(e) {
            e.stopPropagation();
        }).end().find('a').click(postStatus);
        //hasLayout
        //$('#gallery').css('top', '100%').show();
        //$('.gallery-list').removeClass('visible');
        $('#content .mask,#content .right-button.back').hide();
        if (loc.status == 3 || loc.Status == 3 || show) {
            $('#gallery > .frame').click(function() {
                hideGallery();
                backToHome();
            });
            showGallery();
        } else {
            movePattern();
        }
    }

    function setSwitch() {
        var list = nsd.data.gallery.list;
        var next_id = shared.gallery_id + 1, prev_id = shared.gallery_id - 1;
        if (next_id >= list.length)
            next_id = 0;
        if (prev_id < 0)
            prev_id = list.length - 1;
        if (list.length == 2)
            prev_id += 2;
        var ids = [prev_id, next_id];
        $('#gallery > .frame').not('.active').remove();
        $('#gallery > .switch').empty();
        for (var i = 0; i < 2; i++) {
            var item = list[ids[i]];
            var frame = $('<div class="frame"/>').appendTo('#gallery');
            var img = $('<img/>').attr({
                src : item.FileName + 'b.jpg',
                alt : ''
            }).appendTo(frame);
            frame.data('id', item.ID);
            $('#gallery > .switch').append('<a data-index="' + ids[i] + '"><img src="' + item.FileName + 't.jpg' + '" /></a>');
        }
        if (list.length == 2) {
            $('#gallery > .switch').append('<a data-index="0"><img src="' + list[0].FileName + 't.jpg' + '" /></a>');
            $('#gallery > .switch').append('<a data-index="1"><img src="' + list[1].FileName + 't.jpg' + '" /></a>');
        }
        $('#gallery > .switch a').eq(1).addClass('next').end().eq(0).addClass('prev');
        $('#gallery > .switch .next,#gallery > .switch .prev').click(goFrame);
        $('#gallery > .frame').click(hideGallery);
        adjust();
    }

    function hideGallery() {
        $('#gallery').css('top', '100%').hide();
        $('#ui_info,#nav').show();
    }

    function goFrame() {
        if (shared.animating)
            return;
        var idx = $(this).data('index');
        var oid = shared.gallery_id, width = $('#gallery > .frame').width(), start, end, ids;
        var frames = $('#gallery > .frame').not('.active');
        if ($(this).hasClass('next')) {
            if (!$.isNumeric(idx))
                idx = $('#gallery > .switch .next').data('index');
            shared.gallery_id = idx;
            //$('#gallery > .frame').eq(idx).css('left', width).addClass('visible');
            start = {
                left : width
            };
            end = -width;
            ids = 1;
        } else {
            if (!$.isNumeric(idx))
                idx = $('#gallery > .switch .prev').data('index');
            shared.gallery_id = idx;
            //$('#gallery > .frame').eq(idx).css('left', -width).addClass('visible');
            start = {
                left : -width
            };
            end = width;
            ids = 0;
        }
        shared.animating = true;
        TweenLite.fromTo(frames.eq(ids).addClass('visible'), .8, start, {
            left : 0,
            ease : Power2.easeOut
        });
        TweenLite.to('#gallery > .frame.active', .8, {
            left : end,
            ease : Power2.easeOut,
            onComplete : function() {
                shared.animating = false;
                $('#gallery > .frame.active').removeClass('active');
                frames.eq(ids).addClass('active');
                setSwitch();
                $('#gallery > .pager span > b').text(idx + 1);
            }
        });
        /*$('#gallery > .frame').eq(idx).animate({
         left : 0
         }, 1000);
         $('#gallery > .frame').eq(oid).animate({
         left : end
         }, 1000, function() {
         $(this).removeClass('visible');
         setSwitch();
         $('#gallery .pager a.active').removeClass('active');
         $('#gallery .pager a').eq(idx).addClass('active');
         });*/
    }

    function showGallery() {
        var list = nsd.data.gallery.list;
        $('#gallery > .frame').remove();
        var idx = $(this).data('index');
        if (idx === undefined)
            idx = 0;
        shared.gallery_id = idx;
        setSwitch();
        //for (var i = 0; i < list.length; i++) {
        var item = list[idx];
        var frame = $('<div class="frame"/>').appendTo('#gallery');
        var img = $('<img/>').attr({
            src : item.FileName + 'b.jpg',
            alt : ''
        }).appendTo(frame);
        frame.data('id', item.ID).addClass('visible active');
        //$('#gallery > .pager').append('<a><i></i></a>');
        //}
        $('#gallery > .pager span').html('<b>1</b> / ' + list.length);
        //event register
        $('#gallery > .pager a').click(goFrame);
        $('#gallery > .frame').click(hideGallery);

        //$('#gallery > .frame').removeClass('visible').eq(shared.gallery_id).css('left', 0).addClass('visible');
        //$('#gallery > .pager a').removeClass('active').eq(shared.gallery_id).addClass('active');
        $('#gallery > .pager span > b').text(idx + 1);
        $('#gallery').css('top', 0).show();
        $('#ui_info,#nav').hide();
        adjust();
    }

    function movePattern() {
        var trans = $('#google_map .pattern').parent().css('transform');
        var m = /matrix\(([\d\s-,]+)\)/.exec(trans);
        if (m) {
            var args = m[1].replace(/\s/g, '').split(',');
            var x = Number(args[args.length - 2]);
            var y = Number(args[args.length - 1]);
            $('#google_map .pattern').css('transform', 'matrix(1,0,0,1,' + (-x) + ',' + (-y) + ')');
        } else {
            var left = $('#google_map .pattern').parent().css('left');
            var top = $('#google_map .pattern').parent().css('top');
            left = -Number(left.substr(0, left.length - 2));
            top = -Number(top.substr(0, top.length - 2));
            //console.log(left, top);
            $('#google_map .pattern').css({
                left : left,
                top : top
            });
        }
    }

    function checkBounds() {
        if (!config.allowedBounds.contains(nsd.map.getCenter())) {
            var C = nsd.map.getCenter();
            var X = C.lng();
            var Y = C.lat();

            var AmaxX = config.allowedBounds.getNorthEast().lng();
            var AmaxY = config.allowedBounds.getNorthEast().lat();
            var AminX = config.allowedBounds.getSouthWest().lng();
            var AminY = config.allowedBounds.getSouthWest().lat();

            if (X < AminX) {
                X = AminX;
            }
            if (X > AmaxX) {
                X = AmaxX;
            }
            if (Y < AminY) {
                Y = AminY;
            }
            if (Y > AmaxY) {
                Y = AmaxY;
            }

            nsd.map.setCenter(new google.maps.LatLng(Y, X));
        }
    }

    function initMap() {
        config.allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(18.895114, 75.21579), new google.maps.LatLng(45.90816, 121.89743));
        var _maker = ["ol-vehicle.png", "img/ol-dest-a.png", "img/ol-dest-b.png", "img/ol-dest-c.png", {
            url : "img/ol-stop.png",
            anchor : new google.maps.Point(11, 10.5)
        }, {
            url : "img/ol-spot.png",
            anchor : new google.maps.Point(8, 7.5)
        }];
        spots = [new google.maps.LatLng(43.91719, 81.3241), new google.maps.LatLng(25.021529, 98.490264), new google.maps.LatLng(31.240985, 121.474113)];
        var wayPoints = [];
        var initPoint = new google.maps.LatLng(40.353216, 98.349609);
        var mapOptions = {
            center : initPoint,
            zoom : 5,
            minZoom : 4,
            maxZoom : 8,
            mapTypeId : google.maps.MapTypeId.SATELLITE,
            disableDefaultUI : true,
            noClear : true,
            scrollwheel : false
        };
        nsd.map = new google.maps.Map(document.getElementById("google_map"), mapOptions);
        google.maps.event.addListener(nsd.map, 'bounds_changed', movePattern);
        google.maps.event.addListener(nsd.map, 'zoom_changed', movePattern);
        google.maps.event.addListener(nsd.map, 'center_changed', checkBounds);
        //google.maps.event.addListener(nsd.map, 'idle', movePattern);
        google.maps.event.addListenerOnce(nsd.map, 'idle', function() {
            var pt = $('#google_map .pattern').remove();
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
            ac : "getlocation",
            seed : Math.random()
        }, function(data) {
            if (generalErrorHandle(data)) {
                nsd.data.location = data.list;

                var distance = 0, pic_count = 0;
                for (var i = 0; i < data.list.length; i++) {
                    var loc = data.list[i];
                    distance += loc.Distance;
                    pic_count += loc.PhotoCount;
                    var pt = new google.maps.LatLng(loc.Latitude, loc.Longitude);
                    var marker = new google.maps.Marker({
                        position : pt,
                        map : nsd.map,
                        icon : _maker[loc.Type],
                        title : loc.Location,
                        optimized : false,
                        zIndex : (_maker.length - loc.Type) * 10
                    });
                    markers.push({
                        id : loc.ID,
                        index : i,
                        obj : marker,
                        type : loc.Type,
                        distance : loc.Distance,
                        status : loc.Status
                    });
                    if (loc.Type == 5 && i > 8) {
                        wayPoints.push({
                            location : pt
                        });
                    }
                    if (loc.Status == 2 || loc.Status == 3) {
                        google.maps.event.addListener(marker, 'mouseover', function(e) {
                            if ($('#content').data('progress') == null) {
                                this.setIcon({
                                    url : 'img/ol-hover.png',
                                    anchor : new google.maps.Point(70, 44)
                                });
                            }
                        });
                        google.maps.event.addListener(marker, 'mouseout', function(e) {
                            var obj = findMarkerFromList(this, markers);
                            this.setIcon(_maker[obj.type]);
                        });
                        google.maps.event.addListenerOnce(marker, 'click', markerClickHandle);
                    }
                }

                var directionsService = new google.maps.DirectionsService();
                directionsDisplay.setMap(nsd.map);
                var request = {
                    origin : markers[0].obj.getPosition(),
                    destination : markers[markers.length - 1].obj.getPosition(),
                    travelMode : google.maps.DirectionsTravelMode.DRIVING,
                    waypoints : wayPoints
                };
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        shared.main_route = response;
                        directionsDisplay.setDirections(response);
                        movePattern();
                    }
                });

                //TODO set default geo info
                var place = data.list[data.list.length - 1];
                var now = new Date();
                nsd.geoinfo.location = place.Location;
                nsd.geoinfo.past = dayPass(now);
                nsd.geoinfo.date = dateFormat(now);
                nsd.geoinfo.distance = distance;
                nsd.geoinfo.latlng = formatFloat(place.Latitude) + ', ' + formatFloat(place.Longitude);
                nsd.geoinfo.pics = pic_count;

                $('#ui_info li').eq(0).children('span').html(nsd.geoinfo.location);
                $('#ui_info li').eq(1).children('b').html(nsd.geoinfo.past);
                $('#ui_info li').eq(1).children('span').html(nsd.geoinfo.date);
                $('#ui_info li').eq(2).children('b').html(formatNumber(nsd.geoinfo.distance));
                $('#ui_info li').eq(3).children('span').html(nsd.geoinfo.latlng);
                $('#ui_info li').eq(4).children('b').html(formatNumber(nsd.geoinfo.pics));
                $('#intro .stat li').eq(0).children('span').text(formatNumber(nsd.geoinfo.distance));
                $('#intro .stat li').eq(1).children('span').text(data.list.length);
                $('#intro .stat li').eq(2).children('span').text(formatNumber(nsd.geoinfo.pics));

                var diststr = String(distance);
                var digioff = 6 - diststr.length;
                $('#ui_counter .digit b').text('0');
                for (var j = 0; j < diststr.length; j++) {
                    $('#ui_counter .digit').eq(j + digioff).children('b').text(diststr[j]);
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
                clickable : false,
                strokeOpacity : 0,
                icons : [{
                    icon : dashed,
                    offset : '0',
                    repeat : '6px'
                }]
            },
            //preserveViewport : true,
            suppressMarkers : true
        });
        shared.route = directionsDisplay;
    }

    //TODO panorama
    function getPanorama(idx) {
        if (nsd.data.panorama !== undefined) {
            showPanorama(nsd.data.panorama, idx);
            return;
        }
        $.getJSON('files/yili.json', {
            seed : Math.random()
        }, function(data) {
            nsd.data.panorama = data;
            shared.mode.panorama = true;
            shared.panorama = {};
            shared.panorama.discovered = 0;
            shared.panorama.array = [];
            shared.panorama.count = 0;
            shared.panorama.scene = data.count;
            for (var i in data.list) {
                shared.panorama.count += data.list[i].items.length;
            }
            $('#panorama .browse').empty();
            for (var j = 0; j < data.count; j++) {
                var thumb = $('<p class="img-hover"><img src="' + data.list[j].file + 't.jpg" /><span><a></a></span></p>');
                $('#panorama .browse').append(thumb);
            }
            $('#panorama .browse a').click(function() {
                var nid = $(this).index('#panorama .browse a');
                showPanorama(data, nid);
                $('#panorama .bar > span > i').hide();
                $('#panorama .browse').hide();
                $('#panorama .info .circle').show();
                $('#panorama .bar > span > span').show();
            });

            $('#panorama .hint').show();
            $('#panorama .info .circle').hide();
            showPanorama(data, idx);

            setTimeout(function() {
                effect.fadeOut('#panorama .hint', .4);
                effect.fadeIn('#panorama .info .circle', .4);
            }, 2000);
        });
    }

    function showPanorama(data, idx) {
        shared.panorama.index = idx;

        $('#panorama .view .dot').remove();
        $('#panorama .bar > span > span').html('<b>' + (idx + 1) + '</b> / ' + data.count);
        $('#panorama .info .circle b').text(shared.panorama.discovered);

        //var ratio = shared.screen.height / data.list[0].height;
        for (var i = 0; i < data.list[idx].items.length; i++) {
            var obj = data.list[idx].items[i];
            var dot = $('<a class="dot"><span><i><b></b></i></span></a>');
            dot.data({
                left : obj.x,
                top : obj.y,
                id : obj.id
            });
            $('#panorama .view > img').before(dot);
        }
        /*$('#panorama').mousemove(function(e) {
        shared.panorama.mouse = e.clientX;
        });*/
        //$('#panorama .view').after($('#panorama .view').clone().css('left', shared.screen.width)).addClass('active').data('left', 0);
        $('#panorama .view > img').attr('src', data.list[idx].file + 'b.jpg');
        $('#panorama .view').data({
            height : data.list[idx].height,
            width : data.list[idx].width
        });
        $('#panorama .dot').click(showPanel);
        $('#ui_board,#nav').hide();
        $('#panorama').show();
        adjust();
        //movePanorama();
    }

    function movePanorama() {
        var pos = -(shared.panorama.mouse - shared.screen.width / 2);
        if (pos) {
            var offset = Math.sin(Math.PI / 2 * pos / (shared.screen.width / 2)) * 5;
            if (offset >= 1 || offset <= -1) {
                var left = $('#panorama .view').data('left') + offset;
                var wi = $('#panorama .view img').width();
                var idx = $('#panorama .view.active').index('.view');
                var next = 1 - idx;
                if (wi + left <= shared.screen.width) {
                    left = shared.screen.width;
                } else if (left - wi >= shared.screen.width - wi) {
                    left = shared.screen.width - wi;
                }
                $('#panorama .view').data('left', left);
                $('#panorama .view').eq(idx).css('left', left);
                $('#panorama .view').eq(next).css('left', left - wi);
            }
        }
        shared.panorama.timer = setTimeout(movePanorama, 50);
    }

    function showPanel() {
        if ($('#panorama .panel:visible').length > 0 || $('#panorama .bar > span.active').length > 0)
            return;
        if (nsd.user.token == null) {
            showUserAlert();
            return;
        }

        //clearTimeout(shared.panorama.timer);
        var idx = $(this).index('.dot');
        var pos = $(this).position();
        var offset = $(this).parent().position().left;
        var id = $(this).data('id');
        if (!shared.panorama.array[id]) {
            //$('#panorama .dot:nth-child(' + (idx + 1) + ')').data('selected', true);
            shared.panorama.array[id] = 1;
            shared.panorama.discovered += 1;
            if (shared.panorama.discovered == shared.panorama.count) {
                $.post(config.api_path, {
                    ac : 'gamecomplete',
                    token : nsd.user.token,
                    game : 1
                }, function(data) {
                    if (generalErrorHandle(data)) {
                        showAlert('恭喜你！通过互动游戏获得<i>' + data.amount + '</i>点积分。');
                        setUserPoints(data.points);
                    }
                });
            }
        }
        $(this).addClass('active');
        $('#panorama .info .circle').removeClass('active').html('发现<b>' + shared.panorama.discovered + '</b>');
        $('#panorama .panel').css('left', pos.left + offset).css('visibility', 'hidden').show();
        var dir = 1;
        if (pos.left + offset + $('#panorama .panel').width() + 16 > shared.screen.width) {
            $('#panorama .panel').css('left', pos.left - offset - $('#panorama .panel').width() - 16);
            dir = -1;
        }
        var ch = $('#panorama .panel').children().text(nsd.data.panorama.list[shared.panorama.index].items[idx].desc).height();
        if (pos.top + 45 + ch + 20 > shared.screen.height) {
            $('#panorama .panel p').css('margin-top', pos.top - 45 - ch);
        } else {
            $('#panorama .panel p').css('margin-top', pos.top + 45);
        }
        $('#panorama .dot').not('.active').hide();
        $('#panorama .mask').addClass('close').one('click', function() {
            $('#panorama .dot.active').removeClass('active');
            //$('#panorama .panel').hide();
            $('#panorama .mask').removeClass('close');
            effect.fadeOut('#panorama .panel p', .2);
            var cw = $('#panorama .panel').css('visibility', '').width();
            if (dir > 0) {
                TweenLite.to('#panorama .panel', .2, {
                    width : 0,
                    delay : .2,
                    ease : Power2.easeOut
                });
            } else {
                var pl = $('#panorama .panel').css('left');
                pl = Number(pl.substr(0, pl.length - 2));
                TweenLite.to('#panorama .panel', .2, {
                    left : pl + cw,
                    width : 0,
                    delay : .2,
                    ease : Power2.easeOut
                });
            }
            effect.fadeOut('#panorama .mask', .2, .2, function() {
                $('#panorama .panel').width(cw).hide();
                $('#panorama .dot').show();
            });
            //movePanorama();
        });
        effect.fadeIn('#panorama .mask', .2);
        $('#panorama .panel p').hide();
        var cw = $('#panorama .panel').css('visibility', '').width();
        if (dir > 0) {
            TweenLite.fromTo('#panorama .panel', .4, {
                width : 0
            }, {
                width : cw,
                ease : Power2.easeOut
            });
        } else {
            var pl = $('#panorama .panel').css('left');
            pl = Number(pl.substr(0, pl.length - 2));
            TweenLite.fromTo('#panorama .panel', .4, {
                left : pl + cw,
                width : 0
            }, {
                left : pl,
                width : cw,
                ease : Power2.easeOut
            });
        }
        effect.fadeIn('#panorama .panel p', .2, .4);
        switchMenu(1);
    }

    function submitUser(e) {
        if (connecting)
            return false;
        if (e.keyCode) {
            if (e.keyCode != 13) {
                return;
            }
        } else if (e.charCode) {
            if (e.charCode != 13) {
                return;
            }
        }
        var form = $(this).parents('form');
        var email = form.find('[name="email"]');
        if (email.val() != "" && email.val() != email.attr('placeholder')) {
            if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email.val())) {
                alert("请输入正确的电子邮箱。");
                email.select();
                return false;
            }
        } else {
            alert("请输入电子邮箱。");
            email.focus();
            return false;
        }
        var pass = form.find('[name="pass"]');
        if (pass.val() != "" && pass.val() != pass.attr('placeholder')) {
            var repass = form.find('[name="repass"]');
            if (repass.length > 0) {
                if (repass.val() != "" && repass.val() != repass.attr('placeholder')) {
                    if (repass.val() != pass.val()) {
                        alert("两次输入的密码不匹配。");
                        repass.select();
                        return false;
                    }
                } else {
                    alert("请再输入一次密码。");
                    repass.focus();
                    return false;
                }
            }
        } else {
            alert("请输入密码。");
            pass.focus();
            return false;
        }
        connecting = true;
        form.find('button').addClass('loading');
        $.post(config.api_path, form.serialize(), function(data) {
            connecting = false;
            form.find('button').removeClass('loading');
            if (generalErrorHandle(data)) {
                userSignIn(data);
            }
        });
    }

    function userSignIn(data) {
        if (data.token == null || data.token == "" || data.token == "null") {
            userSignOut();
            return false;
        }
        nsd.user.token = data.token;
        setCookie("auth_token", data.token);
        if (data.sinaid != null && data.sinaid != "" && data.sinaid != 0) {
            setCookie("weibo_user", true);
            nsd.user.weibo = true;
        }
        if (shared.game_spots !== undefined) {
            for (var j = 0; j < shared.game_spots.length; j++) {
                shared.game_spots[j].setMap(null);
            }
            shared.game_spots = undefined;
        }
        if (shared.mode.my_journey) {
            goMyDiscovery();
        }
        setUserPoints(data.points);
        $('#ui_user .btns').hide();
        $('#ui_user .bar').show();
        $('#ui_user .btn-left').show();
        $('#user_action').hide();
    }

    function userSignOut() {
        nsd.user.token = null;
        nsd.user.points = null;
        nsd.user.weibo = false;
        if (shared.game_spots !== undefined) {
            for (var j = 0; j < shared.game_spots.length; j++) {
                shared.game_spots[j].setMap(null);
            }
            shared.game_spots = undefined;
        }
        if (shared.mode.my_journey) {
            goMyDiscovery();
        }
        setCookie("auth_token", null, new Date());
        setCookie("user_points", "", new Date());
        setCookie("weibo_user", "", new Date());
        $('#ui_user .btns').show();
        $('#ui_user .bar').hide();
        $('#ui_user .btn-left').hide();
    }

    function postStatus() {
        if (connecting)
            return;

        var status, input, serialized = false;
        if (this !== window && $(this).parent().prop('tagName').toLowerCase() == 'span') {
            input = $(this).prev();
        } else {
            input = $('#gallery .share textarea');
            serialized = true;
        }
        status = input.val();
        if (status == '') {
            alert("还是说一点什么吧。");
            input.focus();
            return false;
        }
        if (nsd.user.token == null) {
            //alert("请先登录。");
            showUserAlert();
            return;
        }
        if (!nsd.user.weibo) {
            alert("请先绑定一个微博账号。");
            openWeiboAuth();
            return;
        }
        var postData;
        if (serialized) {
            $('input[name="pic"]').val($('#gallery .frame.visible').children().attr('src'));
            $('input[name="token"]').val(nsd.user.token);
            $('input[name="url"]').val(window.location.href);
            $('input[name="gid"]').val($('#gallery .frame.visible').data('id'));
            postData = $('#gallery .share form').serialize();
        } else {
            postData = {
                ac : 'galleryshare',
                status : status,
                pic : $(this).parent().prev().attr('src'),
                token : nsd.user.token
            }
        }
        connecting = true;
        $.post(config.api_path, postData, function(data) {
            connecting = false;
            if (generalErrorHandle(data)) {
                setUserPoints(data.points);
                showAlert("<b>分享成功！</b>恭喜您获得了<i>" + data.amount + "</i>点积分。");
                input.val('');
                $('#gallery .mask').off('click').removeClass('cursor-close');
                effect.fadeOut('#gallery .share form', .4, 0, function() {
                    $('#gallery .share form').removeClass('bg');
                    $('#gallery .share,#gallery .share .pattern').css('height', '');
                    $('#gallery textarea').css('display', '');
                    $('#gallery .mask').hide();
                    $('#gallery .share p.submit span').width(0);
                    $('#gallery .share p.submit').removeClass('submit');
                });
            } else if (data.code == 114) {
                showAlert("分享成功！");
                input.val('');
            }
        });
    }

    function showPointsHistory() {
        resetScreen();
        $.post(config.api_path, {
            ac : 'pointshistory',
            token : nsd.user.token,
            seed : Math.random()
        }, function(data) {
            if (generalErrorHandle(data)) {
                var container = $('#points_history .article').empty();
                var date;
                for (var i = 0; i < data.list.length; i++) {
                    var obj = data.list[i];
                    var curDate = dateFormat(new Date(obj.AddTime));
                    if (!date || date != curDate) {
                        date = curDate;
                        container.append('<h2>' + date + '</h2><div class="block"></div>');
                    }
                    var block = container.find('.block:last');
                    var item = $('<div class="item"/>');
                    var point = $('<i class="circle"/>').text('+' + formatNumber(obj.Amount)).appendTo(item);
                    switch(obj.Type) {
                        case 1:
                            item.append('<p class="single-line">行进<b>' + obj.Quantity + '</b>公里</p>');
                            break;
                        case 2:
                            break;
                        case 3:
                            item.append('<blockquote><img src="' + obj.Content1 + '" /><div class="comment"><h5>我的评论</h5><p>' + obj.Content2 + '</p></div></blockquote>');
                            break;
                        case 4:
                            item.append('<img src="' + obj.Content1 + '" />')
                            break;
                        case 5:
                            item.append('<p class="single-line">' + obj.Summary + '</p>');
                            break;
                        default:
                            return;
                    }
                    block.append(item);
                }
                $('#content').addClass('visible');
                $('#detail,.right-button .browse,#content .mask-white').hide();
                $('#content,#points_history,.right-button .satellite').show();
                adjust();
                TweenLite.fromTo('#content', .4, {
                    left : -$('#content').width()
                }, {
                    left : 0,
                    ease : Power2.easeOut
                });
                var cw = $('#content .order2').width();
                TweenLite.fromTo('#content .order2', .2, {
                    right : 0
                }, {
                    right : -cw,
                    delay : .4,
                    ease : Power2.easeOut
                });
                TweenLite.fromTo('#content .order1', .2, {
                    right : 0
                }, {
                    right : -cw * 2,
                    delay : .4,
                    ease : Power2.easeOut
                });

                $('#content .gallery-list').removeClass('visible');
                $('#gallery').css('top', '100%');
            }
        });
        //switchMenu(1);
    }

    function setWeiboUser(data) {
        if (generalErrorHandle(data)) {
            setCookie("weibo_user", true);
            nsd.user.weibo = true;
            userSignIn(data);
        }
    }

    function setUserPoints(pt) {
        nsd.user.points = pt;
        setCookie("user_points", pt);
        $('#ui_user .bar span b').text(formatNumber(pt));
    }

    function openWeiboAuth() {
        var win = window.open("OAuth.aspx?auth=1", "auth_weibo", "width=615,height=505");
    }

    function generalErrorHandle(data) {
        if (data.code == 0)
            return true;
        if (data.code == 101) {
            alert("该邮箱已被使用。");
            $('input[name="email"]').select();
        } else if (data.code == 102) {
            alert("邮箱或密码错误。");
        } else if (data.code === 110) {
            ///alert("请先登录。");
            showUserAlert();
            userSignOut();
        } else if (data.code === 111) {
            //alert("请先登录。");
            showUserAlert();
            userSignOut();
        } else if (data.code == 112) {
            alert("微博账号已绑定到其它账号，请直接用微博账号登录。");
        } else if (data.code == 113) {
            alert("请先绑定你的微博账号。");
            openWeiboAuth();
        } else if (data.code == 114) {
            //alert("你已经访问过这个地方了。");
        } else {
            alert("发生错误，请重试。");
        }
        return false;
    }

    function showBottomPanel(id) {
        var define = ["#about", "#vehicle", "#media"];
        if (id >= define.length || id < 0)
            return;
        $(define[id]).show();
        TweenLite.fromTo(define[id] + ' .frame', .3, {
            bottom : -$(define[id] + ' .frame').height()
        }, {
            bottom : 0,
            ease : Power2.easeOut
        });
        TweenLite.fromTo(define[id] + ' .frame .head', .4, {
            opacity : 0
        }, {
            opacity : 1,
            delay : .2,
            ease : Power2.easeOut
        });
        TweenLite.killTweensOf('#main > .mask-alpha3,#main > .pattern-about');
        $('#main > .mask-alpha3,#main > .pattern-about').css('opacity', 1).show();
    }

    function resetScreen() {
        $('.gallery-list').removeClass('visible');
        $('#content .mask,#content .right-button.back').hide();
        $('#ui_info').show();
        var bottomPanels = $('#about:visible,#vehicle:visible,#media:visible');
        if (bottomPanels.length > 0) {
            TweenLite.to(bottomPanels.find('.frame .head'), .2, {
                opacity : 0,
                ease : Power2.easeOut
            });
            TweenLite.to(bottomPanels.find('.frame'), .3, {
                bottom : -bottomPanels.find('.frame').height(),
                delay : .1,
                ease : Power2.easeOut,
                onComplete : function() {
                    bottomPanels.hide();
                }
            });

            effect.fadeOut('#main > .mask-alpha3,#main > .pattern-about', .2, .1);
        }
        $('#points_history,.right-button .satellite').hide();
    }

    //TODO my
    function goMyDiscovery() {
        //shared.route.setMap(null);
        shared.mode.my_journey = true;
        for (var i = 0; i < markers.length; i++) {
            markers[i].obj.setMap(null);
        }
        var wayPoints = [];
        wayPoints.push({
            location : spots[1]
        });
        wayPoints.push({
            location : new google.maps.LatLng(21.345505, 110.287258)
        });
        wayPoints.push({
            location : new google.maps.LatLng(24.595675, 118.010818)
        });
        var dashed = {
            path : 'M 0,0 0,1',
            strokeColor : "#ffffff",
            strokeOpacity : 1,
            scale : 2
        };
        var directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions : {
                clickable : false,
                strokeOpacity : 0,
                icons : [{
                    icon : dashed,
                    offset : '0',
                    repeat : '6px'
                }]
            },
            suppressMarkers : true
        });
        //shared.my_route = directionsDisplay;

        if (shared.my_route === undefined) {
            var directionsService = new google.maps.DirectionsService();
            directionsDisplay.setMap(nsd.map);
            var request = {
                origin : spots[0],
                destination : spots[2],
                travelMode : google.maps.DirectionsTravelMode.DRIVING,
                waypoints : wayPoints
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    shared.my_route = response;
                    shared.route.setDirections(response);
                }
            });
        } else {
            shared.route.setDirections(shared.my_route);
        }

        if (nsd.user.token) {
            $.post(config.api_path, {
                ac : 'pointshistory',
                token : nsd.user.token,
                seed : Math.random()
            }, showMyDiscovery);
        } else {
            showMyDiscovery();
        }
    }

    function showMyDiscovery(data) {
        if (data !== undefined) {
            generalErrorHandle(data);
        }
        var anchors = [new google.maps.Point(52, 106), new google.maps.Point(33, 66)];
        var game_spots = [];
        for (var i = 0; i < spots.length; i++) {
            if (shared.game_spots !== undefined) {
                shared.game_spots[i].setMap(nsd.map);
                continue;
            }
            var icon;
            if (i > 0) {
                icon = {
                    url : 'img/my_' + i + '_off.png',
                    anchor : anchors[1]
                };
            } else {
                icon = {
                    url : 'img/my_' + i + '.png',
                    anchor : anchors[0]
                };
                if (data !== undefined) {
                    var sp = findLocation(i + 1, data.list);
                    if (sp) {
                        icon.url = 'img/my_' + i + '_on.png';
                        icon.anchor = anchors[1];
                    }
                }
            }
            var marker = new google.maps.Marker({
                position : spots[i],
                map : nsd.map,
                icon : icon
            });
            game_spots.push(marker);
            google.maps.event.addListener(marker, 'click', function(e) {
                var idx = $.inArray(this, game_spots);
                if (idx == 0)
                    getPanorama(0);
            });
        }
        $('#ui_info').hide();
        if (shared.game_spots === undefined)
            shared.game_spots = game_spots;
    }

    function gotoNextLocation(mk) {
        if (mk) {
            google.maps.event.addListenerOnce(mk.origin, 'click', markerClickHandle);
            if (mk.obj)
                mk.obj.setMap();
        }
        var loc = mk.location;
        var idx = $.inArray(loc, nsd.data.location) + 1;
        var valid = false;
        var obj;
        for (; idx < nsd.data.location.length; idx++) {
            obj = nsd.data.location[idx];
            if (obj.Status > 1) {
                valid = true;
                break;
            }
        }
        if (valid) {
            var loc = markers[idx];
            showLocation(loc, obj);
        }
    }

    function backToHome(e) {
        var mk = $('#content').data('progress');
        if (mk) {
            google.maps.event.addListenerOnce(mk.origin, 'click', markerClickHandle);
            if (mk.obj)
                mk.obj.setMap();
            nsd.map.setOptions({
                draggable : true
            });
            $('#content').data('progress', null);
        }
        switchMenu(0);
        if ($('#content:visible').length > 0) {
            TweenLite.to('#content .order1', .2, {
                right : 0,
                ease : Power2.easeOut
            });
            TweenLite.to('#content .order2', .2, {
                right : 0,
                delay : .1,
                ease : Power2.easeOut
            });
            TweenLite.to('#content .gallery-list', .2, {
                right : 0,
                delay : .1,
                ease : Power2.easeOut
            });
            TweenLite.to('#content', .4, {
                left : -$('#content').width(),
                delay : .2,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#content').hide();
                    $('.gallery-list ul').empty();
                }
            });

            $('#detail,.right-button a').show();
        }
        $('#points_history,.right-button .satellite').hide();
        $('#ui_info li').eq(0).children('span').html(nsd.geoinfo.location);
        $('#ui_info li').eq(1).children('b').html(nsd.geoinfo.past);
        $('#ui_info li').eq(1).children('span').html(nsd.geoinfo.date);
        $('#ui_info li').eq(2).children('b').html(formatNumber(nsd.geoinfo.distance));
        $('#ui_info li').eq(3).children('span').html(nsd.geoinfo.latlng);
        $('#ui_info li').eq(4).children('b').html(nsd.geoinfo.pics);
    }

    function findLocation(loc, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].ContentID == loc && list[i].Type == 4) {
                return true;
            }
        }
        return false;
    }

    function delegateListener() {
        $('#nav .contract').click(function() {
            effect.fadeOut('#nav .contract', .2);
            effect.fadeIn('#nav .expand', .2);
            var bh = $('#nav .blocks .col1').height();
            TweenLite.fromTo('#nav .blocks', .4, {
                bottom : -bh
            }, {
                bottom : 10,
                delay : .12,
                ease : Power2.easeOut
            });
        });
        $('#nav .expand').click(function() {
            var bh = $('#nav .blocks .col1').height();
            TweenLite.to('#nav .blocks', .3, {
                bottom : -bh,
                ease : Back.easeIn
            })
            effect.fadeOut('#nav .expand', .2, .3);
            effect.fadeIn('#nav .contract', .2, .4);
        });
        $('#nav .expand p').click(function() {
            if (!$(this).hasClass('active')) {
                resetScreen();
                var idx = $(this).index();
                switchMenu(idx - 1);
                switch(idx) {
                    case 1:
                        backToHome();
                        if (shared.mode.my_journey) {
                            $('#panorama').hide();
                            $('#ui_board').show();
                            shared.route.setDirections(shared.main_route);
                            for (var i = 0; i < markers.length; i++) {
                                markers[i].obj.setMap(nsd.map);
                            }
                            for (var j = 0; j < shared.game_spots.length; j++) {
                                shared.game_spots[j].setMap(null);
                            }
                            shared.mode.my_journey = false;
                        }
                        break;
                    case 2:
                        //showPointsHistory();
                        goMyDiscovery();
                        switchMenu(1);
                        break;
                    case 3:
                        showBottomPanel(0);
                        break;
                    case 4:
                        showBottomPanel(1);
                        break;
                    case 5:
                        showBottomPanel(2);
                        break;
                    default:
                        switchMenu(0);
                        break;
                }
            }
        });
        $('#btn_rule').click(function() {
            resetScreen();
            showBottomPanel(0);
            switchMenu(2);
        })
        $('#about .btn-simple').click(function() {
            $('#about').hide();
            $('#main > .mask-alpha3').hide();
            $('#main > .pattern-about').hide();
            switchMenu(0);
        });
        $('.cursor-close').click(function() {
            resetScreen();
            switchMenu(0);
        });
        $('#footer .share li').click(function() {
            var title = '发现无止境 中国最美前线', content = '路虎中国#发现无止境 中国最美前线#探享之旅，直驱边陲人迹罕至之境，挑战史无前例的全天候全地形路况，纵情尽揽伊犁的天地交融之千色，深入触涉腾冲的时光交汇之古香，探索上海的灵感碰撞之新尚，发现中国最前线的融合之美。', pic = '', url = 'http://lr-nsd.com/';
            switch ($(this).attr('class')) {
                case 'weibo':
                    shareToWeibo(content, pic, url);
                    break;
                case 'renren':
                    shareToRenren(title, content, pic, url);
                    break;
                case 'douban':
                    shareToDouban(content, pic, url);
                    break;
                default:
                    break;
            }
        });
        $('#detail .article').scroll(function() {
            var progress = $('#content').data('progress');
            var tp = $(this).scrollTop();
            var max = $('#detail .article .content').height() - $(this).height();
            var p = tp / max;

            if (progress && progress.obj) {
                if (p > progress.p) {
                    var icon = progress.obj.getIcon();
                    icon.path = getProgressSymbolPath(p);
                    progress.obj.setIcon(icon);
                    progress.p = p;
                }
                if (p >= 1) {
                    progress.p = 100;
                    //add point
                    if (nsd.user.token != null) {
                        $.post(config.api_path, {
                            ac : 'followroute',
                            token : nsd.user.token,
                            loc : shared.location
                        }, function(data) {
                            if (generalErrorHandle(data)) {
                                shared.animation.flash(progress.obj);
                                setUserPoints(data.points);
                                showAlert("恭喜您通过浏览行程获得了<i>" + data.amount + "</i>点积分。");
                                progress.obj.setMap();
                            }
                            gotoNextLocation(progress);
                        });
                    } else {
                        gotoNextLocation(progress);
                    }
                }
            } else if (p >= 1) {
                gotoNextLocation(progress);
            }
            //TODO mouse wheel
        }).on('mousewheel', function(e, delta, deltaX, deltaY) {
            if (delta == -1) {
                var tp = $(this).scrollTop();
                var max = $('#detail .article .content').height() - $(this).height();
                var p = tp / max;
                if (p > 1) {
                    return false;
                }
            }
        });
        $('#content .right-button a.browse').click(function(e) {
            e.stopPropagation();
            var data = nsd.data.gallery;
            var loc = $('#content').data('progress').location;
            $('.gallery-list ul').empty();
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];
                var li = $('<li class="img-hover"/>').appendTo('.gallery-list ul');
                var img = $('<img/>').attr({
                    src : item.FileName + 't.jpg',
                    alt : loc.Location
                }).appendTo(li);
                li.append('<span><a data-index="' + i + '"></a></span>');
            }
            adjust();
            $('#content .gallery-list li a').click(showGallery);
            $('#content .gallery-list').css('opacity', 0).addClass('visible');
            effect.fadeIn('#content .gallery-list', .4);
            $('#content .mask,#content .right-button.back').show();
        });
        $('#content').click(backToHome);
        $('#content .right-button.back a').click(function(e) {
            e.stopPropagation();
            $('.gallery-list').removeClass('visible');
            $('#content .mask,#content .right-button.back').hide();
        });
        $('#content .gallery-list').click(function(e) {
            e.stopPropagation();
        });
        $('#content .mask-white').click(function(e) {
            e.stopPropagation();
        });
        $('#gallery .share a.btn').hover(function() {
            $(this).children('span').width(50);
        }, function() {
            if (!$(this).parent().hasClass('submit'))
                $(this).children('span').width(0);
        }).click(function() {
            if ($(this).parent().hasClass('submit')) {
                postStatus();
            } else {
                $('#gallery .share form').addClass('bg');
                var fh = $('#gallery .share form').height();
                var ah = $('#gallery .share a.btn').height();
                $('#gallery .share').height(ah);
                $(this).parent().addClass('submit');
                $('#gallery textarea').hide();
                effect.fadeIn('#gallery .mask', .2);
                effect.fadeIn('#gallery .share form', .3);
                TweenLite.to('#gallery .share', .4, {
                    height : fh - ah - 8,
                    ease : Power2.easeOut
                });
                TweenLite.to('#gallery .share .bg .pattern', .4, {
                    height : fh - ah - ah - 8,
                    ease : Power2.easeOut
                });
                effect.fadeIn('#gallery textarea', .2, .4, function() {
                    $('#gallery textarea').focus();
                });
            }
            $('#gallery .mask').addClass('cursor-close').one('click', function() {
                $(this).removeClass('cursor-close');
                effect.fadeOut('#gallery .share form', .4, 0, function() {
                    $('#gallery .share form').removeClass('bg');
                    $('#gallery .share,#gallery .share .pattern').css('height', '');
                    $('#gallery textarea').css('display', '');
                    $('#gallery .mask').hide();
                    $('#gallery .share p.submit span').width(0);
                    $('#gallery .share p.submit').removeClass('submit');
                });
            });
        });
        $('#ui_user .btns a').click(function() {
            var idx = $(this).index();
            if ($(this).parent().hasClass('btn-left')) {
                goMyDiscovery();
                switchMenu(1);
                //showPointsHistory();
                return;
            }
            $('#user_action').show();
            if (idx == 0) {
                $('#user_action .pattern').hide();
                $('#user_action .select').show();
            } else {
                $('#user_action .pattern').hide();
                $('#user_action .select').hide();
                $('#user_action .register').show();
                $('.register input:first').focus();
            }
            adjust();
        });
        $('#ui_user .bar > span').click(showPointsHistory);
        $('#ui_user a.exit').click(userSignOut);
        $('#ui_info .pic').click(showLatestPic);
        $('#user_action a.weibo').click(function() {
            openWeiboAuth();
        });
        $('#user_action a.email').click(function() {
            $('#user_action').addClass('wide');
            $('.select').hide();
            $('.login').show();
            $('.login input:first').focus();
            adjust();
        });
        $('#user_action a.exist').click(function() {
            $('.select').hide();
            $('.register').show();
            $('.register input:first').focus();
            adjust();
        });
        $('#user_action .textbox').focus(function() {
            if ($(this).hasClass('placeholder')) {
                $(this).val('').removeClass('placeholder');
                if ($(this).hasClass('password'))
                    $(this).attr('type', 'password');
            }
        });
        $('#user_action .textbox').blur(function() {
            if ($(this).val() == "") {
                $(this).val($(this).attr('placeholder')).addClass('placeholder');
                if ($(this).hasClass('password'))
                    $(this).attr('type', 'text');
            }
        });
        $('#user_action .login p a').click(function() {
            $('#user_action .pattern').hide();
            $('#user_action .select').hide();
            $('#user_action .register').show();
            $('.register input:first').focus();
        });
        $('#user_action .mask').click(function() {
            $('#user_action').hide();
        });
        $('#user_action button').click(submitUser);
        $('#user_action input.textbox').keypress(submitUser);
        $('#about .tabs li').click(function() {
            if ($(this).hasClass('active'))
                return;
            var idx = $(this).index();
            $('#about .tab-item').hide().eq(idx).show();
            $('#about .tabs li.active').removeClass('active');
            $(this).addClass('active');
        });
        $('#panorama .info .circle').click(function() {
            if ($('#panorama .panel:visible').length > 0)
                return;
            if ($(this).hasClass('active')) {
                $('#panorama .mask').hide();
                $('#panorama .info .circle').html('发现<b>' + shared.panorama.discovered + '</b>');
            } else {
                $('#panorama .mask').css('opacity', '').show();
                $('#panorama .info .circle').html('剩余<b>' + (shared.panorama.count - shared.panorama.discovered) + '</b>');
            }
            $(this).toggleClass('active');
        });
        $('#panorama .bar > span').click(function() {
            if ($('#panorama .panel:visible').length > 0 || $('#panorama .info .circle.active').length > 0)
                return;
            if ($(this).hasClass('active')) {
                $(this).children('i').hide();
                $('#panorama .info .browse').hide();
                $('#panorama .info .circle').show();
                $(this).children('span').show();
            } else {
                $(this).children('i').show();
                $('#panorama .info .browse').show();
                $('#panorama .info .circle').hide();
                $(this).children('span').hide();
            }
            $(this).toggleClass('active');
        });
        $('#panorama .bar > a').click(function() {
            var nid;
            if ($(this).hasClass('next')) {
                nid = shared.panorama.index + 1;
                if (nid >= shared.panorama.scene)
                    return;
            } else {
                nid = shared.panorama.index - 1
                if (nid < 0)
                    return;
            }
            getPanorama(nid);
        });
        $('#panorama a.close').click(function() {
            $('#panorama').hide();
            $('#ui_board,#nav').show();
        });
        $('#auth .close').click(function() {
            TweenLite.to('#auth', .2, {
                top : shared.screen.height * .1,
                opacity : 0,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#auth').hide();
                }
            });
        });
        $('#auth .close').click(function() {
            TweenLite.to('#auth', .2, {
                top : shared.screen.height * .1,
                opacity : 0,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#auth').hide();
                }
            });
        });
        $('#auth .more a').click(function() {
            TweenLite.to('#auth', .2, {
                top : shared.screen.height * .1,
                opacity : 0,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#auth').hide();
                }
            });
            showBottomPanel(0);
        });
        $('#auth .login').click(function() {
            $('#auth').hide();
            $('#user_action').show();
            $('#user_action .pattern').hide();
            $('#user_action .select').show();
            adjust();
        });
        $('#auth .reg').click(function() {
            $('#auth').hide();
            $('#user_action').show();
            $('#user_action .pattern').hide();
            $('#user_action .select').hide();
            $('#user_action .register').show();
            $('.register input:first').focus();
            adjust();
        });
        $('#chromeframe .ignore a').click(function() {
            setCookie("upgrade_ignore", "yes", 1);
            TweenLite.to('#chromeframe', .2, {
                top : shared.screen.height * .1,
                opacity : 0,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#chromeframe').hide();
                }
            });
        });
    }

    if (/Android|webOS|iPhone|iPod|IEMobile|BlackBerry/i.test(navigator.userAgent)) {
        window.location.href = "http://lr-nsd.com/mobile";
        return;
    } else {
        $(function() {
            nsd.data = {};

            var weibo = getCookie("weibo_user");
            nsd.user.weibo = weibo || false;
            userSignIn({
                token : getCookie("auth_token"),
                points : Number(getCookie("user_points"))
            });
            $(window).resize(adjust);
            if (window.google === undefined) {
                var first = getCookie("first_visit");
                if (first !== null && first != "") {
                    window.location.href = "home.html";
                    return;
                } else {
                    setCookie("first_visit", "yes", 90);
                }
            } else {
                var ignore = getCookie("upgrade_ignore");
                if ($('html').hasClass('lt-ie9') && (ignore == null || ignore == "")) {
                    setTimeout(showBrowserAlert, 1000);
                }
                initMap();
            }
            //TODO will be remoted
            //getPanorama(0);
            delegateListener();
            adjust();
        });
    }
})(jQuery, window);
