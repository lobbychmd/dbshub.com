
$.uicontrols.PageButton = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.fn.PageButton = function () {
    return this.each(function () {
        $(this).button();
    });


};