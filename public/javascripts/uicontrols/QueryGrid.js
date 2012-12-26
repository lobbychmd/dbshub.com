
$.uicontrols.QueryGrid = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        uiparams.data = { columns: table.Columns, rows: [] };

        for (var i in table.Rows) {
            var row = [];
            //var href = '/emulator/preview?_id=' + uiparams.pageInfo.ModuleId + '&page=1&';
            var href = "";
            for (var j in table.Columns) {
                row.push({ key: table.Columns[j].fieldName, value: table.Rows[i][table.Columns[j].fieldName] });
                href += table.Columns[j].fieldName + "=" + table.Rows[i][table.Columns[j].fieldName] + "&";
            }
            if (uiparams.href) row.splice(0, 0, { key: '选择', value: href })
            uiparams.data.rows.push(row);

        }
        if (uiparams.href) uiparams.data.columns.splice(0, 0, { fieldName: '选择' })
        //console.log(uiparams);
        return uiparams;
    }
};

$.fn.QueryGrid = function () {
    return this.each(function () {
         
    });


};