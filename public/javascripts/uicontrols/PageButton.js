
$.uicontrols.PageButton = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        if (!uiparams.type) uiparams.type = "custom";
        return uiparams;
    }
};

