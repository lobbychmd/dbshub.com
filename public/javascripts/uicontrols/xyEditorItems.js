
$.uicontrols.xyEditorItems = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        
        uiparams.data = { columns: table.Columns, rows: [] };
        for (var i in table.Rows) {
            var row = [];
            for (var j in table.Columns) row.push({ key: table.Columns[j].fieldName, value: table.Rows[i][table.Columns[j].fieldName] });
            uiparams.data.rows.push(row);
        }
        //console.log(uiparams.data);
        return uiparams;
    }
};

$.fn.xyEditorItems = function () {
    return this.each(function () {
        
    });


};