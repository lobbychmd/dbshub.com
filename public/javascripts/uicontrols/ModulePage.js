
$.uicontrols.ModulePage = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.ModulePage = {
    config: {
        lookups: function () {
            var d = $("#lookupConfig").text();
            return d ? $.parseJSON(d) : {};
        },
        readonly_fields: function () {
            var d = $(".flowconfig_readonly").val();
            return d ? $.parseJSON(d) : {};
        },
        table_edittypes: function () {
            var d = $(".flowconfig_edittype").val();
            return d ? $.parseJSON(d) : {};
        }
    }
}

$.fn.ModulePage = function () {
    return this.each(function () {
        //console.log($.ModulePage.config.lookups());
        $(this).find(".DateEditor").DateEditor();
        //debug();
    });
}
$.ModulePage = {
    config: {
        lookups: function () {
            var d = $("#lookupConfig").text();
            return d ? $.parseJSON(d) : {};
        },
        readonly_fields: function () {
            var d = $(".flowconfig_readonly").val();
            return d ? $.parseJSON(d) : {};
        },
        table_edittypes: function () {
            var d = $(".flowconfig_edittype").val();
            return d ? $.parseJSON(d) : {};
        }
    }
}

$.fn.ModulePage = function () {
    return this.each(function () {
        //console.log($.ModulePage.config.lookups());
        $(this).find(".DateEditor").DateEditor();
        //debug();
    });
}

$.fn.Editor = function () {
    return this.each(function () {
        //console.log($.ModulePage.config.lookups());
    });
}


$.fn.AjaxPanel = function () {
    return this.each(function () {
        var panel = $(this);
        $(this).closest('.ModulePage').find('a').filter(function () {
            return $(this).attr('href') && $(this).attr('href') != "#";
        }).click(function () {
            $.moduleLink($(this).attr('href'));
            //panel.smartLoad({ url: $(this).attr('href') + "&layout=0", load: true });

            //易紫然的控件bug
            setTimeout(function () {
                $(".lfTabs_pages").css("clear", "none").find('.page.actived').css("height", "");
            }, 1000);
            return false;
        });
    });
}


$.fn.AlignPanel = function () {
    return this.each(function () {
        
    });
}


