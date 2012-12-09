$.uicontrols = {
    loadRequire: function (uiname, callback) {
        $LAB.script("/javascripts/uicontrols/" + uiname + ".js").wait(function () {
            $.get('/jqtpl?uiname=' + uiname, function (html) {
                $(html).appendTo('head');
                callback();

            }).appendTo('head');
        });
    },
    renderUIitem: function (uis, pageInfo, container) { 
        new seq_asyncArray(
            function (item, params, callback) {
                //if (item.ui == "QueryParams" || item.ui == "Toolbar")
                    $.uicontrols.loadRequire(item.ui, function () {
                        if ($.uicontrols[item.ui]) {
                            var htm = $("#uitp" + item.ui).tmpl(
                                    //params 是ui 设置的属性，经过一些处理之后生成 UI
                                    $.uicontrols[item.ui].params2tmpl( item.params, pageInfo)

                                ).appendTo(container);
                            eval("htm." + item.ui + "();");
                            $.uicontrols.renderUIitem(item.children, pageInfo, htm);
                            callback();
                        }
                    });
                //else callback();
            },
            uis,
            function () {
            }
        ).exec();
    }
};

$.fn.preview = function (uitxt) {
    return this.each(function () {
        var container = this;
        var data = $("<div>").uidesigner(uitxt, { getdata: true });

        $.get('http://localhost:3000/emulator/page?_id=507297f45722eb4838cde1bc&page=0', function (pageInfo) {
            //pageInfo  包括页面元数据，包含的查询的元数据，包含的查询结果数据（demo）
            $.uicontrols.renderUIitem(data.children, pageInfo, container);
        });


    });
}