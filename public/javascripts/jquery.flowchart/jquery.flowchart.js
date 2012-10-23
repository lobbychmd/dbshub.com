$.fn.flowchart = function () {
    return this.each(function () {
        var canvas = new flowchart().createCanvas(this);
        var container = this;
        //初始化连线
        $(this).find('.flowNode').each(function () {
            $(this).flowchart_linkTo(canvas);
        }).draggable({ stop: function (event, ui) {
            canvas.width = canvas.width;
            //$(this).flowchart_linkTo(canvas);
            $(container).find('.flowNode').each(function () {
                $(this  ).flowchart_linkTo(canvas);
            })
        }
        });
    });
}

//画至所有其它节点的连线
//支持2种模式 1） 从节点顶部位置连线
//           2） 从节点内部的层位置连线
$.fn.flowchart_linkTo = function (canvas) {
    return this.each(function () {
        var layers = $(this).find('.nodeLayer[linkTo]');
        var _linkTos = $(this).attr('linkTo');
        if (_linkTos) layers = layers.add(this);

        var node = this;
        layers.each(function () {
            var linkTos = $(this).attr('linkTo');
            linkTos = linkTos.split(' ');
            for (var i in linkTos) {
                if (linkTos[i] && $('#' + linkTos[i]).size() > 0) {
                    var p1 = $(node).position();
                    var p2 = $('#' + linkTos[i]).position();
                    new flowchart(canvas).drawNodeLink(
                        p1.left, p1.left + $(node).width(), 
                        ($(this).hasClass('node')? p1.top : p1.top + $(this).position().top) + 20,
                        p2.left, p2.left + $('#' + linkTos[i]).width(), p2.top + 20
                    );
                }
            }
        });
    });
}

$.fn.flowchart_demo = function () {
    return this.each(function () {
        //产生的节点数量
        var count = Math.random() * 10 + 2;
        for (var i = 0; i <= count; i++) {
            var w = Math.random() * 100 + 50;
            var h = Math.random() * 200 + 100;
            var node = $("<div>").addClass('jfDemo').css('position', 'absolute')
                .css('width', w)
                .css('height', h)
                .css('left', Math.random() * ($(this).width() - w))
                .css('top', Math.random() * ($(this).height() - h))
                .css('z-index', i)
            .appendTo(this).addClass('flowNode').attr('id', 'flowNode' + i.toString());

            for (var j = 0; j <= h / 20; j++) {
                $('<div>').addClass('nodeLayer').appendTo(node).css('width', 'auto').css('height', '18px').css('border', '1px solid blue');
            }
        }

        //随机生成连线
        var list = [];
        //连线的数量是节点的数量 -1
        for (var i = 0; i < count; i++) {
            do {
                //随机挑选2个节点
                var a = Math.round(Math.random() * count);
                var b = Math.round(Math.random() * count);
                if (a == b) continue; //不能自己连自己
                else {
                    var found = false;
                    for (var j in list) {
                        //检查是否重复
                        if (((list[j].src == a) && (list[j].dest == b)) ||
                            ((list[j].src == b) && (list[j].dest == a))) {
                            found = true;
                            break;
                        }
                    }
                    if (found) continue; //发现重复即继续产生
                    else {
                        var l = Math.round(Math.random() * 10);
                        var src = $('#flowNode' + a).find('.nodeLayer:nth-child(' + l + ')');
                        if (src.size() == 0) src = $('#flowNode' + a);

                        src.attr('linkTo', src.attr('linkTo') ?src.attr('linkTo') + " " : "" + 'flowNode' + b);
                        list.push({ src: a, dest: b });
                        break;
                    }
                }
            } while (true);
        }

    });
}