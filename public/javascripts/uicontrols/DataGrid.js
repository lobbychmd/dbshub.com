
$.uicontrols.xyGrid = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.fn.xyGrid = function () {
    return this.each(function () {
        
    });


};


$.uicontrols.xyGridTable = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        uiparams.data = { columns: table.Columns, rows: [] };

        for (var i in table.Rows) {
            var row = [];
            //var href = uiparams.href + "?";
            var href = window.location.toString(); href = href.substring(0, href.length - 1) + "1&";
            for (var j in table.Columns) {
                row.push({ key: table.Columns[j].fieldName, value: table.Rows[i][table.Columns[j].fieldName] });
            }
            uiparams.data.rows.push(row);

        }
        return uiparams;
    }
};

$.fn.xyGridTable = function () {
    return this.each(function () {
        return;
        var g = $(this);

        $(this).find('tbody tr:nth-child(even)').addClass('striped');
        $(this).find('tfoot>tr>td').attr('colspan', $(this).find('thead>tr>td').size());

        $(this).find('tbody tr').click(function () {
            $(this).closest('table').children('tbody').children('tr').removeClass('selected');
            $(this).addClass('selected');
        });

        var head = $('<table class="xyGridTable ui-widget ui-widget-content">').css({ 'position': 'absolute', 'visibility': 'hidden', 'display': 'block' }).appendTo(body);
        $(this).find('thead, caption').appendTo(head);
        var bd = $('tbody').appendTo(head);
        $(this).find('tbody tr:first').appendTo(bd);

        var width = [];
        head.find('thead th').each(function () {
            var hw = $(this).width() + 1;
            if (hw < 25) hw = 25;
            $(this).width(hw)  //考虑 border
            width.push(hw);
        });
        var w = head.width();

        var i = 1;
        head.find('thead th').each(function () {
            var td = g.find('tbody>tr:first>td:nth-child(' + i + ')');
            td.width(width[i - 1]);
            i++;
        });
        var foot = $('<table class="xyGridTable ui-widget ui-widget-content">').insertAfter(this);
        $(this).find('tfoot').appendTo(foot);

        $(this).wrap('<div class="DataGridWrap">').parent().height('150px').width(w + 18); //滚动条宽度
        var thl = head.find('th:last');
        thl.width(thl.width() + 18);
        foot.find('td').width(w + 18 - 20) //去掉 padding
            .text('共 ' + g.children('tbody').children('tr').size() + ' 行');
    });


};