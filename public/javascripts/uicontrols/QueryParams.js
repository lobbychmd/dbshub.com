
$.uicontrols.QueryParams = {
    params2tmpl: function (uiparams, pageInfo) {
        if (!uiparams.name) uiparams.name = "queryparams1";
        //console.log(uiparams.mq);
        uiparams.groups = [{ caption: "查询条件", queryParams: []}];
        for (var i in pageInfo.metaQueries[uiparams.mq].Params) {
            var p = pageInfo.metaQueries[uiparams.mq].Params[i];
            if (!p.metaField) p.metaField = { DisplayLabel: p.ParamName };
            else if (p.metaField.EditorType ) p.metaField.EditorType = p.metaField.EditorType.toUpperCase() ;
            uiparams.groups[0].queryParams.push(p);
        }
        return uiparams;
    }
};

$.fn.QueryParams = function () {
    return this.each(function () {
        $(this).children().accordion();
        var g = $(this).find('input[name=ParamGroup]');
        var gi = $(this).find('input[name=pgi]');
        $(this).children().accordion({ active: gi.val() ? parseInt(gi.val()) : 0, change: function (event, ui) {
            gi.val(ui.options.active);
            g.val($.trim(ui.newHeader.text()));
        }
        }).find('.ui-accordion-content').css('height', 'auto');

        var sqp = $(this).hide();

        var grid = $(this).closest('.ModulePage').find('#' + $(this).attr('grid')).TableAutoWidth().parent();

        var summary = sqp.attr('paramAsString');
        if (!grid.attr('sqp')) {
            var title = $('<span class="caption"><a href="#">查询条件:</a>' + ((summary) ? summary : "无") + '</span>').insertBefore(grid.children().eq(0));
            title.find('a').attr('sqp', sqp.attr('id')).click(function () {
                var sqp = $(this).closest('.ModulePage').find('#' + $(this).attr('sqp')).toggle();
                grid.toggleClass('right');
                if (grid.hasClass('right')) grid.css('margin-left', sqp.width() + 25);
                else grid.css('margin-left', 0);
                return false;
            });
            grid.attr('sqp', sqp.attr('id'));
        }

        $('<div style="clear:both"></div>').insertAfter(grid);

        //隐藏和显示
        var sp = this;
        sqp.find('.ui-icon-triangle-1-s').click(function () {
            $(this).closest('.QueryParams').toggle();
            grid.toggleClass('right');
            if (grid.hasClass('right')) grid.css('margin-left', sqp.width() + 25);
            else grid.css('margin-left', 0);
            return false;
        });

        //指定查询按钮
        var button = $(this).attr('button');
        if (button) $('#' + button).removeAttr('href').click(function () {
            if ($(sp).find('form').ValidateFormat()) {
                $(this).indicator({ hide: true });
                $(sp).find('form').submit();
            }
        });

        $(this).SmartLookup($.ModulePage.config.lookups);
    });


};