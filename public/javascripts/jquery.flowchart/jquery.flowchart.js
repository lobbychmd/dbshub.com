﻿

$.fn.flowchart_node = function (option, chart) {
    return this.each(function () {
        $(this).click(function () {
            $(this).closest('.flowchart').find('.flowNode').removeClass('sel');
            $(this).addClass('sel');
            $(chart).thumbnail({ thumb: true });

        })
            .draggable(
                { handle: option ? option.handle : null,
                    stop: function (event, ui) {

                        //$(this).flowchart_linkTo(canvas);
                        $(chart).flowchart({ redraw: true });
                        $(chart).thumbnail({ thumb: true });
                    }
                    //连线控制
                }).find('.linePoint').click(function () {
                    //第一次点，开始连线
                    if (!$(this).closest('.flowchart').hasClass('lineStart')) {
                        $(this).addClass('lineStart').closest('.flowNode').addClass('lineStart').closest('.flowchart').addClass('lineStart');
                    }
                    return false;
                }).end().find('.nodeLayer').click(function () {
                    $(this).closest('.flowNode').find('.nodeLayer').removeClass('sel');
                    $(this).addClass('sel');
                    //自己点自己，取消
                    var linePoint = $(this).find('.linePoint');
                    if (linePoint.hasClass('lineStart')) {
                        linePoint.removeClass('lineStart').closest('.flowNode').removeClass('lineStart').closest('.flowchart').removeClass('lineStart');
                    } else {
                        var start = $(chart).find('.linePoint.lineStart').closest('.nodeLayer');
                        if (start.size() == 0) { }
                        else if (start.closest('.flowNode').attr('nodeId') == $(this).closest('.flowNode').attr('nodeId')) {
                            //自己连自己兄弟，啥也不干
                        } else {
                            var end = $(this);
                            var linkTos = start.attr('linkTo') ? start.attr('linkTo').split(' ') : [];
                            var linkTos1 = end.attr('linkTo') ? end.attr('linkTo').split(' ') : [];
                            var s = $(this).closest('.flowNode').attr('nodeId') + '.' + $(this).attr('nodeLayerId');
                            var s1 = start.closest('.flowNode').attr('nodeId') + '.' + start.attr('nodeLayerId');

                            if ($.inArray(s, linkTos) >= 0) {
                                alert('删除');
                                delete linkTos[$.inArray(s, linkTos)];
                                start.attr('linkTo', linkTos.join(' '))
                            }
                            else if ($.inArray(s1, linkTos1) >= 0) {
                                alert('删除');
                                delete linkTos1[$.inArray(s1, linkTos1)];
                                end.attr('linkTo', linkTos1.join(' '));
                            } else {
                                linkTos.push(s);
                                start.attr('linkTo', linkTos.join(' '))
                            }
                            start.attr('linkTo', linkTos.join(' '))
                            start.find('.linePoint.lineStart').removeClass('lineStart').closest('.flowNode').removeClass('lineStart').closest('.flowchart').removeClass('lineStart');
                            $(chart).flowchart({ redraw: true });
                        }
                    }

                });
    });
}

$.fn.flowchart = function (option) {
    return this.each(function () {
        if (option && option.redraw) {  //重画缩略
            $(this).trigger('redraw', []);
        }
        else if (option && option.add) {  //重画缩略
            $(this).find('#' + option.add).flowchart_node(option.add, this);
        }
        else {
            //创建一个容器用来包装

            var canvas = new flowchart().createCanvas(this);
            var chart = this;
            $(this).addClass('flowchart').bind('redraw', function () {
                canvas.width = canvas.width;
                $(this).find('.flowNode').each(function () {
                    $(this).flowchart_linkTo(canvas);
                })
            }).flowchart({ redraw: true })
            //初始化连线
            .find('.flowNode').flowchart_node(option, chart)
        }
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
                if (linkTos[i]) {
                    var linkTosi = linkTos[i].split('.');
                    var targetNode = $('[nodeId=' + linkTosi[0] + ']');
                    if (targetNode.size() > 0) {
                        var targetNodeLayer = linkTosi.length > 1 ? targetNode.find('[nodeLayerId=' + linkTosi[1] + ']') : null;

                        var p1 = $(node).position();
                        var p2 = targetNode.position();
                        var p3 = targetNodeLayer? targetNodeLayer.position() :null;
                        new flowchart(canvas).drawNodeLink(
                            p1.left, p1.left + $(node).width(),
                            p1.top + ($(this).hasClass('flowNode') ? $(node).height()/2: $(this).position().top + $(this).height() /2),
                            p2.left, p2.left + targetNode.width(), 
                            p2.top + (p3? p3.top +  targetNodeLayer.height()/2: targetNode.height()/2) 
                        );
                    }
                }
            }
        });
    });
}


$.fn.flowchart_demo = function (option) {
    return this.each(function () {
        //产生的节点数量
        if (!option || option.createNode) {
            var count = Math.random() * 8 + 2;
            for (var i = 0; i <= count; i++) {
                var w = Math.random() * 100 + 50;
                var h = Math.random() * 200 + 100;
                var node = $("<div>").addClass('jfDemo').css('position', 'absolute')
                .css('width', w)
                .css('height', h)
                .css('left', Math.random() * ($(this).width() - w))
                .css('top', Math.random() * ($(this).height() - h))
                .css('z-index', i)
            .appendTo(this).addClass('flowNode').attr('id', 'flowNode' + i.toString()).attr('nodeId', 'flowNode' + i.toString());

                for (var j = 0; j <= h / 20; j++) {
                    var layer = $('<div>').attr('nodeLayerId', 'flowNodeLayer' + j).addClass('nodeLayer').appendTo(node)
                    .text('nodeLayer' + j);
                    $("<span>").appendTo(layer).addClass("linePoint");
                }
                node.css('height', '').css('width', '');
            }
        }

        if (!option || option.createLine) {
            //随机生成连线
            var count = $(this).find('.flowNode').size();
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
                            var l = Math.round(Math.random() * count);
                            var src = $(this).find('.flowNode').eq(a).find('.nodeLayer:nth-child(' + l + ')');
                            if (src.size() == 0) 
                                src = $(this).find('.flowNode').eq(a);
                            src.attr('linkTo', src.attr('linkTo') ? src.attr('linkTo') + " " : $(this).find('.flowNode').eq(b).attr('nodeId'));
                            
                            list.push({ src: a, dest: b });
                            break;
                        }
                    }
                } while (true);
            }
        }
    });
}