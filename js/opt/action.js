(function(a,n,r){function t(a){a=String(Math.floor(a));if(3>=a.length)return a;for(var c="",d=0;d<=Math.floor(a.length/3);d++){var e=a.length-3*(d+1),g=3;0>e&&(g+=e,e=0);if(0==g)break;0<d&&(c=","+c);c=a.substr(e,g)+c}return c}function z(a){a=Math.floor(10*a);return a/10}function I(a){var c=document.cookie,d=c.indexOf(" "+a+"=");-1==d&&(d=c.indexOf(a+"="));-1==d?c=null:(d=c.indexOf("=",d)+1,a=c.indexOf(";",d),-1==a&&(a=c.length),c=unescape(c.substring(d,a)));return c}function u(a,c,d){var e=new Date;
e.setDate(e.getDate()+d);c=escape(c)+(null==d?"":"; expires="+e.toUTCString());document.cookie=a+"="+c}function q(){a("body").css("overflow-y","scroll");a("body").css("overflow-x","hidden");var b=a(n).height(),c=a(n).width(),c=1280>c?1280:c,b=480>b?480:b;a("body").css("overflow","");f.screen.height=b;f.screen.width=c;a(".screen,#google_map .pattern,#google_map,#nav .expand,#user_action").css({height:b,width:c});var d=Math.floor((c-20)/9);e.size={column:d,height:b,width:c};f.screen.column=d;a("#google_map .pattern i").not(":first").css("margin-left",
d-20);a("#ui_board").css("left",7*d);a("#main .copy").css("left",d+10);a(".col1").width(d-20);a(".col1-full").css("width",d);a("#detail,#points_history").css({height:b-40,"padding-left":d+10,width:4*d});a("#detail .article").height(b-40-88);a("#content .gallery-list .frame").height(b-20);a("#content .order1").css("right",2*-d);a("#content .order2,.gallery-list").css("right",-d);a("#content .img > img").width(a("#content .content").width());a("#content p.float-left > img,#content p.float-right > img").width(a("#content .content").width()/
2);a("#content .gallery-list img").width(a("#content .gallery-list ul").width()).removeAttr("height");a("#content .img-share span.ready").removeClass("ready");a("#content .img-hover > span,#content .img-expand,#content .img-expand > span,#content .img-share,#kv_index").each(A);a("#content .img-share input").width(a("#content .img-share span").width()-90-30);a("#content .img-share span").addClass("ready");a("#gallery .frame").each(A);a("#gallery .switch a").each(A);a("#nav .contract > p").css("width",
c-(d+20));a("#nav .expand .home").css({"margin-right":d-20-(d-20)/2,width:(d-20)/2});0<a("#user_action").length&&(a("#user_action .bg").css("top",(b-a("#user_action .bg").height())/2),a("#user_action .select p").css("left",a("#user_action .select a.email").position().left+a("#user_action .select a.email").width()-a("#user_action .select p").width()+40));a("#points_history blockquote > img").width(a("#points_history blockquote").width());a(".col-square").each(function(){a(this).css("height",a(this).width())});
if(f.mode.panorama){var d=a("#panorama .view").data("width"),k=a("#panorama .view").data("height"),g=a("#panorama .view img");g.css({height:"",left:0});g.width(c).css("top",(b-g.height())/2);P(g);a("#panorama .info .circle").css("left",(c-90)/2);var B=g.width()/d,C=g.height()/k,h=g.position();a("#panorama .dot").each(function(){a(this).css({left:a(this).data("left")*B+h.left,top:a(this).data("top")*C+h.top})})}}function A(b,c){var d=a(c).prev(),e=!1,g=!1,B=!1;if(0==d.length||"img"!=d.prop("tagName").toLowerCase())d=
a(c).children(),a(c).hasClass("frame")?e=!0:a(c).parent().hasClass("switch")?g=!0:B=!0;if(0==d.height())setTimeout(function(){A(b,c)},200);else{var C=f.screen.width,h=f.screen.height,l=f.screen.column;B?a(c).children("img").width(a(c).width()):e?d.height()>d.width()?d.height(h).css("left",(C-d.width())/2):(d.css({height:"",left:0}),d.width(C).css("top",(h-d.height())/2),P(d)):g?(a(c).width(0.6*l),d=d.height(),a(c).css({height:d,top:(h-d)/2})):a(c).css({height:d.height(),width:d.width()}).children("a").css({height:d.height()-
6,width:d.width()-6})}}function P(a){a.height()<f.screen.height&&(a.css("width",""),a.height(f.screen.height).css({top:0,left:(f.screen.width-a.width())/2}))}function J(b){1<b?b=1:0>b&&(b=0);var c=2*b*Math.PI,d;d=12+12*Math.sin(c);c=12-12*Math.cos(c);a("#done").hide();return 0.5>=b?"M 12,12 V 0 A 12,12 0 0,1 "+d+","+c+" z":1>b?"M 12,12 V 0 A 12,12 0 1,1 "+d+","+c+" z":J(0.999)}function K(a){var c=a.getFullYear()+".",c=c+(a.getMonth()+1+".");return c+=a.getDate()}function Q(a){var c=new Date(2013,
4,24);a=a.getTime()-c.getTime();return Math.ceil(a/1E3/3600/24)}function v(b){a("#nav .active").removeClass("active");a("#nav .contract span").eq(b).addClass("active");a("#nav .expand .blocks > p").eq(b+1).addClass("active")}function aa(){if(!(0<a("#content:visible").length)){for(var b,c=e.data.location.length-1;0<=c;c--){var d=e.data.location[c];if(2==d.Status||3==d.Status){b=d;break}}b!==r&&a.post(h.api_path,{ac:"imgbyloc",loc:b.ID},function(a){s(a)&&(e.data.gallery=a,R(a,b,!0),q())})}}function S(b){for(var c,
d,k=b=0;k<p.length;k++)if(b+=p[k].distance,this===p[k].obj){c=p[k];d=e.data.location[k];break}var g;null!=e.user.token&&2==c.status&&(g=new google.maps.Marker({position:this.getPosition(),clickable:!1,map:e.map,icon:{fillColor:"#e05206",fillOpacity:1,strokeOpacity:0,path:J(0),anchor:new google.maps.Point(12,12)},optimized:!1,zIndex:1}));a("#content").data("progress",{p:0,origin:this,obj:g,location:d});a("#ui_info li").eq(0).children("span").html(d.Location);g=new Date(d.CurrentTime+"+0800");a("#ui_info li").eq(1).children("b").html(Q(g));
a("#ui_info li").eq(1).children("span").html(K(g));a("#ui_info li").eq(2).children("b").html(t(b));a("#ui_info li").eq(3).children("span").html(z(d.Latitude)+", "+z(d.Longitude));a("#ui_info li").eq(4).children("b").html(d.PhotoCount);f.location=c.id;a.post(h.api_path,{ac:"imgbyloc",loc:c.id},function(b){if(s(b)){e.data.gallery=b;if(2==c.status){var d=e.data.location[c.index];a("#detail h2").html(d.Title);a("#detail .content").html(d.RichContent);a("#content").show();a("#detail .panorama a").click(function(a){a.stopPropagation();
y(0)})}R(b,c);q();a("#content").addClass("visible");a("#detail,.right-button .browse").show();TweenLite.fromTo("#content",0.4,{left:-a("#content").width()},{left:0,ease:Power2.easeOut});b=a("#content .order2").width();TweenLite.fromTo("#content .order2",0.2,{right:0},{right:-b,delay:0.4,ease:Power2.easeOut});TweenLite.fromTo("#content .order1",0.2,{right:0},{right:2*-b,delay:0.4,ease:Power2.easeOut});if(2==c.status){e.map.setZoom(7);e.map.panTo(a("#content").data("progress").origin.getPosition());
b=e.size.height/2-(e.size.height-a("#ui_board").height()+10)/2-20;e.map.panBy(-(e.size.width/2-e.size.column),-b);e.map.setOptions({draggable:!1});clearInterval(h.timer);var k=0;h.timer=setInterval(function(){k++;5>k?D():clearInterval(h.timer)},500)}}})}function R(b,c,d){b!==r&&(f.gallery_id=0,a("#content .img-share").append('<span><input type="text" placeholder="\u53d1\u8868\u60a8\u7684\u89c2\u70b9\u80fd\u8d62\u53d6\u66f4\u591a\u79ef\u5206" /><a class="btn"><b>\u5206\u4eab\u81f3\uff1a</b><i class="icon-weibo"></i></a></span>').find("span").click(function(a){a.stopPropagation()}).end().find("a").click(T),
a("#content .mask,#content .right-button.back").hide(),3==c.status||3==c.Status||d?(a("#gallery > .frame").click(function(){a("#gallery").css("top","100%");a("#ui_info,#nav").show();L()}),U()):D())}function V(){var b=e.data.gallery.list,c=f.gallery_id+1,d=f.gallery_id-1;c>=b.length&&(c=0);0>d&&(d=b.length-1);2==b.length&&(d+=2);c=[d,c];a("#gallery > .frame").not(".active").remove();a("#gallery > .switch").empty();for(d=0;2>d;d++){var k=b[c[d]],g=a('<div class="frame"/>').appendTo("#gallery");a("<img/>").attr({src:k.FileName+
"b.jpg",alt:""}).appendTo(g);g.data("id",k.ID);a("#gallery > .switch").append('<a data-index="'+c[d]+'"><img src="'+k.FileName+'t.jpg" /></a>')}2==b.length&&(a("#gallery > .switch").append('<a data-index="0"><img src="'+b[0].FileName+'t.jpg" /></a>'),a("#gallery > .switch").append('<a data-index="1"><img src="'+b[1].FileName+'t.jpg" /></a>'));a("#gallery > .switch a").eq(1).addClass("next").end().eq(0).addClass("prev");a("#gallery > .switch .next,#gallery > .switch .prev").click(W);a("#gallery > .frame").click(X);
q()}function X(){a("#gallery").css("top","100%").hide();a("#ui_info,#nav").show()}function W(){if(!f.animating){var b=a(this).data("index"),c=a("#gallery > .frame").width(),d,e,g=a("#gallery > .frame").not(".active");a(this).hasClass("next")?(a.isNumeric(b)||(b=a("#gallery > .switch .next").data("index")),f.gallery_id=b,d={left:c},c=-c,e=1):(a.isNumeric(b)||(b=a("#gallery > .switch .prev").data("index")),f.gallery_id=b,d={left:-c},e=0);f.animating=!0;TweenLite.fromTo(g.eq(e).addClass("visible"),0.8,
d,{left:0,ease:Power2.easeOut});TweenLite.to("#gallery > .frame.active",0.8,{left:c,ease:Power2.easeOut,onComplete:function(){f.animating=!1;a("#gallery > .frame.active").removeClass("active");g.eq(e).addClass("active");V();a("#gallery > .pager span > b").text(b+1)}})}}function U(){var b=e.data.gallery.list;a("#gallery > .frame").remove();var c=a(this).data("index");c===r&&(c=0);f.gallery_id=c;V();var d=b[c],k=a('<div class="frame"/>').appendTo("#gallery");a("<img/>").attr({src:d.FileName+"b.jpg",
alt:""}).appendTo(k);k.data("id",d.ID).addClass("visible active");a("#gallery > .pager span").html("<b>1</b> / "+b.length);a("#gallery > .pager a").click(W);a("#gallery > .frame").click(X);a("#gallery > .pager span > b").text(c+1);a("#gallery").css("top",0).show();a("#ui_info,#nav").hide();q()}function D(){var b=a("#google_map .pattern").parent().css("transform");if(b=/matrix\(([\d\s-,]+)\)/.exec(b)){var c=b[1].replace(/\s/g,"").split(","),b=Number(c[c.length-2]),c=Number(c[c.length-1]);a("#google_map .pattern").css("transform",
"matrix(1,0,0,1,"+-b+","+-c+")")}else b=a("#google_map .pattern").parent().css("left"),c=a("#google_map .pattern").parent().css("top"),b=-Number(b.substr(0,b.length-2)),c=-Number(c.substr(0,c.length-2)),a("#google_map .pattern").css({left:b,top:c})}function ba(){if(!h.allowedBounds.contains(e.map.getCenter())){var a=e.map.getCenter(),c=a.lng(),a=a.lat(),d=h.allowedBounds.getNorthEast().lng(),k=h.allowedBounds.getNorthEast().lat(),g=h.allowedBounds.getSouthWest().lng(),f=h.allowedBounds.getSouthWest().lat();
c<g&&(c=g);c>d&&(c=d);a<f&&(a=f);a>k&&(a=k);e.map.setCenter(new google.maps.LatLng(a,c))}}function ca(){if(n.google!==r){h.allowedBounds=new google.maps.LatLngBounds(new google.maps.LatLng(18.895114,75.21579),new google.maps.LatLng(45.90816,121.89743));var b=["ol-vehicle.png","img/ol-dest-a.png","img/ol-dest-b.png","img/ol-dest-c.png",{url:"img/ol-stop.png",anchor:new google.maps.Point(11,10.5)},{url:"img/ol-spot.png",anchor:new google.maps.Point(8,7.5)}];w=[new google.maps.LatLng(43.91719,81.3241),
new google.maps.LatLng(25.021529,98.490264),new google.maps.LatLng(31.240985,121.474113)];var c=[],d=new google.maps.LatLng(40.353216,98.349609),k={center:d,zoom:5,minZoom:4,maxZoom:8,mapTypeId:google.maps.MapTypeId.SATELLITE,disableDefaultUI:!0,noClear:!0,scrollwheel:!1};e.map=new google.maps.Map(document.getElementById("google_map"),k);google.maps.event.addListener(e.map,"bounds_changed",D);google.maps.event.addListener(e.map,"zoom_changed",D);google.maps.event.addListener(e.map,"center_changed",
ba);google.maps.event.addListenerOnce(e.map,"idle",function(){var b=a("#google_map .pattern").remove();a("#google_map:first-child > :first > :first > :first").prepend(b)});google.maps.event.addDomListener(a("#map_control")[0],"click",function(){e.map.panTo(d)});google.maps.event.addDomListener(a("#map_control i")[0],"click",function(a){a.stopPropagation();e.map.setZoom(e.map.getZoom()+1)});google.maps.event.addDomListener(a("#map_control i")[1],"click",function(a){a.stopPropagation();e.map.setZoom(e.map.getZoom()-
1)});a.getJSON(h.api_path,{ac:"getlocation"},function(d){if(s(d)){e.data.location=d.list;for(var f=0,k=0,h=0;h<d.list.length;h++){var m=d.list[h],f=f+m.Distance,k=k+m.PhotoCount,l=new google.maps.LatLng(m.Latitude,m.Longitude),n=new google.maps.Marker({position:l,map:e.map,icon:b[m.Type],title:m.Location,optimized:!1,zIndex:10*(b.length-m.Type)});p.push({id:m.ID,index:h,obj:n,type:m.Type,distance:m.Distance,status:m.Status});5>m.Type&&c.push({location:l});if(2==m.Status||3==m.Status)google.maps.event.addListener(n,
"mouseover",function(b){null==a("#content").data("progress")&&this.setIcon({url:"img/ol-hover.png",anchor:new google.maps.Point(70,44)})}),google.maps.event.addListener(n,"mouseout",function(a){a:{for(a=0;a<p.length;a++)if(this===p[a].obj){a=p[a];break a}a=null}this.setIcon(b[a.type])}),google.maps.event.addListenerOnce(n,"click",S)}h=new google.maps.DirectionsService;g.setMap(e.map);m={origin:p[0].obj.getPosition(),destination:p[p.length-1].obj.getPosition(),travelMode:google.maps.DirectionsTravelMode.DRIVING,
waypoints:c};h.route(m,function(a,b){b==google.maps.DirectionsStatus.OK&&g.setDirections(a)});h=d.list[d.list.length-1];m=new Date;e.geoinfo.location=h.Location;e.geoinfo.past=Q(m);e.geoinfo.date=K(m);e.geoinfo.distance=f;e.geoinfo.latlng=z(h.Latitude)+", "+z(h.Longitude);e.geoinfo.pics=k;a("#ui_info li").eq(0).children("span").html(e.geoinfo.location);a("#ui_info li").eq(1).children("b").html(e.geoinfo.past);a("#ui_info li").eq(1).children("span").html(e.geoinfo.date);a("#ui_info li").eq(2).children("b").html(t(e.geoinfo.distance));
a("#ui_info li").eq(3).children("span").html(e.geoinfo.latlng);a("#ui_info li").eq(4).children("b").html(t(e.geoinfo.pics));a("#intro .stat li").eq(0).children("span").text(t(e.geoinfo.distance));a("#intro .stat li").eq(1).children("span").text(d.list.length);a("#intro .stat li").eq(2).children("span").text(t(e.geoinfo.pics));d=String(f);f=6-d.length;a("#ui_counter .digit b").text("0");for(k=0;k<d.length;k++)a("#ui_counter .digit").eq(k+f).children("b").text(d[k])}});var g=new google.maps.DirectionsRenderer({polylineOptions:{clickable:!1,
strokeOpacity:0,icons:[{icon:{path:"M 0,0 0,1",strokeColor:"#ffffff",strokeOpacity:1,scale:2},offset:"0",repeat:"6px"}]},suppressMarkers:!0});f.route=g}}function y(b){e.data.panorama!==r?M(e.data.panorama,b):a.getJSON("files/yili.json",{seed:Math.random()},function(c){e.data.panorama=c;f.mode.panorama=!0;f.panorama={};f.panorama.discovered=0;f.panorama.array=[];f.panorama.count=0;f.panorama.scene=c.count;for(var d in c.list)f.panorama.count+=c.list[d].items.length;a("#panorama .browse").empty();for(d=
0;d<c.count;d++){var k=a('<p class="img-hover"><img src="'+c.list[d].file+'t.jpg" /><span><a></a></span></p>');a("#panorama .browse").append(k)}a("#panorama .browse a").click(function(){var b=a(this).index("#panorama .browse a");M(c,b);a("#panorama .bar .nav > span > i").hide();a("#panorama .bar .browse").hide();a("#panorama .info .circle").show();a("#panorama .bar .nav > span > span").show()});M(c,b)})}function M(b,c){f.panorama.index=c;a("#panorama .view .dot").remove();a("#panorama .bar .nav > span > span").html("<b>"+
(c+1)+"</b> / "+b.count);a("#panorama .info .circle b").text(f.panorama.discovered);for(var d=0;d<b.list[c].items.length;d++){var e=b.list[c].items[d],g=a('<a class="dot"><span><i><b></b></i></span></a>');g.data({left:e.x,top:e.y,id:e.id});a("#panorama .view > img").before(g)}a("#panorama .view > img").attr("src",b.list[c].file+"b.jpg");a("#panorama .view").data({height:b.list[c].height,width:b.list[c].width});a("#panorama .dot").click(da);a("#ui_board").hide();a("#panorama").show();q()}function da(){if(!(0<
a("#panorama .panel:visible").length||0<a("#panorama .bar > span.active").length)){var b=a(this).index(".dot"),c=a(this).position(),d=a(this).parent().position().left,k=a(this).data("id");f.panorama.array[k]||(f.panorama.array[k]=1,f.panorama.discovered+=1,f.panorama.discovered==f.panorama.count&&a.post(h.api_path,{ac:"gamecomplete",token:e.user.token,game:1},function(a){s(a)&&(alert("\u606d\u559c\u4f60\uff01\u901a\u8fc7\u4e92\u52a8\u6e38\u620f\u83b7\u5f97 "+a.amount+" \u70b9\u79ef\u5206\u3002"),
E(a.points))}));a(this).addClass("active");a("#panorama .info .circle").removeClass("active").html("\u53d1\u73b0<b>"+f.panorama.discovered+"</b>");a("#panorama .panel").css("left",c.left+d).css("visibility","hidden").show();var g=1;c.left+d+a("#panorama .panel").width()+16>f.screen.width&&(a("#panorama .panel").css("left",c.left-d-a("#panorama .panel").width()-16),g=-1);b=a("#panorama .panel").children().text(e.data.panorama.list[f.panorama.index].items[b].desc).height();c.top+45+b+20>f.screen.height?
a("#panorama .panel p").css("margin-top",c.top-45-b):a("#panorama .panel p").css("margin-top",c.top+45);a("#panorama .dot").not(".active").hide();a("#panorama .mask").addClass("close").one("click",function(){a("#panorama .dot.active").removeClass("active");a("#panorama .mask").removeClass("close");l.fadeOut("#panorama .panel p",0.2);var b=a("#panorama .panel").css("visibility","").width();if(0<g)TweenLite.to("#panorama .panel",0.2,{width:0,delay:0.2,ease:Power2.easeOut});else{var c=a("#panorama .panel").css("left"),
c=Number(c.substr(0,c.length-2));TweenLite.to("#panorama .panel",0.2,{left:c+b,width:0,delay:0.2,ease:Power2.easeOut})}l.fadeOut("#panorama .mask",0.2,0.2,function(){a("#panorama .panel").width(b).hide();a("#panorama .dot").show()})});l.fadeIn("#panorama .mask",0.2);a("#panorama .panel p").hide();c=a("#panorama .panel").css("visibility","").width();0<g?TweenLite.fromTo("#panorama .panel",0.4,{width:0},{width:c,ease:Power2.easeOut}):(b=a("#panorama .panel").css("left"),b=Number(b.substr(0,b.length-
2)),TweenLite.fromTo("#panorama .panel",0.4,{left:b+c,width:0},{left:b,width:c,ease:Power2.easeOut}));l.fadeIn("#panorama .panel p",0.2,0.4)}}function Y(b){if(x)return!1;if(b.keyCode){if(13!=b.keyCode)return}else if(b.charCode&&13!=b.charCode)return;var c=a(this).parents("form");b=c.find('[name="email"]');if(""!=b.val()&&b.val()!=b.attr("placeholder")){if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(b.val()))return alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u7535\u5b50\u90ae\u7bb1\u3002"),
b.select(),!1}else return alert("\u8bf7\u8f93\u5165\u7535\u5b50\u90ae\u7bb1\u3002"),b.focus(),!1;b=c.find('[name="pass"]');if(""!=b.val()&&b.val()!=b.attr("placeholder")){var d=c.find('[name="repass"]');if(0<d.length)if(""!=d.val()&&d.val()!=d.attr("placeholder")){if(d.val()!=b.val())return alert("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d\u3002"),d.select(),!1}else return alert("\u8bf7\u518d\u8f93\u5165\u4e00\u6b21\u5bc6\u7801\u3002"),d.focus(),!1}else return alert("\u8bf7\u8f93\u5165\u5bc6\u7801\u3002"),
b.focus(),!1;x=!0;c.find("button").addClass("loading");a.post(h.api_path,c.serialize(),function(a){x=!1;c.find("button").removeClass("loading");s(a)&&N(a)})}function N(b){if(null==b.token||""==b.token||"null"==b.token)return F(),!1;e.user.token=b.token;u("auth_token",b.token);null!=b.sinaid&&(""!=b.sinaid&&0!=b.sinaid)&&(u("weibo_user",!0),e.user.weibo=!0);E(b.points);a("#ui_user .btns").hide();a("#ui_user .bar").show();a("#ui_user .btn-left").show();a("#user_action").hide()}function F(){e.user.token=
null;e.user.points=null;e.user.weibo=!1;u("auth_token",null,new Date);u("user_points","",new Date);u("weibo_user","",new Date);a("#ui_user .btns").show();a("#ui_user .bar").hide();a("#ui_user .btn-left").hide()}function T(){if(!x){var b,c,d=!1;this!==n&&"span"==a(this).parent().prop("tagName").toLowerCase()?c=a(this).prev():(c=a("#gallery .share textarea"),d=!0);b=c.val();if(""==b)return alert("\u8fd8\u662f\u8bf4\u4e00\u70b9\u4ec0\u4e48\u5427\u3002"),c.focus(),!1;null==e.user.token?alert("\u8bf7\u5148\u767b\u5f55\u3002"):
e.user.weibo?(x=!0,d?(a('input[name="pic"]').val(a("#gallery .switch a").eq(f.gallery_id).children().attr("src")),a('input[name="token"]').val(e.user.token),a('input[name="url"]').val(n.location.href),a('input[name="gid"]').val(a("#gallery .frame.visible").data("id")),b=a("#gallery .share form").serialize()):b={ac:"galleryshare",status:b,pic:a(this).parent().prev().attr("src"),token:e.user.token},a.post(h.api_path,b,function(b){x=!1;s(b)?(E(b.points),alert("\u5206\u4eab\u6210\u529f\uff01\n\u606d\u559c\u60a8\u83b7\u5f97\u4e86 "+
b.amount+" \u70b9\u79ef\u5206\u3002"),c.val(""),a("#gallery .share form").removeClass("bg"),a("#gallery .share").css("height",""),a("#gallery .mask").hide(),a("#gallery .share p.submit span").width(0),a("#gallery .share p.submit").removeClass("submit")):114==b.code&&(alert("\u5206\u4eab\u6210\u529f\uff01"),c.val(""))})):(alert("\u8bf7\u5148\u7ed1\u5b9a\u4e00\u4e2a\u5fae\u535a\u8d26\u53f7\u3002"),O())}}function ea(){G();a.post(h.api_path,{ac:"pointshistory",token:e.user.token},function(b){if(s(b)){for(var c=
a("#points_history .article").empty(),d,e=0;e<b.list.length;e++){var f=b.list[e],h=K(new Date(f.AddTime));if(!d||d!=h)d=h,c.append("<h2>"+d+'</h2><div class="block"></div>');var h=c.find(".block:last"),l=a('<div class="item"/>');a('<i class="circle"/>').text("+"+t(f.Amount)).appendTo(l);switch(f.Type){case 1:l.append('<p class="single-line">\u884c\u8fdb<b>'+f.Quantity+"</b>\u516c\u91cc</p>");break;case 2:break;case 3:l.append('<blockquote><img src="'+f.Content1+'" /><div class="comment"><h5>\u6211\u7684\u8bc4\u8bba</h5><p>'+
f.Content2+"</p></div></blockquote>");break;case 4:l.append('<img src="'+f.Content1+'" />');break;case 5:l.append('<p class="single-line">'+f.Summary+"</p>");break;default:return}h.append(l)}a("#content").addClass("visible");a("#detail,.right-button .browse,#content .mask-white").hide();a("#content,#points_history,.right-button .satellite").show();q();TweenLite.fromTo("#content",0.4,{left:-a("#content").width()},{left:0,ease:Power2.easeOut});b=a("#content .order2").width();TweenLite.fromTo("#content .order2",
0.2,{right:0},{right:-b,delay:0.4,ease:Power2.easeOut});TweenLite.fromTo("#content .order1",0.2,{right:0},{right:2*-b,delay:0.4,ease:Power2.easeOut});a("#content .gallery-list").removeClass("visible");a("#gallery").css("top","100%")}})}function E(b){e.user.points=b;u("user_points",b);a("#ui_user .bar span b").text(t(b))}function O(){n.open("OAuth.aspx?auth=1","auth_weibo","width=615,height=505")}function s(b){if(0==b.code)return!0;101==b.code?(alert("\u8be5\u90ae\u7bb1\u5df2\u88ab\u4f7f\u7528\u3002"),
a('input[name="email"]').select()):102==b.code?alert("\u90ae\u7bb1\u6216\u5bc6\u7801\u9519\u8bef\u3002"):110===b.code?(alert("\u8bf7\u5148\u767b\u5f55\u3002"),F()):111===b.code?(alert("\u8bf7\u5148\u767b\u5f55\u3002"),F()):112==b.code?alert("\u5fae\u535a\u8d26\u53f7\u5df2\u7ed1\u5b9a\u5230\u5176\u5b83\u8d26\u53f7\uff0c\u8bf7\u76f4\u63a5\u7528\u5fae\u535a\u8d26\u53f7\u767b\u5f55\u3002"):113==b.code?(alert("\u8bf7\u5148\u7ed1\u5b9a\u4f60\u7684\u5fae\u535a\u8d26\u53f7\u3002"),O()):114!=b.code&&alert("\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002");
return!1}function H(b){var c=["#about","#vehicle","#media"];b>=c.length||0>b||(a(c[b]).show(),TweenLite.fromTo(c[b]+" .frame",0.3,{bottom:-a(c[b]+" .frame").height()},{bottom:0,ease:Power2.easeOut}),TweenLite.fromTo(c[b]+" .frame .head",0.4,{opacity:0},{opacity:1,delay:0.2,ease:Power2.easeOut}),TweenLite.killTweensOf("#main > .mask-alpha3,#main > .pattern-about"),a("#main > .mask-alpha3,#main > .pattern-about").css("opacity",1).show())}function G(){a(".gallery-list").removeClass("visible");a("#content .mask,#content .right-button.back").hide();
a("#ui_info").show();var b=a("#about:visible,#vehicle:visible,#media:visible");0<b.length&&(TweenLite.to(b.find(".frame .head"),0.2,{opacity:0,ease:Power2.easeOut}),TweenLite.to(b.find(".frame"),0.3,{bottom:-b.find(".frame").height(),delay:0.1,ease:Power2.easeOut,onComplete:function(){b.hide()}}),l.fadeOut("#main > .mask-alpha3,#main > .pattern-about",0.2,0.1));a("#points_history,.right-button .satellite").hide()}function Z(){f.route.setMap(null);for(var b=0;b<p.length;b++)p[b].obj.setMap(null);b=
[];b.push({location:w[1]});var c=new google.maps.DirectionsRenderer({polylineOptions:{clickable:!1,strokeOpacity:0,icons:[{icon:{path:"M 0,0 0,1",strokeColor:"#ffffff",strokeOpacity:1,scale:2},offset:"0",repeat:"6px"}]},suppressMarkers:!0});f.my_route=c;var d=new google.maps.DirectionsService;c.setMap(e.map);d.route({origin:w[0],destination:w[2],travelMode:google.maps.DirectionsTravelMode.DRIVING,waypoints:b},function(a,b){b==google.maps.DirectionsStatus.OK&&c.setDirections(a)});e.user.token?a.post(h.api_path,
{ac:"pointshistory",token:e.user.token},$):$()}function $(b){for(var c=[new google.maps.Point(52,106),new google.maps.Point(33,66)],d=[],f=0;f<w.length;f++){var g;0<f?g={url:"img/my_"+f+"_off.png",anchor:c[1]}:(g={url:"img/my_"+f+".png",anchor:c[0]},b!==r&&fa(f,b.list)&&(g.url="img/my_"+f+"_on.png",g.anchor=c[1]));g=new google.maps.Marker({position:w[f],map:e.map,icon:g});d.push(g);google.maps.event.addListener(g,"click",function(b){b=a.inArray(this,d);0==b&&y(0,b)});a("#ui_info").hide()}}function L(b){if(b=
a("#content").data("progress"))google.maps.event.addListenerOnce(b.origin,"click",S),b.obj&&b.obj.setMap(),e.map.setOptions({draggable:!0}),a("#content").data("progress",null);v(0);0<a("#content:visible").length&&(TweenLite.to("#content .order1",0.2,{right:0,ease:Power2.easeOut}),TweenLite.to("#content .order2",0.2,{right:0,delay:0.1,ease:Power2.easeOut}),TweenLite.to("#content .gallery-list",0.2,{right:0,delay:0.1,ease:Power2.easeOut}),TweenLite.to("#content",0.4,{left:-a("#content").width(),delay:0.2,
ease:Power2.easeOut,onComplete:function(){a("#content").hide();a(".gallery-list ul").empty()}}),a("#detail,.right-button a").show());a("#points_history,.right-button .satellite").hide();a("#ui_info li").eq(0).children("span").html(e.geoinfo.location);a("#ui_info li").eq(1).children("b").html(e.geoinfo.past);a("#ui_info li").eq(1).children("span").html(e.geoinfo.date);a("#ui_info li").eq(2).children("b").html(t(e.geoinfo.distance));a("#ui_info li").eq(3).children("span").html(e.geoinfo.latlng);a("#ui_info li").eq(4).children("b").html(e.geoinfo.pics)}
function fa(a,c){for(var d=0;d<c.length;d++)if(c[d].ContentID==a)return!0;return!1}function ga(){a("#nav .contract").click(function(){l.fadeOut("#nav .contract",0.2);l.fadeIn("#nav .expand",0.2);var b=a("#nav .blocks .col1").height();TweenLite.fromTo("#nav .blocks",0.4,{bottom:-b},{bottom:10,delay:0.12,ease:Power2.easeOut})});a("#nav .expand").click(function(){var b=a("#nav .blocks .col1").height();TweenLite.to("#nav .blocks",0.3,{bottom:-b,ease:Back.easeIn});l.fadeOut("#nav .expand",0.2,0.3);l.fadeIn("#nav .contract",
0.2,0.4)});a("#nav .expand p").click(function(){if(!a(this).hasClass("active")){G();var b=a(this).index();v(b-1);switch(b){case 1:L();f.my_route!==r&&(f.my_route.setMap(null),f.route.setMap(e.map),f.my_route=null);break;case 2:n.nsd_exp?(Z(),v(1)):y(0);break;case 3:H(0);break;case 4:H(1);break;case 5:H(2)}}});a("#btn_rule").click(function(){G();H(0);v(2)});a("#about .btn-simple").click(function(){a("#about").hide();a("#main > .mask-alpha3").hide();a("#main > .pattern-about").hide();v(0)});a(".cursor-close").click(function(){G();
v(0)});a("#footer .share li").click(function(){switch(a(this).attr("class")){case "weibo":shareToWeibo("\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/");break;case "renren":shareToRenren("\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf","\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/");break;case "douban":shareToDouban("\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/")}});a("#detail .article").scroll(function(){var b=a("#content").data("progress");if(b&&b.obj){var c=a(this).scrollTop(),d=a("#detail .article .content").height()-a(this).height(),c=c/d;c>b.p&&(d=b.obj.getIcon(),d.path=J(c),b.obj.setIcon(d),b.p=c);1<=c&&(b.p=100,null!=e.user.token&&a.post(h.api_path,{ac:"followroute",token:e.user.token,loc:f.location},function(a){s(a)&&(f.animation.flash(b.obj),E(a.points),alert("\u606d\u559c\u60a8\u901a\u8fc7\u6d4f\u89c8\u884c\u7a0b\u83b7\u5f97\u4e86 "+
a.amount+" \u70b9\u79ef\u5206\u3002"),b.obj.setMap())}))}});a("#content .right-button a.browse").click(function(b){b.stopPropagation();b=e.data.gallery;var c=a("#content").data("progress").location;a(".gallery-list ul").empty();for(var d=0;d<b.list.length;d++){var f=b.list[d],g=a('<li class="img-hover"/>').appendTo(".gallery-list ul");a("<img/>").attr({src:f.FileName+"t.jpg",alt:c.Location}).appendTo(g);g.append('<span><a data-index="'+d+'"></a></span>')}q();a("#content .gallery-list li a").click(U);
a("#content .gallery-list").css("opacity",0).addClass("visible");l.fadeIn("#content .gallery-list",0.4);a("#content .mask,#content .right-button.back").show()});a("#content").click(L);a("#content .right-button.back a").click(function(b){b.stopPropagation();a(".gallery-list").removeClass("visible");a("#content .mask,#content .right-button.back").hide()});a("#content .gallery-list").click(function(a){a.stopPropagation()});a("#content .mask-white").click(function(a){a.stopPropagation()});a("#gallery .share a.btn").hover(function(){a(this).children("span").width(50)},
function(){a(this).parent().hasClass("submit")||a(this).children("span").width(0)}).click(function(){if(a(this).parent().hasClass("submit"))T();else{a("#gallery .share form").addClass("bg");var b=a("#gallery .share form").height(),c=a("#gallery .share a.btn").height();a("#gallery .share").height(c);a(this).parent().addClass("submit");a("#gallery textarea").hide();l.fadeIn("#gallery .mask",0.2);l.fadeIn("#gallery .share form",0.3);TweenLite.to("#gallery .share",0.4,{height:b-c-8,ease:Power2.easeOut});
TweenLite.to("#gallery .share .bg .pattern",0.4,{height:b-c-c-8,ease:Power2.easeOut});l.fadeIn("#gallery textarea",0.2,0.4,function(){a("#gallery textarea").focus()})}a("#gallery .mask").addClass("cursor-close").one("click",function(){a(this).removeClass("cursor-close");l.fadeOut("#gallery .share form",0.4,0,function(){a("#gallery .share form").removeClass("bg");a("#gallery .share,#gallery .share .pattern").css("height","");a("#gallery textarea").css("display","");a("#gallery .mask").hide();a("#gallery .share p.submit span").width(0);
a("#gallery .share p.submit").removeClass("submit")})})});a("#ui_user .btns a").click(function(){var b=a(this).index();a(this).parent().hasClass("btn-left")?n.nsd_exp?(a(this).text("\u53d1\u73b0\u6700\u7f8e\u524d\u7ebf"),Z(),v(1)):y(0):(a("#user_action").show(),0==b?(a("#user_action .pattern").hide(),a("#user_action .select").show()):(a("#user_action .pattern").hide(),a("#user_action .select").hide(),a("#user_action .register").show(),a(".register input:first").focus()),q())});a("#ui_user .bar > span").click(ea);
a("#ui_user a.exit").click(F);a("#ui_info .pic").click(aa);a("#user_action a.weibo").click(function(){O()});a("#user_action a.email").click(function(){a("#user_action").addClass("wide");a(".select").hide();a(".login").show();a(".login input:first").focus();q()});a("#user_action a.exist").click(function(){a(".select").hide();a(".register").show();a(".register input:first").focus();q()});a("#user_action .textbox").focus(function(){a(this).hasClass("placeholder")&&(a(this).val("").removeClass("placeholder"),
a(this).hasClass("password")&&a(this).attr("type","password"))});a("#user_action .textbox").blur(function(){""==a(this).val()&&(a(this).val(a(this).attr("placeholder")).addClass("placeholder"),a(this).hasClass("password")&&a(this).attr("type","text"))});a("#user_action .login p a").click(function(){a("#user_action .pattern").hide();a("#user_action .select").hide();a("#user_action .register").show();a(".register input:first").focus()});a("#user_action .mask").click(function(){a("#user_action").hide()});
a("#user_action button").click(Y);a("#user_action input.textbox").keypress(Y);a("#about .tabs li").click(function(){if(!a(this).hasClass("active")){var b=a(this).index();a("#about .tab-item").hide().eq(b).show();a("#about .tabs li.active").removeClass("active");a(this).addClass("active")}});a("#panorama .info .circle").click(function(){0<a("#panorama .panel:visible").length||(a(this).hasClass("active")?(a("#panorama .mask").hide(),a("#panorama .info .circle").html("\u53d1\u73b0<b>"+f.panorama.discovered+
"</b>")):(a("#panorama .mask").css("opacity","").show(),a("#panorama .info .circle").html("\u5269\u4f59<b>"+(f.panorama.count-f.panorama.discovered)+"</b>")),a(this).toggleClass("active"))});a("#panorama .bar .nav > span").click(function(){0<a("#panorama .panel:visible").length||0<a("#panorama .info .circle.active").length||(a(this).hasClass("active")?(a(this).children("i").hide(),a("#panorama .bar .browse").hide(),a("#panorama .info .circle").show(),a(this).children("span").show()):(a(this).children("i").show(),
a("#panorama .bar .browse").show(),a("#panorama .info .circle").hide(),a(this).children("span").hide()),a(this).toggleClass("active"))});a("#panorama .bar .nav > a").click(function(){var b;if(a(this).hasClass("next")){if(b=f.panorama.index+1,b>=f.panorama.scene)return}else if(b=f.panorama.index-1,0>b)return;y(b)});a("#panorama a.close").click(function(){a("#panorama").hide();a("#ui_board").show()})}var e={},h={},f={},l={},p=[],w;n.nsd=e;n.setuser=function(a){s(a)&&(u("weibo_user",!0),e.user.weibo=
!0,N(a))};var x=!1;h.api_path="api/action.aspx";f.animation={};f.screen={};f.animation.flash=function(a){var c=a.getIcon();c.fillOpacity=0.45;a.setIcon(c)};e.user={};e.user.weibo=!1;e.geoinfo={};f.gallery_id=0;f.mode={};f.mode.map=!0;f.mode.panorama=!1;f.mode.gallery=!1;f.mode.detail=!1;l.fadeIn=function(b,c,d,e){TweenLite.delayedCall(d,function(){a(b).show()});TweenLite.fromTo(b,c,{opacity:0},{opacity:1,delay:d===r?0:d,ease:Power2.easeOut,onComplete:e})};l.fadeOut=function(b,c,d,e){TweenLite.to(b,
c,{opacity:0,delay:d===r?0:d,ease:Power2.easeOut,onComplete:function(){a(b).hide();e!==r&&e()}})};/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)?n.location.href="http://lr-nsd.com/mobile":a(function(){e.data={};var b=I("weibo_user");e.user.weibo=b||!1;N({token:I("auth_token"),points:Number(I("user_points"))});q();a(n).resize(q);ca();ga()})})(jQuery,window);
