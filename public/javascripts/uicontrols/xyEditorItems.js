
$.uicontrols.xyEditorItems = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        if (!table) alert(uiparams.table);
        uiparams.data = [];
        for (var i in uiparams.items) {
            for (var j in table.Columns) 
                if (table.Columns[j].fieldName == uiparams.items[i]){
                    uiparams.data.push({ column: table.Columns[j], value: table.Rows[0][uiparams.items[i]] });
                    break;
                }
        }
        //console.log(uiparams.data);
        return uiparams;
    }
};

$.fn.xyEditorItems = function () {
    return this.each(function () {
        
    });


};


$.uicontrols.xyQuickRec = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        for (var j in table.Columns)
            if (table.Columns[j].fieldName == uiparams.KeyField) {
                uiparams.column = table.Columns[j];
                break;
            } 
        //console.log(uiparams.data);
        return uiparams;
    }
};

$.fn.xyQuickRec = function () {
    return this.each(function () {
        
    });


};