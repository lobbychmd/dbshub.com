$.uicontrols = {
    config:{
        lfLayout_head: 'lfLayout',
        lfUserBar: 'lfLayout',
        lfLayout_menu: 'lfLayout',
        AccordionMenu: 'lfLayout',
        lfLayout_page: 'lfLayout',
        page: 'lfTabs',
        xyGridTable: 'DataGrid',
        xyGrid: 'DataGrid',
        lfLayout_foot: 'lfLayout',
        xyQuickRec :'xyEditorItems',
        ModuleTabs :'ModulePage'
    },
    loaded:[],
    loadRequire: function (uiname, loaded, callback) {
        var fileName = $.uicontrols.config[uiname];
        if (!fileName) fileName = uiname;
        
        if (loaded.indexOf(fileName) < 0){
            $LAB.script("/javascripts/uicontrols/" + fileName + ".js").wait(function () {
                $.get('/jqtpl?uiname=' + fileName, function (html) {
                    $(html).appendTo('head');
                    loaded.push(fileName);
                    callback();
                }).appendTo('head');
            });
            
        } else {
            callback();
        }
    },
    renderUIitem: function (uis, pageInfo, container, loaded, callback) {
        new seq_asyncArray(
            function (item, params, callback1) {
                $.uicontrols.loadRequire(item.ui, loaded, function () {
                    if ($.uicontrols[item.ui]) {
                        var htm = $("#uitp" + item.ui).tmpl(
                        //params 是ui 设置的属性，经过一些处理之后生成 UI
                                    $.uicontrols[item.ui].params2tmpl(item.params, pageInfo)
                                ).appendTo(container );
                        if (item.children && item.children.length > 0){
                            var uicontainer = $(htm).find('[uicontainer=' + item.params.name + ']');
                            $.uicontrols.renderUIitem(item.children, pageInfo, uicontainer.size() == 0 ? htm: uicontainer, loaded, function () {
                                callback1();
                            });
                        } else callback1();
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
    execUIitemJs: function (container, uis, distinctuis) {
        
        if (!distinctuis) distinctuis = [];
        for (var i in uis) {
            var item = uis[i];
            console.log(item);
            if (distinctuis.indexOf(item.ui) < 0) {
                try {
                    eval("$(container).find('." + item.ui + "')." + item.ui + "();");
                }catch(e){
                    alert(item.ui +'js 插件出错。');
                    console.log(e);
                }
                
                //eval("$('." + item.ui + "')." + item.ui + "();");
                
                distinctuis.push(item.ui);
            }
            
            if (item.children && item.children.length > 0)
                $.uicontrols.execUIitemJs(container, item.children, distinctuis);

        }
    },
    findModulePage: function (data) {
    var c = data;
    for (var i in c)
        if (c[i].ui == "ModulePage")
            return c[i];
        else if (c[i].children && (c[i].children.length > 0)) {
            var r = $.uicontrols.findModulePage(c[i].children);
            if (r) return r; else continue;
        } else;// console.log(c[i].ui);
    }

};

$.fn.preview = function (moduleid, page, uitxt, multiPage, loadLayout, loadPage, callback) {
    return this.each(function () {

        $(this).children().remove();
        var container = this;
        //格式：{ ui: ui, id: ui, params: params, attrs: attrs, children: [] };
        var url = '/emulator/page?';
        if(moduleid) url += '_id=' + moduleid + '&page=' + page + '&multiPage=' + multiPage + '&loadLayout=' + loadLayout + '&loadPage=' + loadPage;
        
        $.get(url, function (pageInfo) {
            console.log(pageInfo);
            var pageData = loadPage ? ($("<div>").uidesigner(uitxt ? uitxt : pageInfo.UI, { getdata: true })) : null;
            var layoutData =loadLayout ? $("<div>").uidesigner(pageInfo.layout.LayoutUI, { getdata: true }): null;
            
            var data = null;
            if ((!multiPage) || (loadLayout && loadPage)){
                modluepage= $.uicontrols.findModulePage(layoutData.children);
                modluepage.children = pageData.children;
                data = layoutData.children;
            }
            else {
                if (!loadLayout) data = [{ ui: "ModulePage", params: {}, children: pageData.children}];
                else if (!loadPage) data = layoutData.children;
            }
            //pageInfo  包括页面元数据，包含的查询的元数据，包含的查询结果数据（demo）
            //先构造所有ui，然后执行 js
            var loaded = $.uicontrols.loaded;//[];
            $.uicontrols.renderUIitem(data, pageInfo, container, loaded, function () {
                $.uicontrols.execUIitemJs(container, data);
                console.log('js 插件完成。');
                if (callback) callback();
                //alert('ready!');
            });
        });
    });
}