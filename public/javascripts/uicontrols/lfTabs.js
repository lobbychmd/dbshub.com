
$.uicontrols.lfTabs = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.fn.lfTabs = function () {
    return this.each(function () {
        var lis = $(this).children('ul').children();
        var i = 0;
        $(this).children('div').each(function () {
            lis.eq(i).children('a').attr('href', '#' + $(this).attr('id'));
            i++;
        }).end().tabs();
    });


};

$.uicontrols.page = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.fn.page = function () {
    return this.each(function () {
        
    });


};