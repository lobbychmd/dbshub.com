
$.uicontrols.FlowBar = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];

        uiparams.data = eval(pageInfo.PageFlow);
        //console.log(uiparams.data);
        return uiparams;
    }
};

$.fn.FlowBar = function () {
    return this.each(function () {
        $(this).tabs()
    });


};