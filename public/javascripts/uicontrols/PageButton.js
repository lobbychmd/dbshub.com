
$.uicontrols.PageButton = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        if (!uiparams.type) uiparams.type = "custom";
        return uiparams;
    }
};

$.fn.PageButton = function () {
    return this.each(function () {
        $(this).button().click(function () {
            if ($(this).attr('biz')) {
                $.post('/emulator/biz/' + $(this).attr('biz'), $(this).closest('form').serializeArray(), function (data) {
                    if (data.IsValid) {
                        alert(data.Message);
                        window.location = window.location;
                    }
                    else alert(data.ErrorMessage);
                });
            }
            else if ($(this).hasClass('edit')) {
                $(this).closest('form').find('input[fn]').toggleReadOnly();
            }
            else if ($(this).hasClass('back')) {
                window.history.back();
            }
        });
    });


};