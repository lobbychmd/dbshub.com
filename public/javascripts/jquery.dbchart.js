$.fn.dbchart = function () {
    return this.each(function () {
        
    });
}

//工作原理，在 jquery.flowchart.js 的 flowchart_demo 基础上进行
//把 flowchart_demo 随机产生的数据变成 json ， 再利用jqtpl 模板重新生成html

$.fn.dbchart_demo = function () {
    return this.each(function () {
        var flowchart = this;
        var count = Math.random() * 8 + 2;
        
        $.get('/flowchart/demo', function (data) {
            var nodes = $('#tpTable').tmpl(data).appendTo(flowchart);
            nodes.each(function() {
                var w = Math.random() * 100 + 50;
                var h = Math.random() * 200 + 100;
                
                $(this)
                    //.css('width', w).css('height', h)
                    .css('left', Math.random() * ($(flowchart).width() - $(this).width()))
                    .css('top', Math.random() * ($(flowchart).height() - $(this).height()))
              //  .find('.headLayer>div>.nodeLayer').appendTo(this);//jqtpl 有bug
            });
               // node.css('height', '').css('width','');    
            $(flowchart).flowchart_demo({createLine:true}).flowchart({ containerHeight: "auto", containerWidth: "auto" , handle: '.headLayer'})
            .thumbnail(); 
        });
        
    });
}