(function($, window, undefined) {
    function adjust() {
        $('body').css('overflow-y', 'scroll');
        $('body').css('overflow-x', 'hidden');
        var wh = $(window).height(), ww = $(window).width(), sw = ww < 1280 ? 1280 : ww;
        $('body').css('overflow', '');
        $('.screen,.pattern,#google_map').css({
            height : wh < 480 ? 480 : wh,
            width : sw
        });
        var iw = Math.floor((sw - 20) / 9);
        $('.pattern i').not(':first').css('margin-left', iw - 20);
        $('#ui_board').css('left', iw * 7);
        $('#nav').css('width', sw);
        $('#nav .col1').css('width', iw - 20);
        $('#nav .contract > p').css('width', sw - (iw + 20));
    }

    $(function() {
        adjust();
        $(window).resize(adjust);
    });
})(jQuery, window);
