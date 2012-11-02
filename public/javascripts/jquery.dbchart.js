$.fn.dbchart = function () {
    return this.each(function () {
        //$.dialog.init();
        //$(this).find('a.edit').click(function () {
        //    alert($(this).closest('.flowNode').html());
        //    return false;
        //});
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