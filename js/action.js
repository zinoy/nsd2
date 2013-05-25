(function($, window, undefined) {
    var nsd = {};
    var config = {};
    var shared = {};
    var markers = [];
    window.nsd = nsd;
    window.setuser = setWeiboUser;
    var connecting = false;
    config.api_path = "api/action.aspx";
    shared.animation = {};
    shared.animation.flash = function(obj) {
        var icon = obj.getIcon();
        icon.fillOpacity = .45;
        obj.setIcon(icon);
    };
    nsd.user = {};
    nsd.user.weibo = false;
    shared.gallery_id = 0;
    shared.formatNumber = function(num) {
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
        $('#google_map .pattern i').not(':first').css('margin-left', iw - 20);
        $('#map_control').css('bottom', 30);
        $('#ui_board').css('left', iw * 7);
        $('#main .copy').css('left', iw + 10);
        $('.col1').width(iw - 20);
        $('.col1-full').css('width', iw);
        $('#detail,#points_history').css({
            height : sh - 40,
            'padding-left' : iw + 10,
            width : iw * 4
        });
        $('#content .gallery-list .frame').height(sh - 20);
        $('#content .order1').css('right', -iw * 2);
        $('#content .order2,.gallery-list').css('right', -iw);
        $('#content .img > img').width($('#content .article').width());
        $('#content p.float-left > img,#content p.float-right > img').width($('#content .article').width() / 2);
        $('#content .gallery-list img').width($('#content .gallery-list ul').width());
        $('#content .img-hover > span').each(setImageSize);
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
        $('.col-square').each(function() {
            $(this).css('height', $(this).width());
        });
    }

    function setImageSize(idx, obj) {
        var img = $(obj).prev(), frame = false, _switch = false;
        if (img.length == 0 || img.prop('tagName').toLowerCase() != 'img') {
            img = $(obj).children();
            if ($(obj).hasClass('frame'))
                frame = true;
            else
                _switch = true;
        }
        if (img.height() == 0) {
            setTimeout(function() {
                setImageSize(idx, obj);
            }, 200);
        } else {
            var sw = $('.screen').width(), sh = $('.screen').height(), iw = $('.col1').width();
            if (frame) {
                img.width(sw).css('top', (sh - img.height()) / 2);
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
                }).children().css({
                    height : img.height() - 6,
                    width : img.width() - 6
                });
            }
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

    function markerClickHandle(e) {
        var progress;
        if (nsd.user.token != null) {
            progress = new google.maps.Marker({
                position : this.getPosition(),
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
            origin : this,
            obj : progress
        });
        nsd.map.setZoom(8);
        nsd.map.panTo(this.getPosition());
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
            if (timer_sec < 10) {
                movePattern();
            } else {
                clearInterval(config.timer);
            }
        }, 500);
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

        $('#ui_info li').eq(0).children('span').html(loc_data.Location);
        var currTime = new Date(loc_data.CurrentTime + "+0800");
        $('#ui_info li').eq(1).children('b').html(dayPass(currTime));
        $('#ui_info li').eq(1).children('span').html(dateFormat(currTime));
        $('#ui_info li').eq(2).children('b').html(shared.formatNumber(dist));
        $('#ui_info li').eq(3).children('span').html(loc_data.Latitude + ',' + loc_data.Longitude);
        $('#ui_info li').eq(4).children('b').html(loc_data.PhotoCount);

        shared.location = loc.id;
        $.post(config.api_path, {
            ac : "imgbyloc",
            loc : loc.id
        }, function(data) {
            if (generalErrorHandle(data)) {
                var item = nsd.data.location[loc.index];
                $('#detail h2').html(item.Title);
                $('#detail .content').html(item.RichContent);
                $('#content').show();
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
                initGallery(data, loc.Location);
                setTimeout(adjust, 200);
                //clearInterval(timer);
            }
        });
    }

    function initGallery(data, name) {
        if (data === undefined)
            return;
        var list = data.list;
        shared.gallery_id = 0;
        var setSwitch = function() {
            var next_id = shared.gallery_id + 1, prev_id = shared.gallery_id - 1;
            if (next_id >= list.length)
                next_id = 0;
            if (prev_id < 0)
                prev_id = list.length - 1;
            if (list.length == 2)
                prev_id += 2;
            $('#gallery > .switch a').removeClass().off('click').eq(next_id).addClass('next').end().eq(prev_id).addClass('prev');
            $('#gallery > .switch .next,#gallery > .switch .prev').click(goFrame);
        }, hideGallery = function() {
            $('#gallery').css('top', '100%');
            $('#ui_info').show();
        }, showGallery = function() {
            var idx = $(this).data('index');
            shared.gallery_id = idx;
            $('#gallery > .frame').eq(shared.gallery_id).addClass('visible');
            $('#gallery > .pager a').eq(shared.gallery_id).addClass('active');
            setSwitch();
            $('#gallery').css('top', 0);
            $('#ui_info').hide();
        }, goFrame = function() {
            if ($(this).hasClass('active'))
                return;
            var idx = $(this).data('index');
            if (!$.isNumeric(idx)) {
                idx = $(this).index();
            }
            var oid = shared.gallery_id, width = $('#gallery > .frame').width(), end;
            if ($(this).hasClass('next')) {
                shared.gallery_id = idx;
                $('#gallery > .frame').eq(idx).css('left', width).addClass('visible');
                end = -width;
            } else {
                shared.gallery_id = idx;
                $('#gallery > .frame').eq(idx).css('left', -width).addClass('visible');
                end = width;
            }
            $('#gallery > .frame').eq(idx).animate({
                left : 0
            }, 1000);
            $('#gallery > .frame').eq(oid).animate({
                left : end
            }, 1000, function() {
                $(this).removeClass('visible');
                setSwitch();
                $('#gallery .pager a.active').removeClass('active');
                $('#gallery .pager a').eq(idx).addClass('active');
            });
        };
        $('#gallery > .frame').remove();
        $('#gallery > .pager,#gallery > .switch').empty();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var frame = $('<div class="frame"/>').appendTo('#gallery');
            var img = $('<img/>').attr({
                src : item.FileName + 'b.jpg',
                alt : name
            }).appendTo(frame);
            frame.data('id', item.ID);
            $('#gallery > .pager').append('<a><i></i></a>');
            $('#gallery > .switch').append('<a data-index="' + i + '"><img src="' + item.FileName + 't.jpg' + '" /></a>');
        }
        if (list.length == 2) {
            $('#gallery > .switch').append('<a data-index="0"><img src="' + list[0].FileName + 't.jpg' + '" /></a>');
            $('#gallery > .switch').append('<a data-index="1"><img src="' + list[1].FileName + 't.jpg' + '" /></a>');
        }
        //event register
        $('#gallery > .frame').click(hideGallery);
        $('#gallery > .pager a').click(goFrame);
        $('#content .gallery-list li a').click(showGallery);
        //hasLayout
        $('#gallery').css('top', '100%').show();
        $('.gallery-list').removeClass('visible');
        $('#content .mask,#content .right-button.back').hide();
        movePattern();
    }

    function movePattern() {
        var trans = $('#google_map .pattern').parent().css('transform');
        var m = /matrix\(([\d\s-,]+)\)/.exec(trans);
        if (m) {
            var args = m[1].replace(/\s/g, '').split(',');
            var x = Number(args[args.length - 2]);
            var y = Number(args[args.length - 1]);
            $('#google_map .pattern').css('transform', 'matrix(1,0,0,1,' + (-x) + ',' + (-y) + ')');
        }
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
        };
        nsd.map = new google.maps.Map(document.getElementById("google_map"), mapOptions);
        google.maps.event.addListener(nsd.map, 'bounds_changed', movePattern);
        google.maps.event.addListener(nsd.map, 'zoom_changed', movePattern);
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
            ac : "getlocation"
        }, function(data) {
            if (generalErrorHandle(data)) {
                nsd.data.location = data.list;

                for (var i = 0; i < data.list.length; i++) {
                    var loc = data.list[i];
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
                        distance : loc.Distance
                    });
                    if (loc.Type < 5) {
                        wayPoints.push({
                            location : pt
                        });
                    }
                    if (loc.Status == 2) {
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
                        directionsDisplay.setDirections(response);
                    }
                });
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
            suppressMarkers : true
        });
    }

    function submitUser(e) {
        if (connecting)
            return false;
        if (e.keyCode) {
            if (e.keyCode != 13) {
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
        if (data.token == null || data.token == "")
            return false;
        nsd.user.token = data.token;
        setCookie("auth_token", data.token);
        if (data.sinaid != null && data.sinaid != "" && data.sinaid != 0) {
            setCookie("weibo_user", true);
            nsd.user.weibo = true;
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
        setCookie("auth_token", null, new Date());
        setCookie("user_points", "", new Date());
        setCookie("weibo_user", "", new Date());
        $('#ui_user .btns').show();
        $('#ui_user .bar').hide();
        $('#ui_user .btn-left').hide();
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
        $('#ui_user .bar span b').text(shared.formatNumber(pt));
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
            alert("请先登录。");
            userSignOut();
        } else if (data.code === 111) {
            alert("请先登录。");
            userSignOut();
        } else if (data.code == 112) {
            alert("微博账号已绑定到其它账号，请直接使用微博账号登录。");
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

    function delegateListener() {
        $('#nav .btn').click(function() {
            $('#nav .contract').hide();
            $('#nav .expand').show();
        });
        $('#nav .expand').click(function() {
            $('#nav .contract').show();
            $('#nav .expand').hide();
        });
        $('#detail').scroll(function() {
            var progress = $('#content').data('progress');
            if (progress && progress.obj) {
                var tp = $(this).scrollTop();
                var max = $('#detail .article').height() - $(this).height();
                var p = tp / max;

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
                                alert("恭喜您通过浏览行程获得了 " + data.amount + " 点积分。");
                                progress.obj.setMap();
                            }
                        });
                    }
                }
            }
        });
        $('#content .right-button a.browse').click(function() {
            $('.gallery-list').addClass('visible');
            $('#content .mask,#content .right-button.back').show();
        });
        $('#content .right-button a.close').click(function() {
            var mk = $('#content').data('progress');
            google.maps.event.addListenerOnce(mk.origin, 'click', markerClickHandle);
            if (mk.obj)
                mk.obj.setMap();
            nsd.map.setOptions({
                draggable : true
            });
            $('#content').data('progress', null).hide();
        });
        $('#content .right-button.back a').click(function() {
            $('.gallery-list').removeClass('visible');
            $('#content .mask,#content .right-button.back').hide();
        });
        $('#gallery .share a.btn').hover(function() {
            $(this).children('span').width(50);
        }, function() {
            if (!$(this).parent().hasClass('submit'))
                $(this).children('span').width(0);
        }).click(function() {
            if ($(this).parent().hasClass('submit')) {
                if (connecting)
                    return;
                var status = $('#gallery .share textarea').val();
                if (status == '') {
                    alert("还是说一点什么吧。");
                    $('#gallery .share textarea').focus();
                    return false;
                }
                if (nsd.user.token == null) {
                    alert("请先登录。");
                    return;
                }
                if (!nsd.user.weibo) {
                    alert("请先绑定一个微博账号。");
                    openWeiboAuth();
                    return;
                }
                connecting = true;
                $('input[name="pic"]').val($('#gallery .switch a').eq(shared.gallery_id).children().attr('src'));
                $('input[name="token"]').val(nsd.user.token);
                $('input[name="url"]').val(window.location.href);
                $.post(config.api_path, $('#gallery .share form').serialize(), function(data) {
                    connecting = false;
                    if (generalErrorHandle(data)) {
                        setUserPoints(data.points);
                        alert("分享成功！\n恭喜您获得了 " + data.amount + " 点积分。");
                        $('#gallery .share form').removeClass('bg');
                        $('#gallery .share').css('height', '');
                        $('#gallery .mask').hide();
                        $('#gallery .share p.submit span').width(0);
                        $('#gallery .share p.submit').removeClass('submit');
                    }
                });
            } else {
                $('#gallery .share form').addClass('bg');
                $('#gallery .share').height($('#gallery .share form').height());
                $('#gallery .mask').show();
                $(this).parent().addClass('submit');
                var pos = $('#gallery textarea').position();
                $('#gallery .btn-cancel').css({
                    left : pos.left + $('#gallery textarea').width() - $('#gallery .btn-cancel').width() + 10,
                    top : pos.top + $('#gallery textarea').height() - $('#gallery .btn-cancel').height() + 5
                })
                $('#gallery textarea').focus();
            }
        });
        $('#gallery .share .btn-cancel').click(function() {
            $('#gallery .share form').removeClass('bg');
            $('#gallery .share').css('height', '');
            $('#gallery .mask').hide();
            $('#gallery .share p.submit span').width(0);
            $('#gallery .share p.submit').removeClass('submit');
        });
        $('#ui_user .btns a').click(function() {
            var idx = $(this).index();
            if ($(this).parent().hasClass('btn-left')) {
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
        $('#ui_user a.exit').click(userSignOut);
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
    }

    $(function() {
        nsd.data = {};
        var weibo = getCookie("weibo_user");
        nsd.user.weibo = weibo || false;
        userSignIn({
            token : getCookie("auth_token"),
            points : Number(getCookie("user_points"))
        });
        adjust();
        $(window).resize(adjust);
        initMap();
        delegateListener();
    });
})(jQuery, window);
