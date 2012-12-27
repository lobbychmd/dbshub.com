
$.uicontrols.lfLayout = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.uicontrols.lfUserBar = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.uicontrols.lfLayout_menu = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.uicontrols.lfLayout_page = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        return uiparams;
    }
};

$.uicontrols.lfLayout_foot = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.uicontrols.lfLayout_head = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.uicontrols.AccordionMenu = {
    menutree: function (modules, parent) {
        for (var i in modules) {
            if ((modules[i].ParentID == parent.module.ModuleID)
                || ((!modules[i].ParentID) && (!parent.module.ModuleID))
                ) {
                var mi = { module: modules[i], children: [] };
                parent.children.push(mi);
                mi.parent = parent;
                $.uicontrols.AccordionMenu.setIcon(mi);
                if (window.location.toString().indexOf(mi.module._id) > 0) {
                    mi.sel = true;
                    var p = parent;
                    while (p.parent && p.parent.module.ModuleID) {
                        p = p.parent;
                    }
                    p.sel = true;
                }
                $.uicontrols.AccordionMenu.menutree(modules, mi);
            }
        }
    },
    setIcon: function (h) {
        var icons = ["分类", "商品", "码", "客户", "供应商", "车", "盘点", "管理", "维护", "报表", "查询"];
        for (var j in icons)
            if (h.module.Caption.indexOf(icons[j]) >= 0) {
                h.icon = icons[j];
                break;
            }
    },
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.menu = { module: { ModuleID: null }, children: [] };
        $.uicontrols.AccordionMenu.menutree(pageInfo.modules, uiparams.menu);
        for (var i in uiparams.menu.children) {
            if (uiparams.menu.children[i].sel) {
                uiparams.sel = i;
            }
        }
        return uiparams;
    }
};


$.fn.AccordionMenu = function () {
    return this.each(function () {
        var sel = $(this).attr('sel');
        $(this).Accordion({ active: sel ? parseInt(sel) : 0 }).find('.ui-accordion-content').css('height', '').children('ul').treeview();

        var site = "/emulator/preview";
        $('.AccordionMenu a[module]').each(function () {
            $(this).attr('href', site + "?_id=" + $(this).attr('module') + "&page=" + $(this).attr('page') + "&layout=1");
        });
    });
}


$.fn.lfLayout_page = function () {
    return this.each(function () {
        
    });
};
$.fn.lfLayout_head = function () {
    return this.each(function () {
        
    });
};

$.fn.lfLayout_foot = function () {
    return this.each(function () {
        
    });
};

$.fn.lfLayout_menu = function () {
    return this.each(function () {
        
    });
};

$.fn.lfUserBar = function () {
    return this.each(function () {
        
    });
};

//菜单宽度拉伸函数
//obj 绑定对象
//border 参数：T B R 上下右  上下有点问题
function xyResize(obj, border) {
    var x = y = 0, ow, oh, nw, nh;
    var op = np = { left: 0, top: 0 };

    $(obj).mousedown(function (e) {
        x = e.pageX;
        y = e.pageY;
        ow = obj.width();
        oh = obj.height();
        op = obj.position();
        //清除选择 防止FF内第二次拖动时是选择状态
        if ($.browser.mozilla || $.browser.safari || ($.browser.msie && $.browser.version >= 9))
            window.getSelection().removeAllRanges();
        //绑定事件
        if (border == "R")
            $(document).bind("mousemove", mouseMoveR).bind("mouseup", mouseUpR);
        if (border == "B")
            $(document).bind("mousemove", mouseMoveB).bind("mouseup", mouseUpB);
        if (border == "T")
            $(document).bind("mousemove", mouseMoveT).bind("mouseup", mouseUpT);
    });


    //向上拉伸
    function mouseMoveT(e) {
        np.top = op.top + (e.pageY - y);
        nh = oh - (e.pageY - y);
        if (nh <= 5) nh = 5;
        obj.height(nh);
        obj.position(np);
        $(window).resize();
    }
    function mouseUpT() {
        //卸载事件
        $(document).unbind("mousemove", mouseMoveT).unbind("mouseup", mouseUpT);
        $(window).resize();  //向上有点问题  这里重置一下
    }

    //向下拉伸
    function mouseMoveB(e) {
        nh = oh + (e.pageY - y)
        if (nh <= 5) nh = 5;
        obj.height(nh);
        $(window).resize();
    }
    function mouseUpB(border) {
        //卸载事件
        $(document).unbind("mousemove", mouseMoveB).unbind("mouseup", mouseUpB);
    }

    //向右拉伸
    function mouseMoveR(e) {
        nw = ow + (e.pageX - x)
        if (nw <= 95) nw = 95;
        if (nw >= 500) nw = 500;
        obj.width(nw);
        $(window).resize();
    }
    function mouseUpR() {
        //卸载事件
        $(document).unbind("mousemove", mouseMoveR).unbind("mouseup", mouseUpR);
    }


    //去除对象子元素事件继承
    obj.children().mousedown(function (e) {
        return false;
    });

}





//修改密码弹出框
function ChangePwd() {
    var ww = $(window).width();
    var wh = $(window).height();
    var ow = $("#changepwd").width();
    var oh = $("#changepwd").height();

    var oTop = $(window).height() / 2 - $("#changepwd").height() / 2;
    var oLeft = $(window).width() / 2 - $("#changepwd").width() / 2;
    $("#changepwd").show();
    $("#changepwd").offset({ top: oTop, left: oLeft });

    //添加遮罩  页面不可用
    $("body").append("<div id='showbox_cover'></div>");
    $("#showbox_cover").show();
}


function msgMove(e) {
    var sp = { x: 0, y: 0 };
    var ep = { x: 0, y: 0 };
    sp.x = e.pageX;
    sp.y = e.pageY;
    var pObj = $(this).parent(".showbox");
    var op = pObj.position();

    //清除选择 防止FF内第二次拖动时是选择状态
    if ($.browser.mozilla || $.browser.safari || ($.browser.msie && $.browser.version >= 9))
        window.getSelection().removeAllRanges();

    $(document).bind('mousemove', msgMouseMove).bind('mouseup', msgMouseUp);

    function msgMouseMove(e) {
        ep.x = e.pageX;
        ep.y = e.pageY;
        var nt = op.top + (ep.y - sp.y);
        var nl = op.left + (ep.x - sp.x);
        //控制边界
        var maxTop = $(window).height() - pObj.height();
        var maxLeft = $(window).width() - pObj.width();
        if (nt <= 0) nt = 0;
        if (nl <= 0) nl = 0;
        if (nt >= maxTop) nt = maxTop;
        if (nl >= maxLeft) nl = maxLeft;

        pObj.offset({ top: nt, left: nl });
    }
    function msgMouseUp() {
        $(document).unbind('mousemove').unbind('mouseup');
    }
}





$.fn.lfLayout = function () {
    return this.each(function () {
            var lfLayout = $(".lfLayout");
    var head = lfLayout.find(".lfLayout_head");
    var menu = lfLayout.find(".lfLayout_menu");
    var menublock = menu.find(".menu_block");
    var menubody = menublock.find(".menu_body");
    var page = lfLayout.find(".lfLayout_page");
    var pagebody = page.find(".page_body");
    var foot = lfLayout.find(".lfLayout_foot");
    var hidebtn = menublock.find(".menu_head .hide");
    //增加隐藏菜单时左边显示的bar
    menu.after('<div class="menu_hidebar"><div class="show"></div></div>');
    var menuhidebar = lfLayout.find(".menu_hidebar");

    var winWidth = 0;   //浏览器窗口可视宽度
    var winHeight = 0;   //浏览器窗口可视高度
    var headHeight = 0;  //框架抬头高度
    var headWidth = 0;   //框架抬头宽度
    var menuWidth = 0;   //框架菜单宽度
    var menuHeight = 0;   //框架菜单高度
    var pageWidth = 0;    //框架主页面宽度
    var pageHeight = 0;   //框架主页面高度
    var footHeight = 0;   //框架底部高度
    var footTop = 0; //框架底部位置

    //初始化		
    $(window).resize(function () {

        winWidth = $(window).width();
        winHeight = $(window).height();
        headWidth = head.width();
        headHeight = head.outerHeight();
        footHeight = foot.outerHeight();

        //计算menu的高度与位置
        menuHeight = winHeight - headHeight - footHeight;  // 浏览器高度-head高度-foot高度
        menu.height(menuHeight);
        menu.offset({ top: headHeight, left: 0 }); //  根据head的高度计算

        menublock.width(menu.width() - 2);
        menubody.height(menublock.innerHeight() - 27);
        menuhidebar.height(menuHeight);

        //计算page的高度、宽度和位置
        menuWidth = menu.width();
        pageWidth = headWidth - menuWidth;
        pageHeight = menuHeight;
        page.width(pageWidth);
        page.height(pageHeight);
        page.offset({ top: headHeight, left: menuWidth });

        pagebody.height(pageHeight - 27);

        //计算foot的位置
        footTop = headHeight + menuHeight;
        foot.offset({ top: footTop, left: 0 });


    });

    $(window).resize();  //初始化
    xyResize(menu, "R");

    //菜单隐藏事件
    var mw = 0;
    hidebtn.click(function () {
        mw = menu.width();
        menu.width(25);
        $(window).resize();
        menuhidebar.show();
        menuhidebar.height(menu.height());
        menuhidebar.offset({ top: head.outerHeight(), left: 0 });
    });
    //菜单显示事件
    menuhidebar.find(".show").live("click", function () {
        menu.width(mw);
        $(window).resize();
        menuhidebar.hide();
    });

    //首页嵌套流程图
    //    if( $("#flowChart").length == 1){
    //        $("#flowChart").appendTo(pagebody);
    //    }

    //位置切换事件
    $("#where").change(function () {
        var v = $(this).children('[selected]');
        $(this).smartLoad({ show: true, url: "/home/savePref/where", post: true, data: { value: v.val() }, callback: function (data) {
            alert("您即将切换到" + v.text());
            window.location = window.location.toString();
        }
        });
    });

    //密码修改按钮
    $('#submit').PageButton();

    //弹出框使用事件
    $(".showbox").find(".showbox_head").bind('mousedown', msgMove);
    $(".showbox").find(".closed").click(function () {
        $("#showbox_cover").remove();
        $(".showbox:visible").hide();
    });

    });
};



