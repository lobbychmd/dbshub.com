$.fn.headerTabs = function (option) {
    return this.each(function () {
        $(this).addClass('headerTabs').tabs(option);
    });
}


$.fn.ajaxTabs = function (option) {
    return this.each(function () {
        var id = this.id;
        $.extend({ maxOpen: 5 }, option);
        $.ajaxTab.setup($(this), option.restoreState);
        $.lastState.register(this.id, $.tabState.serialize, option.saveState, option.restoreState);

        $(option.a_selector).die("click.withTab").live("click.withTab", function () {
            var url = $(this).attr('href');
            if (url) {
                $.ajaxTab.openTab($(this).attr('icon'), url.substring(1), $(this).text() ? $(this).text() : $(this).attr('title'), true);
                $.lastState.change(id); //打开会切换，切换时会保存,但是有问题, 切换事件发生在未创建tab之前
            }
            return false;
        });
    });
}

$.ajaxTab = {
    setup: function (tabs, restoreState) {
        $tabs = tabs.headerTabs ({
            tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
        });
        var id = tabs.attr('id');
        if (restoreState) restoreState();
        //切换事件必须在还原后绑定，因为还原过程连续ajax，前面的会终止，造成li.url 为空，会造成保存状态事件连续执行且数据有误
        $tabs.tabs({ select: function (event, ui) { 
            $.ajaxTab.tabCheckLoad(ui.index);
            $.lastState.change(id); 
        } });

        if ($('#tabs').attr("idx")) $tabs.tabs("select", parseInt( $('#tabs').attr("idx")));
        tabs.find("span.ui-icon-close").live("click", function () {
            var index = $("li", $tabs).index($(this).parent());
            $tabs.tabs("remove", index);
            $.lastState.change(id); 
        });
    },
    openTab: function (icon, url, text, loadNow) {
        var opened = $tabs.find('li[url="' + url + '"]');
        if (opened.size() == 0) {
            var index = $tabs.tabs("length") ;
            if (index == 10 - 1) alert('打开的窗口太多'); else {
                $tabs.tabs("add", "#ui-tabs-" + index, text);
                //$.autoHeight({}, true);
                $tabs.tabs("select", index).find('li.ui-tabs-active').attr('url', url).attr('index', index).attr('icon', icon);
                if (loadNow) $.ajaxTab.tabCheckLoad(index);
            }
        } else $tabs.tabs("select", parseInt(opened.attr('index')));
    },
    tabCheckLoad :function(index, forceLoad){
        var panel = $tabs.find('#ui-tabs-' + index + '.ui-widget-content');
        if (forceLoad || (!panel.attr('load'))) 
            panel.indicator({}).load($tabs.find('li[index=' + index + "]").attr('url'), function(){
                panel.attr('load', '1');
            });
    },
    updateTab : function(index, url, text){
        $tabs.find('li[index=' + index + ']').attr('url', url).children('a').text(text);
    }
};

$.tabState = {  //状态保留专用
    serialize: function (activeTabIndex) {
        var state = { OpenTabs: [], OpenNodes:[], LastIndex: activeTabIndex != undefined?activeTabIndex: $('#tabs>ul>li.ui-state-active').attr('index') };
        $tabs.find('ul>li').each(function () {
            if ($(this).attr('url')) //因为有时候会null， 待查 
                state.OpenTabs.push({ Url: $(this).attr('url'), Text: $(this).children('a').text(), MetaType: $(this).attr('metatype')});
        });
        //var li = $('#browser li.collapsable').each(function () {
        //    if ($(this).attr('_id') || $(this).attr('metaType')) state.OpenNodes.push($(this).attr('metaType') + "." + $(this).attr('_id') );
        //});  
        alert(JSON.stringify(state) );
        return JSON.stringify(state) ;
    }
}
