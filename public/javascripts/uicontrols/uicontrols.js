$.uicontrols = {};

$.fn.preview = function (uitxt) {
    return this.each(function () {
 
        var container = this;
        var data = $("<div>").uidesigner(uitxt, { getdata: true });
 
        $LAB.script("/javascripts/uicontrols/QueryParams.js").wait(function () {
            $("#QueryParams").tmpl($.uicontrols.QueryParams.demoData()).appendTo(container).QueryParams();
        });

    });
}