
$.uicontrols.QueryGrid = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        uiparams.data = { columns: table.Columns, rows: [] };
        if (uiparams.href) uiparams.data.columns.splice(0, 0, { fieldName: '选择' })
        for (var i in table.Rows) {
            var row = [];
            //var href = uiparams.href + "?";
            var href = window.location.toString(); href = href.substring(0, href.length - 1) + "1&";
            for (var j in table.Columns) {
                row.push({ key: table.Columns[j].fieldName, value: table.Rows[i][table.Columns[j].fieldName] });
                href += table.Columns[j].fieldName + "=" + table.Rows[i][table.Columns[j].fieldName] + "&";
            }
            if (uiparams.href) row.splice(0, 0, { key: '选择', value: href })
            uiparams.data.rows.push(row);

        }
        //console.log(uiparams);
        return uiparams;
    }
};

$.fn.QueryGrid = function () {
    return this.each(function () {
         
    });


};