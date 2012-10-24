$.fn.flowchart = function (option) {
    return this.each(function () {
        //创建一个容器用来包装
        if (option && option.containerHeight && option.containerWidth) {
            var container = $(this).wrap('<div>').parent().addClass('chartContainer');
            container.height(option.containerHeight);
            container.width(option.containerWidth);
        }
        var canvas = new flowchart().createCanvas(this);
        var chart = this;
        $(this).addClass('flowchart').bind('redraw', function () {
            $(this).find('.flowNode').each(function () {
                $(this).flowchart_linkTo(canvas);
            })
        }).trigger('redraw', [])
        //初始化连线
        .find('.flowNode').draggable(
            { stop: function (event, ui) {
                canvas.width = canvas.width;
                //$(this).flowchart_linkTo(canvas);
                $(chart).trigger('redraw', []);
                container.find('.thumbnail').trigger('thumb', []);
            }
                //连线控制
            }).find('.linePoint').click(function () {
                //第一次点，开始连线
                if (!$(this).closest('.flowchart').hasClass('lineStart')) {
                    $(this).addClass('lineStart').closest('.flowNode').addClass('lineStart').closest('.flowchart').addClass('lineStart');
                }
                return false;
            }).end().find('.nodeLayer').click(function () {
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
                        $(chart).trigger('redraw', []);
                    }
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
                            ($(this).hasClass('node') ? p1.top : p1.top + $(this).position().top) + 20,
                            p2.left, p2.left + targetNode.width(), 
                            p2.top + (p3? p3.top : 0) + 20
                        );
                    }
                }
            }
        });
    });
}

//创建缩略图
$.fn.thumbnail = function (option) {
    return this.each(function () {
        var chart = this;
        var container = $(this).parent();
        var thumbnail = $('<div>').addClass('thumbnail')
            .appendTo(container).click(function (data) {


            }).bind('thumb', function () {  //重画缩略
                var _thumbnail = this;
                var rate = $(_thumbnail).width() / $(chart).width();
                $(chart).find('.flowNode').each(function () {
                    var thumbNode = $(_thumbnail).find('[nodeId=' + $(this).attr('nodeId') + ']');
                    if (thumbNode.size() == 0)
                        thumbNode = $("<div>").addClass('thumbNode').css('position', 'absolute').attr('nodeId', $(this).attr('nodeId')).appendTo(_thumbnail);
                    thumbNode.css('width', $(this).width() * rate)
                        .css('height', $(this).height() * rate)
                        .css('left', $(this).position().left * rate)
                        .css('top', $(this).position().top * rate);
                });

            }).trigger('thumb', []);
        $('<div>').addClass('thumb')
            .appendTo(thumbnail).draggable(
            { containment: "parent", stop: function (event, ui) {
                container.scrollTop($(this).position().top * $(chart).height() / thumbnail.height());
                container.scrollLeft($(this).position().left * $(chart).width() / thumbnail.width());
            }
            });

        $(container[0].tagName == 'BODY' ? window : container).bind('resize.thumbnail', function () {
            var thumb = $(container).find('.thumbnail').find('.thumb');
            var wRate = $(chart).width() / (/*document.documentElement.clientWidth*/container.width() - $(container).offset().left);
            var hRate = $(chart).height() / (container.height() - $(container).offset().top);
            if (wRate > 1 || hRate > 1) {
                thumb.show().width(thumbnail.width() / wRate)
                    .height(thumbnail.height() / hRate);
            }
            else thumb.hide();
        }).bind('scroll.thumbnail', function () {
            var thumbnail = $(container).find('.thumbnail');
            var topScroll = parseInt(thumbnail.css('top').substring(0, thumbnail.css('top').length - 2)) - thumbnail.position().top;
            var leftScroll = parseInt(thumbnail.css('left').substring(0, thumbnail.css('left').length - 2)) - thumbnail.position().left;
            var thumb = thumbnail
                    .css('top', $(container).height() - thumbnail.height() - 30 + topScroll)
                    .css('left', $(container).width() - thumbnail.width() - 30 + leftScroll)
                .find('.thumb')
                    .css('top', topScroll * thumbnail.height() / $(chart).height())
                    .css('left', leftScroll * thumbnail.width() / $(chart).width());
        }).trigger('resize.thumbnail', []).trigger('scroll.thumbnail', []);
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
            .appendTo(this).addClass('flowNode').attr('id', 'flowNode' + i.toString()).attr('nodeId', 'flowNode' + i.toString());

            for (var j = 0; j <= h / 20; j++) {
                var layer = $('<div>').attr('nodeLayerId', 'flowNodeLayer' + j).addClass('nodeLayer').appendTo(node)
                    .css('width', 'auto').css('height', '18px').text('nodeLayer' + j);
                $("<span>").appendTo(layer).addClass("linePoint");
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

                        src.attr('linkTo', src.attr('linkTo') ? src.attr('linkTo') + " " : "" + 'flowNode' + b);
                        list.push({ src: a, dest: b });
                        break;
                    }
                }
            } while (true);
        }

    });
}