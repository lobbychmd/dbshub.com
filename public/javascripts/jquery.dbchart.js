$.fn.dbchart = function () {
    return this.each(function () {
        $('a.addIndex').live('click', function () {
            var table = $(this).closest('.tb-design');
            $('#tpIndex').tmpl({}).insertBefore($(this).closest('th')).addClass('index');
            $('#tpIndexColumn').tmpl({}).insertAfter(table.find('tbody td:last-child'));
            return false;
        });
        $('a.index').live('click', function () {
            var th = $(this).closest('th');
            var table = $(this).closest('.tb-design');
            var indexType = th.attr('indexType');
            if (!indexType) indexType = 'I';
            if (indexType == 'I') indexType = 'U';
            else if (indexType == 'U') {
                if (table.find('th[indexType=P]').size() > 0) indexType = 'I';
                else indexType = 'P';
            }
            else indexType = 'I';
            th.attr('indexType', indexType);
            return false;
        });
        $('td.index').live('click', function () {
            var idx = $(this).children('span');
            var table = $(this).closest('.tb-design');
            if (idx.size() == 0) {
                var max = table.find('tbody td.index:nth-child(' + (this.cellIndex + 1) + ') span').size() + 1;
                $('<span>').text(max).appendTo(this);
            }
            else {
                table.find('tbody td.index:nth-child(' + (this.cellIndex + 1) + ') span').each(function () {
                    if (parseInt($(this).text()) > parseInt(idx.text())) $(this).text(parseInt($(this).text()) - 1);
                });
                idx.remove();
            }
        });
        $('a.delIndex').live('click', function () {
            var idx = $(this).closest('th')[0].cellIndex;
            var table = $(this).closest('.tb-design');
            if (confirm('要删除索引吗?')) {
                table.find('thead th.index:nth-child(' + (idx + 1) + ')').remove();
                table.find('tbody td.index:nth-child(' + (idx + 1) + ')').remove();
            }
        });
        $('a.rename').live('click', function () {
            var th = $(this).closest('th');
            if (th.hasClass('editing')) th.removeClass('editing');
            else th.addClass('editing').find('input').focus();
        });
        $('input').live('blur', function () {
            var th = $(this).closest('th');
            th.removeClass('editing');
        });
    });
}

$.fn.dbchart_demo = function () {
    return this.each(function () {
        var flowchart = this;
        var count = Math.random() * 8 + 2;

        $.get('/data/tables', function (data) {
            var nodes = $('#tpTable').tmpl(data).appendTo(flowchart);
            nodes.each(function () {
                var w = Math.random() * 100 + 50;
                var h = Math.random() * 200 + 100;

                $(this)
                //.css('width', w).css('height', h)
                    .css('left', Math.random() * ($(flowchart).width() - $(this).width()))
                    .css('top', Math.random() * ($(flowchart).height() - $(this).height()))
                //  .find('.headLayer>div>.nodeLayer').appendTo(this);//jqtpl 有bug
            });
            // node.css('height', '').css('width','');    
            $(flowchart).flowchart_demo({ createLine: true }).flowchart({ containerHeight: "auto", containerWidth: "auto", handle: '.headLayer' })
            .thumbnail().dbchart();
        });

    });
}