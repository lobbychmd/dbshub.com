
$.uicontrols.ModulePage = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        uiparams.ActiveFlowStr = JSON.stringify(pageInfo.ActiveFlow);
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

$.Layout = function (site) {
    $('.AccordionMenu a[module]').each(function () {
        $(this).attr('href', site + "?_id=" + $(this).attr('module')+ "&page=" + $(this).attr('page'));
    });
}

$.fn.ModulePage = function () {
    return this.each(function () {
        var ActiveFlowStr = $('#ActiveFlowStr').text();
        if (ActiveFlowStr) {
            var activeFlow = eval("(" + ActiveFlowStr + ")");
            if (activeFlow && activeFlow.BlackList) {
                for (var i in activeFlow.BlackList) {
                    $('[fn=' + activeFlow.BlackList[i] + ']').setReadOnly(true);
                }
            }
        }
        $(this).find(".DateEditor").DateEditor();
        $(this).find('[module], [page]').click(function () {
            var modulepage = $(this).closest('.ModulePage').parent();
            var moduleContainer = modulepage.parent(); //$(this)ui-tabs-panel

            var page = $(this).attr('page');
            var params = $(this).attr('params');
            var div = moduleContainer.find('.ModulePage[page=' + page + ']');

            var reload = params != div.attr('params');
            if (reload) div.parent().remove();
            if (div.size() == 1 && (!reload)) {
                div.parent().show();
                modulepage.hide();
            }
            //else if (div.size() >= 1) alert(div.size());
            else {
                div = $('<div class="asf">').insertAfter(modulepage).attr('params', params);;
                div.indicator({})
                    .load('/emulator/preview?_id=' + $(this).attr('module') + '&page=' + page + "&" + params, function (data) {
                        modulepage.hide();
                    });
            }
            return false;
        });
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
    },
    
    openPage: function(moduleId, pageId, params){
        
    }
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



$.fn.PageButton = function () {
    return this.each(function () {
        $(this).button().click(function () {
            if ($(this).attr('biz')) {
                $.post('/emulator/biz/' + $(this).attr('biz'), $(this).closest('form').serializeArray(), function (data) {
                    if (data.IsValid) {
                        alert(data.Message);
                        window.location = window.location;
                    }
                    else alert(data.ErrorMessage);
                });
            }
            else if ($(this).hasClass('edit')) {
                $(this).closest('form').find('input[fn]').toggleReadOnly();
            }
            
        });
    });


};