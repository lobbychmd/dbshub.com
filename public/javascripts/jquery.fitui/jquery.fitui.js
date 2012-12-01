/**********       **************/
$.fitui = {};

/**********   标签页    **************/
$.fn.headerTabs = function (option) {
    return this.each(function () {
        $(this).addClass('headerTabs').tabs(option);
    });
}

$.fn.ajaxTabs = function (option) {
    return this.each(function () {
        var id = this.id;
        $.extend({ maxOpen: 5 }, option);
        if (option.reload) {
            var idx = $(this).children('ul').children('li.ui-tabs-active').attr('index');
            $.ajaxTab.tabCheckLoad(idx, true);
        }
        else {
            $.ajaxTab.setup($(this), option.restoreState);
            $.lastState.register(this.id, $.tabState.serialize, option.saveState, option.restoreState);

            $(option.a_selector).die("click.withTab").live("click.withTab", function () {
                var url = $(this).attr('href');
                if (url) {
                    $.ajaxTab.openTab($(this).attr('icon'), url.substring(1),
                        $(this).text() ? $(this).text() : $(this).attr('title'), true,
                        option.create);
                    $.lastState.change(id); //打开会切换，切换时会保存,但是有问题, 切换事件发生在未创建tab之前
                }
                return false;
            });
        }
    });
}

$.ajaxTab = {
    setup: function (tabs, restoreState) {
        $tabs = tabs.headerTabs ({
            tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>"
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
    openTab: function (icon, url, text, loadNow, callback) {
        var opened = $tabs.find('li[url="' + url + '"]');
        if (opened.size() == 0) {
            var index = $tabs.tabs("length") ;
            if (index == 10 - 1) alert('打开的窗口太多'); else {
                $tabs.tabs("add", "#ui-tabs-" + index, text);
                //$.autoHeight({}, true);
                $tabs.tabs("select", index).find('li.ui-tabs-active').attr('url', url).attr('index', index).attr('icon', icon);
                if (loadNow) $.ajaxTab.tabCheckLoad(index);
                if (callback) callback($tabs.children('.ui-tabs-panel'));
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
        var state = { OpenTabs: [], OpenNodes: [], LastIndex: activeTabIndex != undefined ? activeTabIndex : $('#tabs>ul>li.ui-state-active').attr('index') };
        $tabs.find('ul>li').each(function () {
            if ($(this).attr('url')) //因为有时候会null， 待查 
                state.OpenTabs.push({ Url: $(this).attr('url'), Text: $(this).children('a').text(), MetaType: $(this).attr('metatype') });
        });
        //var li = $('#browser li.collapsable').each(function () {
        //    if ($(this).attr('_id') || $(this).attr('metaType')) state.OpenNodes.push($(this).attr('metaType') + "." + $(this).attr('_id') );
        //});  
        return JSON.stringify(state);
    }
};

/**********   树    **************/
$.fitui.tmpl_tree_li = function () {$.template('tmpl_tree_li', '<li><span><a></a></span><ul></ul></li>');}
$.fitui.tmpl_tree_li();
$.fitui.render_li = function (parent, data, href) {
    for (var i in data) {
        var li = $.tmpl('tmpl_tree_li').appendTo(parent).find('a').text(data[i].text).end();
        var url = '';
        for (var j in data[i])
            if ((j != "text") && (j != "children")) url = url + j + '=' + data[i][j] + '&'; //li.attr(j, data[i][j]);
        li.attr('data', url);
        if (href) li.find('a').attr('href', href + "?" + url);

        if (data[i].children) {
            $.fitui.render_li(li.children('ul'), data[i].children, href);
        }
        else $('<li fake=1>').appendTo(li.children('ul'));

        li.children('span').addClass('folder').addClass(data[i]['type']);
    }
}

$.fn.ajaxtree = function (option) {
    return this.each(function () {
        if (!option) option = {};
        option.collapsed = true;

        //treeview 插件自带文件夹的图标
        var tree = $(this).addClass('filetree'); 
        option.toggle = function (data, ui) {
            var li = $(ui).parent();
            var ul = li.children('ul');
            if (ul.children('li[fake]').size() > 0) {
                var newli = ul.children('li.newNode');
                var url = option.url + "?" + li.attr('data');
                ul.indicator({ insert: true })
                $.get(url, function (data) {
                    ul.children('li[fake]').remove();
                    $.fitui.render_li(ul, data, option.href);
                    ul.indicator({ remove: true });
                    if (ul.children().size() > 0) {
                        ul.ajaxtree(option);
                        ul.append(newli);
                    }
                    else if (newli.size() == 1) {
                        ul.append(newli);
                    }
                    else { ul.remove(); li.children('span').removeClass('folder').addClass('leaf'); }
                });

            }
           // $.lastState.save();
        };
        $(this).treeview(option);
    });
}   


/**********            导航        **************/
$.fitui.navigation = {
    createPathNav: function (nav, path, text, home) {
        var ul = $(nav).children('ul');
        var parent = ul;
        if ($(parent).find('[path="' + path + '"]').size() == 0) {
            $(parent).find('li.last').removeClass('last');
            var li = $('<a href=#>').text(text).addClass('changePath').wrap('<li>').parent().addClass('last')
                .appendTo(parent).attr('path', path);
            if (home) li.addClass('home');
            li.children('a').click(function () {
                var li = $(this).closest('li');
                if (li.hasClass('last')) return false;
                var path = li.attr('path');
                //$.fitui.resetParent(designer, $(this).closest('ul'));
                while (li.next().size() > 0) li.next().remove();
                li.addClass('last');

                $(nav).trigger('change', [path]);
                return false;
            });
        }
    }
}

$.fn.navigation = function (option) {
    return this.each(function () {
        if (option.createPath) {
            $.fitui.navigation.createPathNav(this, option.path, option.text, option.home);
        }
        else {
            $(this).addClass('metaPath').append('<ul>');
            $(this).navigation({ createPath: true, path: option.homePath, text: '', home: true });
            $(this).bind('change', function (ui, path) {
                if (option.change) option.change(path);
            });
        }
    });
}   