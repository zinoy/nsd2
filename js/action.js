(function($, window, undefined) {
    var nsd = {};
    var config = {};
    var shared = {};
    var effect = {};
    var markers = [];
    var spots;
    var _maker;
    window.nsd = nsd;
    window.setuser = setWeiboUser;
    var connecting = false;
    var spin_timer = [];
    config.api_path = "api/action.aspx";
    config.duration_second = 1;
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
    shared.mode.quiz = false;

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
    effect.spin = function(obj, dest, idx) {
        if (spin_timer.length > idx)
            clearTimeout(spin_timer[idx]);
        var timer = 0;
        var init = Number($(obj).text().replace(',', ''));
        if (!$.isNumeric(init)) {
            return;
        }
        var span = dest - init;
        if (span == 0) {
            return;
        }
        var times = Math.floor(config.duration_second * 10);
        var step = Math.floor(span / times);
        if (Math.abs(step) < 1) {
            times = Math.abs(span);
            step = span < 0 ? -1 : 1;
        }
        var action = function() {
            timer++;
            var p = timer / times;
            var st = span - span * Math.cos(Math.PI / 2 * p);
            var result = init + Math.ceil(st);
            if (timer >= times) {
                $(obj).text(formatNumber(dest));
                return;
            }
            $(obj).text(formatNumber(result));
            spin_timer[idx] = setTimeout(action, 100);
        }
        action();
    };

    function rand(min, max) {
        max--;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(o) {
        var arr = o.slice(0), r = [];
        while (arr.length > 0) {
            r.push(arr.splice(rand(0, arr.length), 1)[0]);
        }
        return r;
    }

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

    function showDialog() {
        var msg;
        var label = [];
        var callback = [];
        for (var i = 0; i < arguments.length; i++) {
            if (i == 0) {
                if (( typeof arguments[i]) != 'string') {
                    return;
                } else {
                    msg = arguments[i];
                    continue;
                }
            }
            if (( typeof arguments[i]) == 'string' && label.length < 2) {
                $('#dialog .btns a').eq(label.length).text(arguments[i]);
                label.push(1);
            } else if (( typeof arguments[i]) == 'function' && callback.length < label.length) {
                var call = arguments[i];
                $('#dialog .btns a').eq(callback.length).off('click').click(function() {
                    call();
                    TweenLite.to('#dialog', .2, {
                        top : shared.screen.height * .1,
                        opacity : 0,
                        ease : Power2.easeOut,
                        onComplete : function() {
                            $('#dialog').hide();
                        }
                    });
                });
                callback.push(1);
            } else {
                break;
            }
        }
        $('#dialog .text').html(msg);
        if (label.length == 1 || callback.length == 1) {
            $('#dialog .btns a').eq(1).hide();
        } else {
            $('#dialog .btns a').eq(1).show();
        }
        $('#dialog').show();
        adjust();
        var pos = $('#dialog').addClass('visible').position();
        TweenLite.fromTo('#dialog', .4, {
            top : shared.screen.height * .1,
            opacity : 0
        }, {
            top : pos.top,
            opacity : 1,
            ease : Power2.easeOut
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
        $('.screen,#google_map .pattern,#google_map,#nav .expand,#user_action,#welcome').css({
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
        var wr = sw / sh;
        var vr = 1280 / 720;
        if (wr > vr) {
            $("#video_index").css({
                width : sw,
                height : sw / vr,
                top : (sh - sw / vr) / 2
            });
        } else {
            $("#video_index").css({
                width : sh * vr,
                height : sh,
                left : (sw - sh * vr) / 2,
                top : 0
            });
        }
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
        $('#content p.float-left > img,#content p.float-right > img').width($('#content .content').width() / 2);
        $('#content .gallery-list img').width($('#content .gallery-list ul').width()).removeAttr('height');
        $('#content .img-share span.ready').removeClass('ready');
        $('#content .img > img,.article .img-hover>img,.img-expand>img,.img-expand>img,.img-share>img').width($('#detail').width() - 20);
        $('#content .img-hover > span,#content .img-expand > span,#content .img-share,#kv_index').each(setImageSize);

        $('#content .img-share span').addClass('ready');
        $('#content #quiz').width($('#content .content').width() - 80 - 20);
        $('#gallery .frame').each(setImageSize);
        $('#gallery .switch a').width(iw * .6).each(setImageSize);
        $('#gallery .switch a.next').css('right', -iw * .6 - 10);
        $('#gallery .switch a.prev').css('left', -iw * .6 - 10);
        $('#nav').width(sw);
        $('#nav .contract > p').css('width', sw > 1280 ? sw - (iw + 20) : sw - (iw + 20) - 1);
        $('#nav .expand .home').css({
            'margin-right' : (iw - 20) - (iw - 20) / 2,
            width : (iw - 20) / 2
        });
        if ($('#user_action').length > 0) {
            $('#user_action .bg').css('top', (sh - $('#user_action .bg').height() - 10) / 2);
            $('#user_action .select p').css('left', $('#user_action .select a.email').position().left + $('#user_action .select a.email').width() - $('#user_action .select p').width() + 40);
        }
        $('#welcome .frame').css('top', (sh - $('#welcome .frame').height() - 20) / 2);
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
        if (img.height() < 30) {
            setTimeout(function() {
                setImageSize(idx, obj);
            }, 200);
        } else {
            var sw = shared.screen.width, sh = shared.screen.height, iw = shared.screen.column;
            if (_content) {
                //$(obj).children('img').width($(obj).width());
                $('#content .img-share input').width($('#content .img-share span').width() - 90 - 30);
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
                var ih = img.height();
                $(obj).css({
                    height : ih,
                    top : (sh - ih) / 2
                })
            } else {
                var ph = img.height();
                $(obj).css({
                    height : ph,
                    width : img.width()
                }).children('a').css({
                    height : ph - 6,
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

        var cx = 16;
        var cy = 16;
        var r = 16;
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
        if (shared.mode.detail) {
            return;
        }
        if (nsd.user.token == null) {
            showUserAlert();
            //google.maps.event.addListenerOnce(this, 'click', markerClickHandle);
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
        shared.mode.detail = true;
        $('#content .article,.jspContainer,.jspPane').css('width', '');
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
                    fillColor : '#ffffff',
                    fillOpacity : 1,
                    strokeOpacity : 0,
                    path : getProgressSymbolPath(0),
                    anchor : new google.maps.Point(16, 16)
                },
                optimized : false,
                zIndex : 1
            });
        }
        loc.obj.setIcon({
            url : "img/ol-spot-on.png",
            anchor : new google.maps.Point(9, 9)
        });
        $('#content').data('progress', {
            p : 0,
            origin : loc,
            obj : progress,
            location : loc_data
        });

        $('#ui_info li').eq(0).children('span').html(loc_data.Location);
        var currTime = new Date(loc_data.CurrentTime + "+0800");
        effect.spin($('#ui_info li').eq(1).children('b'), dayPass(currTime), 0);
        //$('#ui_info li').eq(1).children('b').html(dayPass(currTime));
        $('#ui_info li').eq(1).children('span').html(dateFormat(currTime));
        effect.spin($('#ui_info li').eq(2).children('b'), dist, 1);
        //$('#ui_info li').eq(2).children('b').html(formatNumber(dist));
        $('#ui_info li').eq(3).children('span').html(formatFloat(loc_data.Latitude) + ', ' + formatFloat(loc_data.Longitude));
        effect.spin($('#ui_info li').eq(4).children('b'), loc_data.PhotoCount, 2);
        //$('#ui_info li').eq(4).children('b').html(loc_data.PhotoCount);

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
                    $('#detail .diff a').click(function(e) {
                        e.stopPropagation();
                        getDiff(0);
                    });
                }
                initGallery(data, loc);
                $('html,body').css("overflow", "hidden");
                adjust();
                $('#detail .article').jScrollPane({
                    autoReinitialise : true,
                    hideFocus : true,
                    mouseWheelSpeed : 100
                });
                $('#content').addClass('visible');
                $('#detail,.right-button .browse').show();
                getQuiz(loc.id);

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
                    delay : .3,
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
                        $('#content .article').scroll(markerScrollHandle);
                    }
                });
                $(document).scrollTop(0);
                $('#content .article').data('jsp').scrollToY(0)
                if (loc.status == 2) {
                    nsd.map.setZoom(7);
                    nsd.map.panTo($('#content').data('progress').origin.obj.getPosition());
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

    function markerScrollHandle() {
        if (shared.location > 0) {
            var progress = $('#content').data('progress');
            var tp = $('#content .article').data('jsp').getPercentScrolledY();
            //var max = $('#detail .article .content').height() - $(this).height();
            //var p = tp / max;

            if (progress && progress.obj) {
                if (tp > progress.p) {
                    var icon = progress.obj.getIcon();
                    icon.path = getProgressSymbolPath(tp);
                    progress.obj.setIcon(icon);
                    progress.p = tp;
                }
                if (tp >= 1) {
                    $('#content .article').off('scroll');
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
                        shared.location = 0;
                    } else {
                        gotoNextLocation(progress);
                    }
                }
            } else if (tp >= 1) {
                $('#content .article').off('scroll');
                gotoNextLocation(progress);
            }
            $(document).scrollTop(0);
        }
    }

    function getQuiz(loc) {
        if (nsd.data.quiz === undefined) {
            $.getJSON("data/quiz.json", function(data) {
                nsd.data.quiz = data;
                showQuiz(loc);
            });
        } else {
            showQuiz(loc);
        }
    }

    //TODO quiz
    function showQuiz(loc) {
        var data = nsd.data.quiz, obj;
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].loc === loc) {
                obj = data.list[i];
                break;
            }
        }
        $('#quiz').hide();
        if (obj !== undefined) {
            var seed = Math.random();
            if (seed > .5) {
                return;
            }
            shared.mode.quiz = true;
            var data = {};
            data.id = obj.id;
            data.q = obj.q;
            data.a = obj.opt[obj.a];
            data.opt = shuffle(obj.opt);
            $('#quiz p.lead').html('问答题：' + obj.q);
            $('#quiz p.option').empty();
            for (var j = 0; j < obj.opt.length; j++) {
                $('#quiz p.option').append('<a><i><b></b></i><label>' + data.opt[j] + '</label></a>');
            }
            $('#quiz p.option a').click(function() {
                if ($(this).hasClass('active'))
                    return;
                $('#quiz p.option a.active').removeClass('active');
                $(this).addClass('active');
            });
            $('#quiz').data('obj', data).show();
        }
    }

    function submitQuiz() {
        if (connecting) {
            return;
        }
        var selected = $('#quiz p.option a.active');
        if (selected.length == 0) {
            alert("请选择一个你认为正确的选项。");
            return;
        }
        var val = selected.find('label').text();
        var obj = $('#quiz').data('obj');
        if (val == obj.a) {
            connecting = true;
            $.post(config.api_path, {
                ac : "quiz",
                token : nsd.user.token,
                quiz : obj.id,
                qt : obj.q,
                as : val
            }, function(data) {
                if (generalErrorHandle(data)) {
                    showAlert('答对了！恭喜你获得<i>' + data.amount + '</i>点积分。');
                    setUserPoints(data.points);
                } else if (data.code == 114) {
                    showAlert('恭喜你，回答正确！');
                }
                TweenLite.to('#quiz', .2, {
                    height : 0,
                    ease : Power2.easeOut,
                    onComplete : function() {
                        $('#quiz').hide().css('height', '');
                    }
                })
                shared.mode.quiz = false;
                connecting = false;
            });
        } else {
            alert("很遗憾，回答错误。");
            TweenLite.to('#quiz', .2, {
                height : 0,
                ease : Power2.easeOut,
                onComplete : function() {
                    $('#quiz').hide().css('height', '');
                }
            })
            shared.mode.quiz = false;
        }
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
        $('#content .img-share').append('<span><input type="text" placeholder="发表您的观点能赢取更多积分" /><a class="btn"><b>分享至：</b><i class="icon-weibo"></i></a></span>').find('a').click(postStatus);
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

    function setSwitch(dir) {
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
        //$('#gallery > .switch').empty();
        var css = ["prev", "next"];
        for (var i = 0; i < 2; i++) {
            var item = list[ids[i]];
            var frame = $('<div class="frame"/>').appendTo('#gallery');
            var img = $('<img/>').attr({
                src : item.FileName + 'b.jpg',
                alt : ''
            }).appendTo(frame);
            frame.data('id', item.ID);
            $('#gallery > .switch a.' + css[i]).data('index', ids[i]).children().attr('src', item.FileName + 't.jpg');
        }
        if (list.length == 2) {
            $('#gallery > .switch a.prev').data('index', 0).children().attr('src=', list[0].FileName + 't.jpg');
            $('#gallery > .switch a.next').data('index', 1).children().attr('src=', list[1].FileName + 't.jpg');
        }
        //$('#gallery > .switch a').eq(1).addClass('next').end().eq(0).addClass('prev');
        //$('#gallery > .switch .next,#gallery > .switch .prev').click(goFrame);
        $('#gallery > .frame').click(hideGallery)
        adjust();
        $('#gallery').on('mousemove', function(e) {
            var x = e.pageX;
            if (x > shared.screen.width / 4 * 3) {
                $('#gallery>.switch .next').addClass('next-on');
            } else if (x < shared.screen.width / 4) {
                $('#gallery>.switch .prev').addClass('prev-on');
            } else {
                $('#gallery>.switch .next').removeClass('next-on');
                $('#gallery>.switch .prev').removeClass('prev-on');
            }
        });
        if (dir !== undefined) {
            if (dir > 0) {
                $('#gallery>.switch .next').addClass('next-on');
            } else {
                $('#gallery>.switch .prev').addClass('prev-on');
            }
        }
    }

    function hideGallery() {
        $('#gallery').css('top', '100%').hide();
        $('#ui_board,#nav').show();
    }

    function goFrame() {
        if (shared.animating)
            return;
        var idx = $(this).data('index'), dir = -1;
        var oid = shared.gallery_id, width = $('#gallery > .frame').width(), start, end, ids;
        var frames = $('#gallery > .frame').not('.active'), active = $('#gallery > .frame.active');
        if (shared.mode.panorama) {
            if ($('#panorama .panel:visible').length > 0 || $('#panorama .bar > span.active').length > 0)
                return;
            if ($.isNumeric(arguments[0])) {
                idx = arguments[0];
                dir = idx - shared.panorama.index;
            }
            oid = shared.panorama.index;
            width = shared.screen.width;
            frames = $('#panorama > .view');
            active = $('#panorama > .view.active');
        }
        $('#gallery').off('mousemove');
        $('#gallery>.switch .next').removeClass('next-on');
        $('#gallery>.switch .prev').removeClass('prev-on');

        if ($(this).hasClass('next') || dir > 0) {
            ids = 1;
            if (shared.mode.panorama) {
                if (!$.isNumeric(idx))
                    idx = shared.panorama.index + 1;
                if (idx >= shared.panorama.scene)
                    return;
                shared.panorama.index = idx;
                ids = idx;
            } else if (!$.isNumeric(idx)) {
                idx = $('#gallery > .switch .next').data('index');
            }
            //$('#gallery > .frame').eq(idx).css('left', width).addClass('visible');
            start = {
                left : width
            };
            end = -width;
        } else {
            ids = 0;
            if (shared.mode.panorama) {
                if (!$.isNumeric(idx))
                    idx = shared.panorama.index - 1;
                if (idx < 0)
                    return;
                shared.panorama.index = idx;
                ids = idx;
            } else if (!$.isNumeric(idx)) {
                idx = $('#gallery > .switch .prev').data('index');
            }
            //$('#gallery > .frame').eq(idx).css('left', -width).addClass('visible');
            start = {
                left : -width
            };
            end = width;
        }
        shared.gallery_id = idx;
        shared.animating = true;
        if ($(this).parent().hasClass('switch')) {
            dir = $(this).hasClass('next') ? 1 : -1;
        } else {
            dir = undefined;
        }
        TweenLite.fromTo(frames.eq(ids).addClass('visible'), .8, start, {
            left : 0,
            ease : Power2.easeOut
        });
        TweenLite.to(active, .8, {
            left : end,
            ease : Power2.easeOut,
            onComplete : function() {
                shared.animating = false;
                active.removeClass('active');
                frames.eq(ids).addClass('active');
                if (shared.mode.panorama) {
                    active.removeClass('visible');
                    $('#panorama > .info .browse a.active').removeClass('active');
                    $('#panorama > .info .browse a').eq(idx).addClass('active');
                    $('#panorama > .info .bar span > b').text(idx + 1);
                } else {
                    setSwitch(dir);
                    $('#gallery > .pager span > b').text(idx + 1);
                }
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
        $('#ui_board,#nav').hide();
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
                    var item = {
                        id : loc.ID,
                        index : i,
                        type : loc.Type,
                        latlng : pt,
                        distance : loc.Distance,
                        status : loc.Status
                    };
                    if (loc.Status == 2 || loc.Status == 3) {
                        var marker = new google.maps.Marker({
                            position : pt,
                            map : nsd.map,
                            icon : _maker[loc.Type],
                            title : loc.Location,
                            optimized : false,
                            zIndex : (_maker.length - loc.Type) * 10
                        });
                        item.obj = marker
                        if (loc.WayPoint) {
                            wayPoints.push({
                                location : pt
                            });
                        }
                        google.maps.event.addListener(marker, 'mouseover', function(e) {
                            if ($('#content').data('progress') == null) {
                                this.setIcon({
                                    url : 'img/ol-hover.png',
                                    anchor : new google.maps.Point(70, 44)
                                });
                                var loc_data;
                                var dist = 0;
                                for (var i = 0; i < markers.length; i++) {
                                    dist += markers[i].distance;
                                    if (this === markers[i].obj) {
                                        loc_data = nsd.data.location[i];
                                        break;
                                    }
                                }
                                if (loc_data != undefined) {
                                    $('#ui_info li').eq(0).children('span').html(loc_data.Location);
                                    var currTime = new Date(loc_data.CurrentTime + "+0800");
                                    effect.spin($('#ui_info li').eq(1).children('b'), dayPass(currTime), 0);
                                    $('#ui_info li').eq(1).children('span').html(dateFormat(currTime));
                                    effect.spin($('#ui_info li').eq(2).children('b'), dist, 1);
                                    $('#ui_info li').eq(3).children('span').html(formatFloat(loc_data.Latitude) + ', ' + formatFloat(loc_data.Longitude));
                                    effect.spin($('#ui_info li').eq(4).children('b'), loc_data.PhotoCount, 2);
                                }
                            }
                        });
                        google.maps.event.addListener(marker, 'mouseout', function(e) {
                            if ($('#content').data('progress') == null) {
                                var obj = findMarkerFromList(this, markers);
                                this.setIcon(_maker[obj.type]);
                                $('#ui_info li').eq(0).children('span').html(nsd.geoinfo.location);
                                effect.spin($('#ui_info li').eq(1).children('b'), nsd.geoinfo.past, 0);
                                $('#ui_info li').eq(1).children('span').html(nsd.geoinfo.date);
                                effect.spin($('#ui_info li').eq(2).children('b'), nsd.geoinfo.distance, 1);
                                $('#ui_info li').eq(3).children('span').html(nsd.geoinfo.latlng);
                                effect.spin($('#ui_info li').eq(4).children('b'), nsd.geoinfo.pics, 2);
                                $('#intro .stat li').eq(0).children('span').text(formatNumber(nsd.geoinfo.distance));
                                $('#intro .stat li').eq(1).children('span').text(data.list.length);
                                $('#intro .stat li').eq(2).children('span').text(formatNumber(nsd.geoinfo.pics));
                            }
                        });
                        google.maps.event.addListener(marker, 'click', markerClickHandle);
                    }
                    markers.push(item);
                }

                var directionsService = new google.maps.DirectionsService();
                directionsDisplay.setMap(nsd.map);
                var request = {
                    origin : markers[0].latlng,
                    destination : markers[markers.length - 1].latlng,
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

                if (markers[markers.length - 1].obj === undefined) {
                    var lastPt = markers[markers.length - 1];
                    var marker = new google.maps.Marker({
                        position : lastPt.latlng,
                        map : nsd.map,
                        icon : _maker[0],
                        title : "当前车队位置"
                    });
                    lastPt.obj = marker;
                }

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
                effect.spin($('#ui_info li').eq(1).children('b'), nsd.geoinfo.past, 0);
                //$('#ui_info li').eq(1).children('b').html(nsd.geoinfo.past);
                $('#ui_info li').eq(1).children('span').html(nsd.geoinfo.date);
                effect.spin($('#ui_info li').eq(2).children('b'), nsd.geoinfo.distance, 1);
                //$('#ui_info li').eq(2).children('b').html(formatNumber(nsd.geoinfo.distance));
                $('#ui_info li').eq(3).children('span').html(nsd.geoinfo.latlng);
                effect.spin($('#ui_info li').eq(4).children('b'), nsd.geoinfo.pics, 2);
                //$('#ui_info li').eq(4).children('b').html(formatNumber(nsd.geoinfo.pics));
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
        $.getJSON('data/yili.json', {
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
                if ($(this).hasClass('active'))
                    return;
                var nid = $(this).index('#panorama .browse a');
                goFrame(nid);
                /*
                 showPanorama(data, nid);*/
                $('#panorama .bar > span > i').hide();
                $('#panorama .browse').hide();
                $('#panorama .info .circle').show();
                $('#panorama .bar > span > span').show();
                $('#panorama .bar > span').removeClass('active');
            }).first().addClass('active');

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

        $('#panorama .view').remove();
        $('#panorama .bar > span > span').html('<b>' + (idx + 1) + '</b> / ' + data.count);
        $('#panorama .info .circle b').text(shared.panorama.discovered);

        //var ratio = shared.screen.height / data.list[0].height;
        for (var j = data.count - 1; j >= 0; j--) {
            var view = $('<div class="view"/>');
            for (var i = 0; i < data.list[j].items.length; i++) {
                var obj = data.list[j].items[i];
                var dot = $('<a class="dot"><span><i><b></b></i></span></a>');
                dot.data({
                    left : obj.x,
                    top : obj.y,
                    id : obj.id
                });
                view.append(dot);
            }
            /*$('#panorama').mousemove(function(e) {
            shared.panorama.mouse = e.clientX;
            });*/
            //$('#panorama .view').after($('#panorama .view').clone().css('left', shared.screen.width)).addClass('active').data('left', 0);
            view.append('<img src="' + data.list[j].file + 'b.jpg" />').prependTo('#panorama').data({
                height : data.list[j].height,
                width : data.list[j].width
            });
        }
        $('#panorama .view:first').addClass('visible active');
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
        var idx = $(this).index();
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
                        showDialog("<b>恭喜！本站发现任务完成。</b><br />你获得了<i>" + data.amount + "</i>点积分。", "返回", function() {
                            shared.mode.panorama = false;
                            $('#panorama').hide();
                            $('#ui_board,#nav').show();
                            shared.game_spots[0].setIcon({
                                url : 'img/my_1_on.png',
                                anchor : new google.maps.Point(33, 66)
                            });
                        });
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
        $('#panorama .mask').addClass('cursor-close').one('click', function() {
            $('#panorama .dot.active').removeClass('active');
            //$('#panorama .panel').hide();
            $('#panorama .mask').removeClass('cursor-close');
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

    //TODO "diff" will be modified soon
    function getDiff(idx) {
        if (nsd.data.diff !== undefined) {
            showDiff(idx);
            return;
        }
        $.getJSON('data/tengchong.json', {
            seed : Math.random()
        }, function(data) {
            nsd.data.diff = data;
            shared.diff = {};
            showDiff(idx);
        });
    }

    function showDiff() {
        var resize = function() {
            $('#difference .view').each(function() {
                var img = $(this).children('img'), ratio;
                var hrz = $(this).hasClass('horizon');
                if (hrz) {
                    var fw = shared.screen.width;
                    ratio = fw / $(this).data('width');
                    var ih = $(this).data('height') * ratio;
                    if ((ih + 12) * 2 > shared.screen.height) {
                        ih = (shared.screen.height - 12) / 2;
                        ratio = ih / $(this).data('height');
                        fw = $(this).data('width') * ratio;
                    }
                    img.height(ih).width(fw);
                    $(this).width(fw).data('ratio', ratio).css({
                        top : (shared.screen.height - $(this).height()) / 2,
                        left : (shared.screen.width - $(this).width()) / 2
                    });
                } else {
                    var fh = $(this).height();
                    ratio = fh / $(this).data('height');
                    var iw = $(this).data('width') * ratio;
                    img.height(fh).width(iw);
                    $(this).data('ratio', ratio).css('left', (shared.screen.width - $(this).width()) / 2);
                }
                if ($(this).hasClass('active')) {
                    $(this).find('.diff.major').each(function() {
                        var pos = $(this).data('pos');
                        var tx = pos.x * ratio + 6 - 24, ty = pos.y * ratio - 24;
                        var tick1 = $(this).css({
                            left : tx,
                            top : ty
                        });
                        var sub = $(this).data('sub');
                        if (hrz) {
                            sub.css({
                                left : tx,
                                top : ty + ih + 12
                            });
                        } else {
                            sub.css({
                                left : tx + iw + 12,
                                top : ty
                            });
                        }
                    });
                }
            });
            $('#difference .circle').css('left', (shared.screen.width - 90) / 2);
        };
        $('#difference .view').remove();
        for (var i = nsd.data.diff.count - 1; i >= 0; i--) {
            var obj = nsd.data.diff.list[i];
            var view = $('<div class="view"/>').append('<img src="' + obj.file[0] + '" />').append('<img src="' + obj.file[1] + '" />').data({
                height : obj.height,
                width : obj.width
            });
            if (obj.orientation == "horizon") {
                view.addClass('horizon');
                view.find('img:first').addClass('top');
            }
            $('#difference').prepend(view);
        }
        $('#difference').show();
        $('#ui_board,#nav').hide();
        $('#difference .circle b').text(shared.diff.found);
        $('#difference .view').data('list', obj.items.slice(0));
        $('#difference .hint a').one('click', function() {
            TweenLite.to('#difference .hint', .3, {
                bottom : -$('#difference .hint').height() - 30,
                ease : Power2.easeOut,
                onComplete : function() {
                    startDiff();
                }
            });
            effect.fadeOut('#difference .mask', .3);
            effect.fadeIn('#difference .circle,#difference .timer', .3);
        });
        $('#difference .hint').css('visibility', 'hidden').show();
        resize();
        $(window).resize(resize);
        $('#difference .view img').click(clickDiff);
        $('#difference .circle,#difference .timer').hide();
        effect.fadeIn('#difference .mask', .4);
        $('#difference .hint').css('visibility', '');
        TweenLite.fromTo('#difference .hint', .4, {
            bottom : -$('#difference .hint').height() - 30
        }, {
            bottom : 2,
            ease : Power2.easeOut
        });
        shared.diff.bonus = [];
        goDiff(0, true);
    }

    function startDiff() {
        var digi = $('#difference .timer b');
        var str = String(shared.diff.time);
        digi.eq(1).text(str[str.length - 1]);
        if (str.length > 1) {
            digi.eq(0).text(str[0]);
        } else {
            digi.eq(0).text(0);
        }
        if (shared.diff.time <= 0) {
            showDialog("很遗憾，时间到！", "再玩一次", function() {
                shared.diff.bonus = [];
                goDiff(0);
            });
        } else {
            shared.diff.timer = setTimeout(startDiff, 1000);
        }
        shared.diff.time -= 1;
    }

    function goDiff(idx, first) {
        var obj = nsd.data.diff.list[idx];
        shared.diff.time = 60;
        shared.diff.found = obj.items.length;
        shared.diff.index = idx;
        $('#difference .view .diff').remove();
        $('#difference .circle b').text(shared.diff.found);
        $('#difference .view.active').removeClass('active');
        $('#difference .view').eq(idx).data('list', obj.items.slice(0)).addClass('visible active');
        if (!first) {
            var prev = $('#difference .view').eq(idx - 1);
            var cur = $('#difference .view.active');
            var start = (shared.screen.width - cur.width()) / 2;
            var end = (shared.screen.width - prev.width()) / 2;
            TweenLite.fromTo(cur, .8, {
                left : start + shared.screen.width
            }, {
                left : start,
                ease : Power2.easeOut
            });
            TweenLite.to(prev, .8, {
                left : end - shared.screen.width,
                ease : Power2.easeOut,
                onComplete : function() {
                    prev.removeClass('visible');
                    startDiff();
                }
            });
        }
    }

    function clickDiff(e) {
        var list = $('#difference .view.active').data('list'), ratio = $('#difference .view.active').data('ratio');
        var x = e.offsetX / ratio, y = e.offsetY / ratio;
        for (var i = 0; i < list.length; i++) {
            var rect = list[i].rect;
            if (x > rect[0] && x < rect[2] && y > rect[1] && y < rect[3]) {
                list.splice(i, 1);
                var hrz = $('#difference .view.active').hasClass('horizon');
                var pos = {}, iw = $('#difference .view.active img').width();
                pos.x = (rect[0] + rect[2]) / 2;
                pos.y = (rect[1] + rect[3]) / 2;
                var tx = pos.x * ratio + 6 - 24, ty = pos.y * ratio - 24;
                var tick1 = $('<i class="diff major"/>').css({
                    left : tx,
                    top : ty
                });
                var tick2 = tick1.clone().removeClass('major');
                if (hrz) {
                    tick2.css('top', ty + $('#difference .view.active img').height() + 12);
                } else {
                    tick2.css('left', tx + iw + 12);
                }
                tick1.data({
                    pos : pos,
                    sub : tick2
                });
                shared.diff.found -= 1;
                $('#difference .circle b').text(shared.diff.found);
                if (shared.diff.found == 0) {
                    clearTimeout(shared.diff.timer);
                    shared.diff.bonus.push(shared.diff.time + 1);
                    if (shared.diff.index < nsd.data.diff.count - 1) {
                        showDialog("<b>恭喜！发现任务完成。</b><br />还有更多关卡等你发现。", "下一关", function() {
                            goDiff(shared.diff.index + 1);
                        });
                    } else {
                        var sum = 0, bonus;
                        for (var n = 0; n < shared.diff.bonus.length; n++) {
                            sum += shared.diff.bonus[n];
                        }
                        bonus = Math.floor(sum / shared.diff.bonus.length);
                        $.post(config.api_path, {
                            ac : 'gamecomplete',
                            ext : bonus,
                            token : nsd.user.token,
                            game : 2
                        }, function(data) {
                            if (generalErrorHandle(data)) {
                                showDialog("<b>恭喜！本站发现任务完成。</b><br />你获得了<i>" + data.amount + "</i>点积分（含时间奖励<i>" + bonus + "</i>点积分）。", "返回", function() {
                                    $('#dialog .close').click();
                                    $('#difference').hide();
                                    $('#ui_board,#nav').show();
                                    shared.game_spots[1].setIcon({
                                        url : 'img/my_2_on.png',
                                        anchor : new google.maps.Point(33, 66)
                                    });
                                });
                                setUserPoints(data.points);
                            }
                            if (data.code == 114) {
                                showDialog("<b>恭喜！本站发现任务完成。</b>", "返回", function() {
                                    $('#dialog .close').click();
                                    $('#difference').hide();
                                    $('#ui_board,#nav').show();
                                });
                            }
                        });
                    }
                }
                $('#difference .view.active').data('list', list).append(tick1, tick2);
                return;
            }
        }
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
        $('#ui_user .btns,#user_action,#auth').hide();
        $('#ui_user .bar').show();
        $('#ui_user .btn-left').show();
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
                            item.append('<p class="single-line selection">回答随机问题</p>');
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
                    delay : .3,
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
            effect.fadeOut('#auth,#welcome', .4);
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

    function showBottomPanel(id, tab) {
        var define = ["#about", "#vehicle", "#media"];
        if (id >= define.length || id < 0)
            return;
        $(define[id]).show();
        if (id == 0 && tab !== undefined) {
            $('#about .tabs li').removeClass('active').eq(tab).addClass('active');
            $('#about .tab-item').hide().eq(tab).show();
        }
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
        //$('#points_history,.right-button .satellite').hide();
    }

    //TODO my
    function goMyDiscovery() {
        //shared.route.setMap(null);
        shared.mode.my_journey = true;
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].obj !== undefined)
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
            if (i > 1) {
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
                else if ( idx = 1)
                    getDiff(0);
            });
        }
        $('#ui_user .btn-left a').addClass('back').children().text('返回').addClass('back');
        $('#ui_info').hide();
        if (shared.game_spots === undefined)
            shared.game_spots = game_spots;
    }

    function gotoNextLocation(mk) {
        if (mk === undefined)
            return;
        //google.maps.event.addListenerOnce(mk.origin.obj, 'click', markerClickHandle);
        //console.log('marker_click_next', mk.origin.obj);
        if (mk.obj)
            mk.obj.setMap();
        mk.origin.obj.setIcon(_maker[mk.origin.type]);
        var loc = mk.location;
        //var idx = $.inArray(loc, nsd.data.location) + 1;
        var i = 0;
        var obj, dist = 0;
        for (; i < nsd.data.location.length; i++) {
            dist += nsd.data.location[i].Distance;
            if (nsd.data.location[i].ID > mk.location.ID && nsd.data.location[i].Status > 1) {
                obj = nsd.data.location[i];
                break;
            }
        }
        if (obj !== undefined) {
            var loc = markers[i];
            showLocation(loc, obj, dist);
        }
    }

    function backToHome(e) {
        var mk = $('#content').data('progress');
        if (mk) {
            //google.maps.event.addListenerOnce(mk.origin.obj, 'click', markerClickHandle);
            //console.log('marker_click_home', mk.origin);
            if (mk.obj)
                mk.obj.setMap();
            mk.origin.obj.setIcon(_maker[mk.origin.type]);
            nsd.map.setOptions({
                draggable : true
            });
            shared.mode.detail = false;
            $('#content').data('progress', null);
        }
        if (shared.mode.my_journey)
            switchMenu(1);
        else
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
                    $('#points_history,.right-button .satellite').hide();
                }
            });
            $('html,body').css("overflow", "");
            adjust();
            //$('#detail,.right-button a').show();
        }
        $('#ui_info li').eq(0).children('span').html(nsd.geoinfo.location);
        effect.spin($('#ui_info li').eq(1).children('b'), nsd.geoinfo.past, 0);
        //$('#ui_info li').eq(1).children('b').html(nsd.geoinfo.past);
        $('#ui_info li').eq(1).children('span').html(nsd.geoinfo.date);
        effect.spin($('#ui_info li').eq(2).children('b'), nsd.geoinfo.distance, 1);
        //$('#ui_info li').eq(2).children('b').html(formatNumber(nsd.geoinfo.distance));
        $('#ui_info li').eq(3).children('span').html(nsd.geoinfo.latlng);
        effect.spin($('#ui_info li').eq(4).children('b'), nsd.geoinfo.pics, 2);
        //$('#ui_info li').eq(4).children('b').html(nsd.geoinfo.pics);
    }

    function findLocation(loc, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].ContentID == loc && list[i].Type == 4) {
                return true;
            }
        }
        return false;
    }

    function resetRoute() {
        $('#panorama').hide();
        $('#ui_board').show();
        shared.route.setDirections(shared.main_route);
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].obj !== undefined)
                markers[i].obj.setMap(nsd.map);
        }
        for (var j = 0; j < shared.game_spots.length; j++) {
            shared.game_spots[j].setMap(null);
        }
        shared.mode.my_journey = false;
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
                            resetRoute();
                        }
                        break;
                    case 2:
                        //showPointsHistory();
                        if (nsd.user.token == null) {
                            showUserAlert();
                            switchMenu(0);
                            return;
                        }
                        goMyDiscovery();
                        switchMenu(1);
                        break;
                    case 3:
                        showBottomPanel(0, 0);
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
            showBottomPanel(0, 1);
            switchMenu(2);
        })
        $('#about .btn-simple').click(function() {
            $('#about').hide();
            $('#main > .mask-alpha3').hide();
            $('#main > .pattern-about').hide();
            backToHome();
            if (shared.mode.my_journey) {
                $('#panorama').hide();
                $('#ui_board').show();
                shared.route.setDirections(shared.main_route);
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].obj !== undefined)
                        markers[i].obj.setMap(nsd.map);
                }
                for (var j = 0; j < shared.game_spots.length; j++) {
                    shared.game_spots[j].setMap(null);
                }
                shared.mode.my_journey = false;
            }
            switchMenu(0);
        });
        $('.cursor-close').click(function() {
            resetScreen();
            if (shared.mode.my_journey)
                switchMenu(1);
            else
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
        //TODO mouse wheel
        $('#detail .article').click(function(e) {
            e.stopPropagation();
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
        $('#gallery>.switch a').click(goFrame);
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
                if ($(this).hasClass('back')) {
                    resetScreen();
                    backToHome();
                    resetRoute();
                    $(this).removeClass('back').children().text("我的发现");
                    switchMenu(0);
                } else {
                    goMyDiscovery();
                    switchMenu(1);
                    //showPointsHistory();
                }
                return;
            }
            if (idx == 0) {
                //$('#user_action .pattern').hide();
                //$('#user_action .select').show();
                openWeiboAuth();
            } else {
                $('#user_action').show();
                $('#user_action .pattern').hide();
                /*$('#user_action .select').hide();
                 $('#user_action .register').show();
                 $('.register input:first').focus();*/
                $('#user_action').addClass('wide');
                $('.select').hide();
                $('.login').show();
                $('.login input:first').focus();
                adjust();
            }
            //adjust();
        });
        $('#ui_user .bar > span,#ui_user a.point').click(showPointsHistory);
        $('#ui_user a.exit').click(userSignOut);
        $('#ui_info .pic').click(showLatestPic);
        $('#user_action a.weibo').click(openWeiboAuth);
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
        $('#panorama .bar > a').click(goFrame);
        $('#panorama a.close').click(function() {
            shared.mode.panorama = false;
            $('#panorama').hide();
            $('#ui_board,#nav').show();
        });
        $('#difference a.close').click(function() {
            clearTimeout(shared.diff.timer);
            $('#dialog .close').click();
            $('#difference').hide();
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
        $('.overlay .close').click(function() {
            TweenLite.to($(this).parent(), .2, {
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
        $('#auth .weibo').click(function() {
            openWeiboAuth();
        });
        $('#auth .mail').click(function() {
            $('#auth').hide();
            $('#user_action').show();
            $('#user_action .pattern').hide();
            $('#user_action').addClass('wide');
            $('.select').hide();
            $('.login').show();
            $('.login input:first').focus();
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
        $('#quiz .submit').click(submitQuiz);
        $('#welcome .weibo').click(openWeiboAuth);
        $('#welcome .skip,#welcome .mask').click(function() {
            effect.fadeOut('#welcome', .4);
        });
        $('#welcome .links a').click(function() {
            if ($(this).hasClass('skip'))
                return;
            effect.fadeOut('#welcome', .2);
            var idx = $(this).index();
            showBottomPanel(0, idx + 1);
        });
        $('#bgm_control').click(function() {
            var bgm = $('#bgm')[0];
            if ($(this).children('i').hasClass('bgm-on')) {
                bgm.pause();
                $(this).children('i').removeClass('bgm-on').addClass('bgm-off');
                $(this).find('span b').text('off');
                setCookie("bgm_mute", "yes", 90);
            } else {
                bgm.play();
                $(this).children('i').removeClass('bgm-off').addClass('bgm-on');
                $(this).find('span b').text('on');
                bgm.volume = .25;
                setCookie("bgm_mute", null, 0);
            }
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
                    if ($('#video_index').length > 0 && $('html').hasClass('video')) {
                        $('#video_index').one('loadeddata', function() {
                            effect.fadeOut('#kv_index', .1);
                            var player = $('#video_index')[0];
                            player.volume = .5;
                            player.play();
                        });
                    }
                }
            } else {
                _maker = [{
                    url : "img/ol-vehicle.png",
                    anchor : new google.maps.Point(17.5, 19.5)
                }, "img/ol-dest-a.png", "img/ol-dest-b.png", "img/ol-dest-c.png", {
                    url : "img/ol-stop.png",
                    anchor : new google.maps.Point(11, 10.5)
                }, {
                    url : "img/ol-spot.png",
                    anchor : new google.maps.Point(9, 9)
                }];
                if (nsd.user.token == null) {
                    $('#welcome').addClass('visible');
                    effect.fadeIn('#welcome', .4, 1);
                    setTimeout(function() {
                        effect.fadeOut('#welcome', .4);
                    }, 10000);
                }
                var ignore = getCookie("upgrade_ignore");
                if ($('html').hasClass('lt-ie9') && (ignore == null || ignore == "")) {
                    setTimeout(showBrowserAlert, 1000);
                }
                initMap();
            }
            delegateListener();
            adjust();
            var bgm_mute = getCookie("bgm_mute");
            if ($('#bgm').length > 0) {
                if (bgm_mute != 'yes') {
                    var bgm = $('#bgm')[0];
                    bgm.play();
                    setTimeout(function() {
                        bgm.volume = .25;
                    }, 200);
                } else {
                    $('#bgm_control i').removeClass('bgm-on').addClass('bgm-off');
                    $('#bgm_control span b').text('off');
                }
            }
        });
    }
})(jQuery, window);
