$.fn.dbchart = function () {
    return this.each(function () {
        
    });
}

//工作原理，在 jquery.flowchart.js 的 flowchart_demo 基础上进行
//把 flowchart_demo 随机产生的数据变成 json ， 再利用jqtpl 模板重新生成html

$.fn.dbchart_demo = function () {
    return this.each(function () {
        //var data = [];
        var i = 1;
        $(this).find('.flowNode').each(function () {
            var table = { TableName: 'table' + i, cols: [] };
            var j = 1;
            $(this).find('.nodeLayer').each(function () {
                table.cols.push({ ColumnName: 'field' + j, linkTo: $(this).attr('linkTo') });
                j++;
            });
            i++;
            $(this).html($('#tpTable').tmpl(table).html()).addClass('table').removeClass('jfDemo')//.flowchart();
        });
    });
}