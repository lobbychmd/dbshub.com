
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
        
    });


};