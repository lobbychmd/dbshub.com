$.uicontrols = {
    loadRequire: function (uiname, callback) {
        $LAB.script("/javascripts/uicontrols/" + uiname + ".js").wait(function () {
            $.get('/jqtpl?uiname=' + uiname, function (html) {
                $(html).appendTo('head');
                callback();

            }).appendTo('head');
        });
    },
    renderUIitem: function (uis, pageInfo, container, callback) {
        new seq_asyncArray(
            function (item, params, callback1) {
                //if (item.ui == "QueryParams" || item.ui == "Toolbar")
                $.uicontrols.loadRequire(item.ui, function () {
                    if ($.uicontrols[item.ui]) {
                        var htm = $("#uitp" + item.ui).tmpl(
                        //params 是ui 设置的属性，经过一些处理之后生成 UI
                                    $.uicontrols[item.ui].params2tmpl(item.params, pageInfo)

                                ).appendTo(container);

                        if (item.children && item.children.length > 0)
                            $.uicontrols.renderUIitem(item.children, pageInfo, htm, function () {
                                callback1();
                            });
                        else callback1();

                    }
                });
                //else callback();
            },
            uis,
            function () {
                callback();
            }
        ).exec();
    },
    execUIitemJs: function (uis) {
        for (var i in uis) {
            var item = uis[i];
            eval("$('." + item.ui + "')." + item.ui + "();");
            if (item.children && item.children.length > 0)
                $.uicontrols.execUIitemJs(item.children);
        }
    }
};

$.fn.preview = function (moduleid, page, uitxt) {
    return this.each(function () {
        $(this).children().remove();
        var container = this;
        //格式：{ ui: ui, id: ui, params: params, attrs: attrs, children: [] };
        var data = $("<div>").uidesigner(uitxt, { getdata: true });
        console.log(data);
        $.get('http://localhost:3000/emulator/page?_id=' + moduleid + '&page=' + page, function (pageInfo) {

            //pageInfo  包括页面元数据，包含的查询的元数据，包含的查询结果数据（demo）
            //先构造所有ui，然后执行 js
            $.uicontrols.renderUIitem([{ ui: "ModulePage", params: {}, children: data.children}], pageInfo, container, function () {
                $.uicontrols.execUIitemJs([{ ui: "ModulePage", params: {}, children: data.children}]);
                alert('ready!');
            });
        });


    });
}