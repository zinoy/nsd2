(function(a,l,B){function u(a){a=String(Math.floor(a));if(3>=a.length)return a;for(var c="",d=0;d<=Math.floor(a.length/3);d++){var e=a.length-3*(d+1),f=3;0>e&&(f+=e,e=0);if(0==f)break;0<d&&(c=","+c);c=a.substr(e,f)+c}return c}function C(a){var c=document.cookie,d=c.indexOf(" "+a+"=");-1==d&&(d=c.indexOf(a+"="));-1==d?c=null:(d=c.indexOf("=",d)+1,a=c.indexOf(";",d),-1==a&&(a=c.length),c=unescape(c.substring(d,a)));return c}function s(a,c,d){var e=new Date;e.setDate(e.getDate()+d);c=escape(c)+(null==
d?"":"; expires="+e.toUTCString());document.cookie=a+"="+c}function p(){a("body").css("overflow-y","scroll");a("body").css("overflow-x","hidden");var b=a(l).height(),c=a(l).width(),c=1280>c?1280:c,b=480>b?480:b;a("body").css("overflow","");f.screen.height=b;f.screen.width=c;a(".screen,#google_map .pattern,#google_map,#nav .expand,#user_action").css({height:b,width:c});var d=Math.floor((c-20)/9);e.size={column:d,height:b,width:c};f.screen.column=d;a("#google_map .pattern i").not(":first").css("margin-left",
d-20);a("#map_control").css("bottom",30);a("#ui_board").css("left",7*d);a("#main .copy").css("left",d+10);a(".col1").width(d-20);a(".col1-full").css("width",d);a("#detail,#points_history").css({height:b-40,"padding-left":d+10,width:4*d});a("#content .gallery-list .frame").height(b-20);a("#content .order1").css("right",2*-d);a("#content .order2,.gallery-list").css("right",-d);a("#content .img > img").width(a("#content .article").width());a("#content p.float-left > img,#content p.float-right > img").width(a("#content .article").width()/
2);a("#content .gallery-list img").width(a("#content .gallery-list ul").width()).removeAttr("height");a("#content .img-hover > span,#content .img-expand,#content .img-expand > span,#content .img-share,#kv_index").each(w);a("#content .img-share input").width(a("#content .img-share span").width()-90);a("#gallery .frame").each(w);a("#gallery .switch a").each(w);a("#nav .contract > p").css("width",c-(d+20));a("#nav .expand .home").css({"margin-right":d-20-(d-20)/2,width:(d-20)/2});0<a("#user_action").length&&
(a("#user_action .bg").css("top",(b-a("#user_action .bg").height())/2),a("#user_action .select p").css("left",a("#user_action .select a.email").position().left+a("#user_action .select a.email").width()-a("#user_action .select p").width()+40));a("#points_history blockquote > img").width(a("#points_history blockquote").width());a(".col-square").each(function(){a(this).css("height",a(this).width())});if(f.mode.panorama){var d=a("#panorama .view").data("width"),k=a("#panorama .view").data("height"),g=
a("#panorama .view img");g.css({height:"",left:0});g.width(c).css("top",(b-g.height())/2);J(g);a("#panorama .info .circle").css("left",(c-90)/2);var m=g.width()/d,t=g.height()/k,q=g.position();a("#panorama .dot").each(function(){a(this).css({left:a(this).data("left")*m+q.left,top:a(this).data("top")*t+q.top})})}}function w(b,c){var d=a(c).prev(),e=!1,g=!1,m=!1;if(0==d.length||"img"!=d.prop("tagName").toLowerCase())d=a(c).children(),a(c).hasClass("frame")?e=!0:a(c).parent().hasClass("switch")?g=!0:
m=!0;if(0==d.height())setTimeout(function(){w(b,c)},200);else{var t=f.screen.width,q=f.screen.height,P=f.screen.column;m?a(c).children("img").width(a(c).width()):e?(d.css({height:"",left:0}),d.width(t).css("top",(q-d.height())/2),J(d)):g?(a(c).width(0.6*P),d=d.height(),a(c).css({height:d,top:(q-d)/2})):a(c).css({height:d.height(),width:d.width()}).children("a").css({height:d.height()-6,width:d.width()-6})}}function J(a){a.height()<f.screen.height&&(a.css("width",""),a.height(f.screen.height).css({top:0,
left:(f.screen.width-a.width())/2}))}function D(b){1<b?b=1:0>b&&(b=0);var c=2*b*Math.PI,d;d=12+12*Math.sin(c);c=12-12*Math.cos(c);a("#done").hide();return 0.5>=b?"M 12,12 V 0 A 12,12 0 0,1 "+d+","+c+" z":1>b?"M 12,12 V 0 A 12,12 0 1,1 "+d+","+c+" z":D(0.999)}function E(a){var c=a.getFullYear()+".",c=c+(a.getMonth()+1+".");return c+=a.getDate()}function K(a){var c=new Date(2013,4,24);a=a.getTime()-c.getTime();return Math.ceil(a/1E3/3600/24)}function x(b){a("#nav .active").removeClass("active");a("#nav .contract span").eq(b).addClass("active");
a("#nav .expand .blocks > p").eq(b+1).addClass("active")}function L(b){var c;null!=e.user.token&&(c=new google.maps.Marker({position:this.getPosition(),clickable:!1,map:e.map,icon:{fillColor:"#e05206",fillOpacity:1,strokeOpacity:0,path:D(0),anchor:new google.maps.Point(12,12)},optimized:!1,zIndex:1}));a("#content").data("progress",{p:0,origin:this,obj:c});e.map.setZoom(8);e.map.panTo(this.getPosition());b=e.size.height/2-(e.size.height-a("#ui_board").height()+10)/2-20;e.map.panBy(-(e.size.width/2-
e.size.column),-b);e.map.setOptions({draggable:!1});clearInterval(h.timer);var d=0;h.timer=setInterval(function(){d++;10>d?y():clearInterval(h.timer)},500);var k,g;for(c=b=0;c<n.length;c++)if(b+=n[c].distance,this===n[c].obj){k=n[c];g=e.data.location[c];break}a("#ui_info li").eq(0).children("span").html(g.Location);c=new Date(g.CurrentTime+"+0800");a("#ui_info li").eq(1).children("b").html(K(c));a("#ui_info li").eq(1).children("span").html(E(c));a("#ui_info li").eq(2).children("b").html(u(b));a("#ui_info li").eq(3).children("span").html(g.Latitude+
","+g.Longitude);a("#ui_info li").eq(4).children("b").html(g.PhotoCount);f.location=k.id;a.post(h.api_path,{ac:"imgbyloc",loc:k.id},function(b){if(r(b)){var c=e.data.location[k.index];a("#detail h2").html(c.Title);a("#detail .content").html(c.RichContent);a("#content").show();a(".gallery-list ul").empty();for(var d=0;d<b.list.length;d++){var c=b.list[d],f=a('<li class="img-hover"/>').appendTo(".gallery-list ul");a("<img/>").attr({src:c.FileName+"t.jpg",alt:k.Location}).appendTo(f);f.append('<span><a data-index="'+
d+'"></a></span>')}a("#detail .panorama a").click(function(){M(0)});Q(b,k.Location);setTimeout(p,200)}})}function Q(b,c){if(b!==B){var d=b.list;f.gallery_id=0;var e=function(){var b=f.gallery_id+1,c=f.gallery_id-1;b>=d.length&&(b=0);0>c&&(c=d.length-1);2==d.length&&(c+=2);a("#gallery > .switch a").removeClass().off("click").eq(b).addClass("next").end().eq(c).addClass("prev");a("#gallery > .switch .next,#gallery > .switch .prev").click(g)},g=function(){if(!a(this).hasClass("active")){var b=a(this).data("index");
a.isNumeric(b)||(b=a(this).index());var c=f.gallery_id,d=a("#gallery > .frame").width();a(this).hasClass("next")?(f.gallery_id=b,a("#gallery > .frame").eq(b).css("left",d).addClass("visible"),d=-d):(f.gallery_id=b,a("#gallery > .frame").eq(b).css("left",-d).addClass("visible"));a("#gallery > .frame").eq(b).animate({left:0},1E3);a("#gallery > .frame").eq(c).animate({left:d},1E3,function(){a(this).removeClass("visible");e();a("#gallery .pager a.active").removeClass("active");a("#gallery .pager a").eq(b).addClass("active")})}};
a("#gallery > .frame").remove();a("#gallery > .pager,#gallery > .switch").empty();for(var m=0;m<d.length;m++){var t=d[m],q=a('<div class="frame"/>').appendTo("#gallery");a("<img/>").attr({src:t.FileName+"b.jpg",alt:c}).appendTo(q);q.data("id",t.ID);a("#gallery > .pager").append("<a><i></i></a>");a("#gallery > .switch").append('<a data-index="'+m+'"><img src="'+t.FileName+'t.jpg" /></a>')}2==d.length&&(a("#gallery > .switch").append('<a data-index="0"><img src="'+d[0].FileName+'t.jpg" /></a>'),a("#gallery > .switch").append('<a data-index="1"><img src="'+
d[1].FileName+'t.jpg" /></a>'));a("#gallery > .frame").click(function(){a("#gallery").css("top","100%");a("#ui_info").show()});a("#gallery > .pager a").click(g);a("#content .gallery-list li a").click(function(){var b=a(this).data("index");f.gallery_id=b;a("#gallery > .frame").removeClass("visible").eq(f.gallery_id).css("left",0).addClass("visible");a("#gallery > .pager a").removeClass("active").eq(f.gallery_id).addClass("active");e();a("#gallery").css("top",0);a("#ui_info").hide()});a("#content .img-expand > span").click(function(){a(this).parent().toggleClass("blockquote-expand")});
a("#content .img-share").append('<span><input type="text" placeholder="\u53d1\u8868\u60a8\u7684\u89c2\u70b9\u80fd\u8d62\u53d6\u66f4\u591a\u79ef\u5206" /><a class="btn"><b>\u5206\u4eab\u81f3\uff1a</b><i class="icon-weibo"></i></a></span>').find("a").click(N);a("#gallery").css("top","100%").show();a(".gallery-list").removeClass("visible");a("#content .mask,#content .right-button.back").hide();y()}}function y(){var b=a("#google_map .pattern").parent().css("transform");if(b=/matrix\(([\d\s-,]+)\)/.exec(b)){var c=
b[1].replace(/\s/g,"").split(","),b=Number(c[c.length-2]),c=Number(c[c.length-1]);a("#google_map .pattern").css("transform","matrix(1,0,0,1,"+-b+","+-c+")")}else b=a("#google_map .pattern").parent().css("left"),c=a("#google_map .pattern").parent().css("top"),b=-Number(b.substr(0,b.length-2)),c=-Number(c.substr(0,c.length-2)),console.log(b,c),a("#google_map .pattern").css({left:b,top:c})}function R(){if(!h.allowedBounds.contains(e.map.getCenter())){var a=e.map.getCenter(),c=a.lng(),a=a.lat(),d=h.allowedBounds.getNorthEast().lng(),
f=h.allowedBounds.getNorthEast().lat(),g=h.allowedBounds.getSouthWest().lng(),m=h.allowedBounds.getSouthWest().lat();c<g&&(c=g);c>d&&(c=d);a<m&&(a=m);a>f&&(a=f);e.map.setCenter(new google.maps.LatLng(a,c))}}function S(){if(l.google!==B){h.allowedBounds=new google.maps.LatLngBounds(new google.maps.LatLng(15.707663,72.685547),new google.maps.LatLng(54.826008,136.582031));var b=["ol-vehicle.png","img/ol-dest-a.png","img/ol-dest-b.png","img/ol-dest-c.png",{url:"img/ol-stop.png",anchor:new google.maps.Point(11,
10.5)},{url:"img/ol-spot.png",anchor:new google.maps.Point(8,7.5)}],c=[],d=new google.maps.LatLng(40.353216,98.349609),f={center:d,zoom:5,minZoom:4,mapTypeId:google.maps.MapTypeId.SATELLITE,disableDefaultUI:!0,noClear:!0,scrollwheel:!1};e.map=new google.maps.Map(document.getElementById("google_map"),f);google.maps.event.addListener(e.map,"bounds_changed",y);google.maps.event.addListener(e.map,"zoom_changed",y);google.maps.event.addListener(e.map,"center_changed",R);google.maps.event.addListenerOnce(e.map,
"idle",function(){var b=a("#google_map .pattern").remove();a("#google_map:first-child > :first > :first > :first").prepend(b)});google.maps.event.addDomListener(a("#map_control")[0],"click",function(){e.map.panTo(d)});google.maps.event.addDomListener(a("#map_control i")[0],"click",function(a){a.stopPropagation();e.map.setZoom(e.map.getZoom()+1)});google.maps.event.addDomListener(a("#map_control i")[1],"click",function(a){a.stopPropagation();e.map.setZoom(e.map.getZoom()-1)});a.getJSON(h.api_path,
{ac:"getlocation"},function(d){if(r(d)){e.data.location=d.list;for(var f=0;f<d.list.length;f++){var k=d.list[f],h=new google.maps.LatLng(k.Latitude,k.Longitude),l=new google.maps.Marker({position:h,map:e.map,icon:b[k.Type],title:k.Location,optimized:!1,zIndex:10*(b.length-k.Type)});n.push({id:k.ID,index:f,obj:l,type:k.Type,distance:k.Distance});5>k.Type&&c.push({location:h});2==k.Status&&(google.maps.event.addListener(l,"mouseover",function(b){null==a("#content").data("progress")&&this.setIcon({url:"img/ol-hover.png",
anchor:new google.maps.Point(70,44)})}),google.maps.event.addListener(l,"mouseout",function(a){a:{for(a=0;a<n.length;a++)if(this===n[a].obj){a=n[a];break a}a=null}this.setIcon(b[a.type])}),google.maps.event.addListenerOnce(l,"click",L))}d=new google.maps.DirectionsService;g.setMap(e.map);f={origin:n[0].obj.getPosition(),destination:n[n.length-1].obj.getPosition(),travelMode:google.maps.DirectionsTravelMode.DRIVING,waypoints:c};d.route(f,function(a,b){b==google.maps.DirectionsStatus.OK&&g.setDirections(a)})}});
var g=new google.maps.DirectionsRenderer({polylineOptions:{clickable:!1,strokeOpacity:0,icons:[{icon:{path:"M 0,0 0,1",strokeColor:"#ffffff",strokeOpacity:1,scale:2},offset:"0",repeat:"6px"}]},preserveViewport:!0,suppressMarkers:!0}),f=new Date;e.geoinfo.location="\u4f0a\u7281";e.geoinfo.past=K(f);e.geoinfo.date=E(f);e.geoinfo.distance=0;e.geoinfo.latlng="43.91719,81.3241";e.geoinfo.pics=31;a("#ui_info li").eq(0).children("span").html(e.geoinfo.location);a("#ui_info li").eq(1).children("b").html(e.geoinfo.past);
a("#ui_info li").eq(1).children("span").html(e.geoinfo.date);a("#ui_info li").eq(2).children("b").html(u(e.geoinfo.distance));a("#ui_info li").eq(3).children("span").html(e.geoinfo.latlng);a("#ui_info li").eq(4).children("b").html(e.geoinfo.pics)}}function M(b){e.data.panorama!==B?F(e.data.panorama,b):a.getJSON("files/yili.json",{seed:Math.random()},function(c){e.data.panorama=c;f.mode.panorama=!0;f.panorama={};f.panorama.discovered=0;f.panorama.array=[];f.panorama.count=0;f.panorama.scene=c.count;
for(var d in c.list)f.panorama.count+=c.list[d].items.length;a("#panorama .browse").empty();for(d=0;d<c.count;d++){var k=a('<p class="img-hover"><img src="'+c.list[d].file+'t.jpg" /><span><a></a></span></p>');a("#panorama .browse").append(k)}a("#panorama .browse a").click(function(){var b=a(this).index("#panorama .browse a");F(c,b)});F(c,b)})}function F(b,c){f.panorama.index=c;a("#panorama .view .dot").remove();a("#panorama .info .bar > span > span").html("<b>"+(c+1)+"</b> / "+b.count);a("#panorama .info .circle b").text(f.panorama.discovered);
for(var d=0;d<b.list[c].items.length;d++){var e=b.list[c].items[d],g=a('<a class="dot"><span><i><b></b></i></span></a>');g.data({left:e.x,top:e.y,id:e.id});a("#panorama .view > img").before(g)}a("#panorama .view > img").attr("src",b.list[c].file+"b.jpg");a("#panorama .view").data({height:b.list[c].height,width:b.list[c].width});a("#panorama .dot").click(T);a("#ui_board,#nav").hide();a("#panorama").show();p()}function T(){if(!(0<a("#panorama .panel:visible").length||0<a("#panorama .bar > span.active").length)){var b=
a(this).index(".dot"),c=a(this).position(),d=a(this).parent().position().left,k=a(this).data("id");f.panorama.array[k]||(f.panorama.array[k]=1,f.panorama.discovered+=1,f.panorama.discovered==f.panorama.count&&a.post(h.api_path,{ac:"gamecomplete",token:e.user.token,game:1},function(a){r(a)&&(alert("\u606d\u559c\u4f60\uff01\u901a\u8fc7\u4e92\u52a8\u6e38\u620f\u83b7\u5f97 "+a.amount+" \u5206\u3002"),z(a.points))}));a(this).addClass("active");a("#panorama .info .circle").removeClass("active").html("\u53d1\u73b0<b>"+
f.panorama.discovered+"</b>");a("#panorama .panel").css("left",c.left+d).show();c.left+d+a("#panorama .panel").width()+16>f.screen.width&&a("#panorama .panel").css("left",c.left-d-a("#panorama .panel").width()-16);b=a("#panorama .panel").children().text(e.data.panorama.list[f.panorama.index].items[b].desc).height();c.top+45+b+20>f.screen.height?a("#panorama .panel p").css("margin-top",c.top-45-b):a("#panorama .panel p").css("margin-top",c.top+45);a("#panorama .dot").not(".active").hide();a("#panorama .mask").addClass("close").one("click",
function(){a("#panorama .dot.active").removeClass("active");a("#panorama .panel").hide();a("#panorama .dot").show();a("#panorama .mask").removeClass("close").hide()}).show()}}function O(b){if(v)return!1;if(b.keyCode){if(13!=b.keyCode)return}else if(b.charCode&&13!=b.charCode)return;var c=a(this).parents("form");b=c.find('[name="email"]');if(""!=b.val()&&b.val()!=b.attr("placeholder")){if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(b.val()))return alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u7535\u5b50\u90ae\u7bb1\u3002"),
b.select(),!1}else return alert("\u8bf7\u8f93\u5165\u7535\u5b50\u90ae\u7bb1\u3002"),b.focus(),!1;b=c.find('[name="pass"]');if(""!=b.val()&&b.val()!=b.attr("placeholder")){var d=c.find('[name="repass"]');if(0<d.length)if(""!=d.val()&&d.val()!=d.attr("placeholder")){if(d.val()!=b.val())return alert("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d\u3002"),d.select(),!1}else return alert("\u8bf7\u518d\u8f93\u5165\u4e00\u6b21\u5bc6\u7801\u3002"),d.focus(),!1}else return alert("\u8bf7\u8f93\u5165\u5bc6\u7801\u3002"),
b.focus(),!1;v=!0;c.find("button").addClass("loading");a.post(h.api_path,c.serialize(),function(a){v=!1;c.find("button").removeClass("loading");r(a)&&G(a)})}function G(b){if(null==b.token||""==b.token||"null"==b.token)return A(),!1;e.user.token=b.token;s("auth_token",b.token);null!=b.sinaid&&(""!=b.sinaid&&0!=b.sinaid)&&(s("weibo_user",!0),e.user.weibo=!0);z(b.points);a("#ui_user .btns").hide();a("#ui_user .bar").show();a("#ui_user .btn-left").show();a("#user_action").hide()}function A(){e.user.token=
null;e.user.points=null;e.user.weibo=!1;s("auth_token",null,new Date);s("user_points","",new Date);s("weibo_user","",new Date);a("#ui_user .btns").show();a("#ui_user .bar").hide();a("#ui_user .btn-left").hide()}function N(){if(!v){var b,c,d=!1;this!==l&&"span"==a(this).parent().prop("tagName").toLowerCase()?c=a(this).prev():(c=a("#gallery .share textarea"),d=!0);b=c.val();if(""==b)return alert("\u8fd8\u662f\u8bf4\u4e00\u70b9\u4ec0\u4e48\u5427\u3002"),c.focus(),!1;null==e.user.token?alert("\u8bf7\u5148\u767b\u5f55\u3002"):
e.user.weibo?(v=!0,d?(a('input[name="pic"]').val(a("#gallery .switch a").eq(f.gallery_id).children().attr("src")),a('input[name="token"]').val(e.user.token),a('input[name="url"]').val(l.location.href),a('input[name="gid"]').val(a("#gallery .frame.visible").data("id")),b=a("#gallery .share form").serialize()):b={ac:"galleryshare",status:b,pic:a(this).parent().prev().attr("src"),token:e.user.token},a.post(h.api_path,b,function(b){v=!1;r(b)?(z(b.points),alert("\u5206\u4eab\u6210\u529f\uff01\n\u606d\u559c\u60a8\u83b7\u5f97\u4e86 "+
b.amount+" \u70b9\u79ef\u5206\u3002"),c.val(""),a("#gallery .share form").removeClass("bg"),a("#gallery .share").css("height",""),a("#gallery .mask").hide(),a("#gallery .share p.submit span").width(0),a("#gallery .share p.submit").removeClass("submit")):114==b.code&&(alert("\u5206\u4eab\u6210\u529f\uff01"),c.val(""))})):(alert("\u8bf7\u5148\u7ed1\u5b9a\u4e00\u4e2a\u5fae\u535a\u8d26\u53f7\u3002"),H())}}function I(){a.post(h.api_path,{ac:"pointshistory",token:e.user.token},function(b){if(r(b)){for(var c=
a("#points_history .article").empty(),d,e=0;e<b.list.length;e++){var f=b.list[e],h=E(new Date(f.AddTime));if(!d||d!=h)d=h,c.append("<h2>"+d+'</h2><div class="block"></div>');var h=c.find(".block:last"),l=a('<div class="item"/>');a('<i class="circle"/>').text("+"+u(f.Amount)).appendTo(l);switch(f.Type){case 1:l.append('<p class="single-line">\u884c\u8fdb<b>'+f.Quantity+"</b>\u516c\u91cc</p>");break;case 2:break;case 3:l.append('<blockquote><img src="'+f.Content1+'" /><div class="comment"><h5>\u6211\u7684\u8bc4\u8bba</h5><p>'+
f.Content2+"</p></div></blockquote>");break;case 4:l.append('<img src="'+f.Content1+'" />');break;case 5:l.append('<p class="single-line">'+f.Summary+"</p>");break;default:return}h.append(l)}a("#detail,.right-button a,#content .mask-white").hide();a("#content,#points_history,.right-button .satellite").show();a("#content .gallery-list").removeClass("visible");a("#gallery").css("top","100%");p()}});x(1)}function z(b){e.user.points=b;s("user_points",b);a("#ui_user .bar span b").text(u(b))}function H(){l.open("OAuth.aspx?auth=1",
"auth_weibo","width=615,height=505")}function r(b){if(0==b.code)return!0;101==b.code?(alert("\u8be5\u90ae\u7bb1\u5df2\u88ab\u4f7f\u7528\u3002"),a('input[name="email"]').select()):102==b.code?alert("\u90ae\u7bb1\u6216\u5bc6\u7801\u9519\u8bef\u3002"):110===b.code?(alert("\u8bf7\u5148\u767b\u5f55\u3002"),A()):111===b.code?(alert("\u8bf7\u5148\u767b\u5f55\u3002"),A()):112==b.code?alert("\u5fae\u535a\u8d26\u53f7\u5df2\u7ed1\u5b9a\u5230\u5176\u5b83\u8d26\u53f7\uff0c\u8bf7\u76f4\u63a5\u4f7f\u7528\u5fae\u535a\u8d26\u53f7\u767b\u5f55\u3002"):
113==b.code?(alert("\u8bf7\u5148\u7ed1\u5b9a\u4f60\u7684\u5fae\u535a\u8d26\u53f7\u3002"),H()):114!=b.code&&alert("\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002");return!1}function U(){a("#nav .btn").click(function(){a("#nav .contract").hide();a("#nav .expand").show()});a("#nav .expand").click(function(){a("#nav .contract").show();a("#nav .expand").hide()});a("#nav .expand p").click(function(){if(!a(this).hasClass("active")){var b=a(this).index();switch(b){case 1:a(".gallery-list").removeClass("visible");
a("#content .mask,#content .right-button.back").hide();a("#about,#vehicle").hide();a("#main > .mask-alpha3").hide();a("#pattern-about").hide();a("#points_history,.right-button .satellite").hide();a("#ui_info li").eq(0).children("span").html(e.geoinfo.location);a("#ui_info li").eq(1).children("b").html(e.geoinfo.past);a("#ui_info li").eq(1).children("span").html(e.geoinfo.date);a("#ui_info li").eq(2).children("b").html(u(e.geoinfo.distance));a("#ui_info li").eq(3).children("span").html(e.geoinfo.latlng);
a("#ui_info li").eq(4).children("b").html(e.geoinfo.pics);break;case 2:I();break;case 3:a("#about").show();a("#main > .mask-alpha3").show();a("#pattern-about").show();break;case 4:a("#vehicle").show(),a("#main > .mask-alpha3").show(),a("#pattern-about").show()}}x(b-1)});a("#about .btn-simple").click(function(){a("#about").hide();a("#main > .mask-alpha3").hide();a("#pattern-about").hide();x(0)});a("#footer .share li").click(function(){switch(a(this).attr("class")){case "weibo":shareToWeibo("\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/");break;case "renren":shareToRenren("\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf","\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/");break;case "douban":shareToDouban("\u8def\u864e\u4e2d\u56fd#\u53d1\u73b0\u65e0\u6b62\u5883 \u4e2d\u56fd\u6700\u7f8e\u524d\u7ebf#\u63a2\u4eab\u4e4b\u65c5\uff0c\u76f4\u9a71\u8fb9\u9672\u4eba\u8ff9\u7f55\u81f3\u4e4b\u5883\uff0c\u6311\u6218\u53f2\u65e0\u524d\u4f8b\u7684\u5168\u5929\u5019\u5168\u5730\u5f62\u8def\u51b5\uff0c\u7eb5\u60c5\u5c3d\u63fd\u4f0a\u7281\u7684\u5929\u5730\u4ea4\u878d\u4e4b\u5343\u8272\uff0c\u6df1\u5165\u89e6\u6d89\u817e\u51b2\u7684\u65f6\u5149\u4ea4\u6c47\u4e4b\u53e4\u9999\uff0c\u63a2\u7d22\u4e0a\u6d77\u7684\u7075\u611f\u78b0\u649e\u4e4b\u65b0\u5c1a\uff0c\u53d1\u73b0\u4e2d\u56fd\u6700\u524d\u7ebf\u7684\u878d\u5408\u4e4b\u7f8e\u3002",
"","http://lr-nsd.com/")}});a("#detail").scroll(function(){var b=a("#content").data("progress");if(b&&b.obj){var c=a(this).scrollTop(),d=a("#detail .article").height()-a(this).height(),c=c/d;c>b.p&&(d=b.obj.getIcon(),d.path=D(c),b.obj.setIcon(d),b.p=c);1<=c&&(b.p=100,null!=e.user.token&&a.post(h.api_path,{ac:"followroute",token:e.user.token,loc:f.location},function(a){r(a)&&(f.animation.flash(b.obj),z(a.points),alert("\u606d\u559c\u60a8\u901a\u8fc7\u6d4f\u89c8\u884c\u7a0b\u83b7\u5f97\u4e86 "+a.amount+
" \u70b9\u79ef\u5206\u3002"),b.obj.setMap())}))}});a("#content .right-button a.browse").click(function(){a(".gallery-list").addClass("visible");a("#content .mask,#content .right-button.back").show()});a("#content .right-button a.close").click(function(){var b=a("#content").data("progress");b&&(google.maps.event.addListenerOnce(b.origin,"click",L),b.obj&&b.obj.setMap(),e.map.setOptions({draggable:!0}),a("#content").data("progress",null));x(0);a("#content").hide();a("#detail,.right-button a").show();
a("#points_history,.right-button .satellite").hide();a("#ui_info li").eq(0).children("span").html(e.geoinfo.location);a("#ui_info li").eq(1).children("b").html(e.geoinfo.past);a("#ui_info li").eq(1).children("span").html(e.geoinfo.date);a("#ui_info li").eq(2).children("b").html(u(e.geoinfo.distance));a("#ui_info li").eq(3).children("span").html(e.geoinfo.latlng);a("#ui_info li").eq(4).children("b").html(e.geoinfo.pics)});a("#content .right-button.back a").click(function(){a(".gallery-list").removeClass("visible");
a("#content .mask,#content .right-button.back").hide()});a("#gallery .share a.btn").hover(function(){a(this).children("span").width(50)},function(){a(this).parent().hasClass("submit")||a(this).children("span").width(0)}).click(function(){if(a(this).parent().hasClass("submit"))N();else{a("#gallery .share form").addClass("bg");a("#gallery .share").height(a("#gallery .share form").height());a("#gallery .mask").show();a(this).parent().addClass("submit");var b=a("#gallery textarea").position();a("#gallery .btn-cancel").css({left:b.left+
a("#gallery textarea").width()-a("#gallery .btn-cancel").width()+10,top:b.top+a("#gallery textarea").height()-a("#gallery .btn-cancel").height()+5});a("#gallery textarea").focus()}});a("#gallery .share .btn-cancel").click(function(){a("#gallery .share form").removeClass("bg");a("#gallery .share").css("height","");a("#gallery .mask").hide();a("#gallery .share p.submit span").width(0);a("#gallery .share p.submit").removeClass("submit")});a("#ui_user .btns a").click(function(){var b=a(this).index();
a(this).parent().hasClass("btn-left")?I():(a("#user_action").show(),0==b?(a("#user_action .pattern").hide(),a("#user_action .select").show()):(a("#user_action .pattern").hide(),a("#user_action .select").hide(),a("#user_action .register").show(),a(".register input:first").focus()),p())});a("#ui_user .bar>span").click(I);a("#ui_user a.exit").click(A);a("#user_action a.weibo").click(function(){H()});a("#user_action a.email").click(function(){a("#user_action").addClass("wide");a(".select").hide();a(".login").show();
a(".login input:first").focus();p()});a("#user_action a.exist").click(function(){a(".select").hide();a(".register").show();a(".register input:first").focus();p()});a("#user_action .textbox").focus(function(){a(this).hasClass("placeholder")&&(a(this).val("").removeClass("placeholder"),a(this).hasClass("password")&&a(this).attr("type","password"))});a("#user_action .textbox").blur(function(){""==a(this).val()&&(a(this).val(a(this).attr("placeholder")).addClass("placeholder"),a(this).hasClass("password")&&
a(this).attr("type","text"))});a("#user_action .login p a").click(function(){a("#user_action .pattern").hide();a("#user_action .select").hide();a("#user_action .register").show();a(".register input:first").focus()});a("#user_action .mask").click(function(){a("#user_action").hide()});a("#user_action button").click(O);a("#user_action input.textbox").keypress(O);a("#about .tabs li").click(function(){if(!a(this).hasClass("active")){var b=a(this).index();a("#about .tab-item").hide().eq(b).show();a("#about .tabs li.active").removeClass("active");
a(this).addClass("active")}});a("#panorama .info .circle").click(function(){0<a("#panorama .panel:visible").length||(a(this).hasClass("active")?(a("#panorama .mask").hide(),a("#panorama .info .circle").html("\u53d1\u73b0<b>"+f.panorama.discovered+"</b>")):(a("#panorama .mask").show(),a("#panorama .info .circle").html("\u5269\u4f59<b>"+(f.panorama.count-f.panorama.discovered)+"</b>")),a(this).toggleClass("active"))});a("#panorama .info .bar > span").click(function(){0<a("#panorama .panel:visible").length||
0<a("#panorama .info .circle.active").length||(a(this).hasClass("active")?(a(this).children("i").hide(),a("#panorama .info .browse").hide(),a("#panorama .info .circle").show(),a(this).children("span").show()):(a(this).children("i").show(),a("#panorama .info .browse").show(),a("#panorama .info .circle").hide(),a(this).children("span").hide()),a(this).toggleClass("active"))});a("#panorama .info .bar > a").click(function(){var b;if(a(this).hasClass("next")){if(b=f.panorama.index+1,b>=f.panorama.scene)return}else if(b=
f.panorama.index-1,0>b)return;M(b)});a("#panorama a.close").click(function(){a("#panorama").hide();a("#ui_board,#nav").show()})}var e={},h={},f={},n=[];l.nsd=e;l.setuser=function(a){r(a)&&(s("weibo_user",!0),e.user.weibo=!0,G(a))};var v=!1;h.api_path="api/action.aspx";f.animation={};f.screen={};f.animation.flash=function(a){var c=a.getIcon();c.fillOpacity=0.45;a.setIcon(c)};e.user={};e.user.weibo=!1;e.geoinfo={};f.gallery_id=0;f.mode={};f.mode.map=!0;f.mode.panorama=!1;f.mode.gallery=!1;f.mode.detail=
!1;a(function(){e.data={};var b=C("weibo_user");e.user.weibo=b||!1;G({token:C("auth_token"),points:Number(C("user_points"))});p();a(l).resize(p);S();U()})})(jQuery,window);
