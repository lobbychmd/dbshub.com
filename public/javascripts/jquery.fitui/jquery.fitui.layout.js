$.autoHeightSetting = {};
$.autoHeight = function (setting, init, callback) {

    for (var i in setting)
        $.autoHeightSetting[i] = setting[i];
    if (init) {
        //alert(1);
        $(window).resize(function () {
            // alert(2);
            $.resizeW();
	    if (callback) callback();
        });
    }
    $.resizeW();
    if (callback) callback();
}

$.resizeW = function () {
    var h = document.documentElement.clientHeight;

    for (var i in $.autoHeightSetting) {
        $(i).css('height', (h - $.autoHeightSetting[i]) + "px");
        //alert(h - $.autoHeightSetting[i]);
        //alert($(i).size());
    }
}

$.initLayout = function (option) {
    if (!option) option = {};
    $.extend({ navWidth: 200 }, option)

    var c = $('body').children();
    var hOffset = 0;
    var main = null;
    var footer = null;
    for (var i = c.size() - 1; i >= 0; i--) {
        var d = c.eq(i);
        if (d[0].tagName != 'FOOTER') {
            if ((!main) && footer) main = d;
            else if (footer) hOffset += d.height();
        }
        else {
            if (!footer) footer = d;
            if (footer) hOffset += d.height();
        }
    }
    var setting = {};
    var nav = main.children('nav').width(option.navWidth);
    var spliter = $("<div class='spliter' />").insertAfter(nav).draggable({
        axis: "x", stop: function () { $(this).trigger('resize.split'); }
    }).bind('resize.split', function () {
        var l = $(this).offset().left;
        var nav = $(this).prev().width(l);
        var content = $(this).next().css('margin-left', l + $(this).width());
        $(this).css('left', 0);
    }).trigger('resize.split', []);
    var content = spliter.next();
    main.append("<div style='clear:both'>");
    setting['nav'] = hOffset;
    setting["#" + main.attr("id")] = hOffset;
    setting["#" + content.attr("id")] = hOffset;
    setting[".spliter"] = hOffset;
    if(window.console) console.log(setting);
    $.autoHeight(setting, true);
}