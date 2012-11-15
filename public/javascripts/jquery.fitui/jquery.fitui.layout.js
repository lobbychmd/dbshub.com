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


$.fn.layout = function () {
    return this.each(function () {
        if ($(this).children().size() > 1) {
            var ver_align = $(this).children().eq(0).css('float') != 'left';

            if (ver_align) {
                var spliter = $(this).children('.spliter').draggable({
                    axis: "x", stop: function () { $(this).trigger('resize.split'); }
                }).bind('resize.split', function () {
                    var l = $(this).offset().left;
                    var nav = $(this).prev().width(l);
                    var content = $(this).next().css('margin-left', l + $(this).width());
                    $(this).css('left', 0);
                }).trigger('resize.split', []);

                var content = spliter.next().layout();
            } else {
                var root = $(this).parent()[0].tagName == 'BODY';
                var footer = $(this).parent().find('footer');
                var cr = $(this).children();
                var hOffset = 0;
                var content = null;
                for (var i = cr.size() - 1; i >= 0; i--) {
                    var d = cr.eq(i);
                    if ((d.attr('id') != this.id) && (d.css('display') != 'none'))
                        hOffset += d.height();
                }
                setting[container[0].id] = hOffset + (root ? 0 : document.documentElement.clientHeight - $(this).height());
                $.autoHeight(setting, true);
            }

        }

    });
}

$.initLayout = function (option) {
    if (!option) option = {};
    $.extend({ navWidth: 200, containers: [] }, option)
    $('body').layout();
    return;
    var setting = {};
    for (var j in option.containers) {
        var c = option.containers[j];
        $(c).each(function () {
            var root = $(c).parent()[0].tagName == 'BODY';
            var footer = $(c).parent().find('footer');
            var cr = $(this).parent().children();
            var hOffset = 0;
            for (var i = cr.size() - 1; i >= 0; i--) {
                var d = cr.eq(i);
                if ((d.attr('id') != this.id) && (d.css('display') != 'none'))
                    hOffset += d.height();
            }


            setting[this.id] = hOffset + (root ? 0 : document.documentElement.clientHeight - $(this).parent().height());
            if (root) {
                var nav = $(this).children('nav').width(option.navWidth);
                var spliter = $("<div class='spliter' />").insertAfter(nav).draggable({
                    axis: "x", stop: function () { $(this).trigger('resize.split'); }
                }).bind('resize.split', function () {
                    var l = $(this).offset().left;
                    var nav = $(this).prev().width(l);
                    var content = $(this).next().css('margin-left', l + $(this).width());
                    $(this).css('left', 0);
                }).trigger('resize.split', []);
                //var content = spliter.next();
                $(this).append("<div style='clear:both'>");

                setting['nav'] = hOffset;
                setting[".spliter"] = hOffset;
            }

        });


    }

    if (window.console) console.log(setting);
    $.autoHeight(setting, true);
}