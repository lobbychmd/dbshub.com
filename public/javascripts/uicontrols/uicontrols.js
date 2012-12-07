$.uicontrols = {
    loadRequire: function(uiname, callback){
　　　　$LAB.script("/javascripts/uicontrols/" + uiname+ ".js").wait(function () {
            $.get('/jqtpl?uiname=' + uiname, function (html) {
                $(html).appendTo('head');
                callback();                

            }).appendTo('head');
        });

　　}
};

$.fn.preview = function (uitxt) {
    return this.each(function () {
        var container = this;
        var data = $("<div>").uidesigner(uitxt, { getdata: true });

        $.get('http://localhost:3000/emulator/page?_id=507297f35722eb4838cde197&page=0', function (pageInfo) {
            //pageInfo  包括页面元数据，包含的查询的元数据，包含的查询结果数据（demo）
            new seq_asyncArray(
                function (item, params, callback) {
                    //if (console) console.log(item.ui);
                    if (item.ui == "QueryParams" || item.ui == "Toolbar")
                        $.uicontrols.loadRequire(item.ui, function () {
                            if ($.uicontrols[item.ui]) {
                                console.log(item.attrs);
                                var htm = $("#uitp" + item.ui).tmpl(
                                       //params 是ui 设置的属性，经过一些处理之后生成 UI
                                        $.uicontrols[item.ui].params2tmpl( item.params, pageInfo)

                                    ).appendTo(container);
                                eval("htm." + item.ui + "();");
                                callback();
                            }
                        });
                    else callback();
                },
                data.children,
                function () {
                }
            ).exec();
        });


    });
}