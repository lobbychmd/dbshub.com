//混合型流程图
//主要功能是画线，因为节点元素是用 dom 构造

var flowchart = function (canvas) {
    this.cxt = getContext('2d');
}

flowchart.prototype = {
    constructor: flowchart,
    createCanvas: function (div) {
        var w = $(div).width();
        var h = $(div).height();
        var canvasId = 'canvas' + Math.random().toString().substring(2);
        var cv = $('<canvas>').insertAfter(this).css('border', '1px solid red')
            .attr('id', canvasId).attr('width', w).attr('height', h)
            .css('position', 'relative').css('margin-top', '-' + h + 'px')
            .css('z-index', '-1');
        $(div).css('position', 'relative').attr('canvasId', canvasId);
        return cv;
    },

    drawNodeLink: function (srcL, srcR, srcTop, destL, destR, destTop) {
        var cxt = this.cxt;
        if (destL > srcR) {
            var x1 = srcR; var x2 = destL;
        }
        else if (destR < srcL) { 
            var x1 = srcL; var x2 = destT;
        }
        else if ((destR + destL) / 2 > (SrcR + destL) / 2) { 
            var x1 = srcL; var x2 = destL;
        }
        else   { 
            var x1 = srcR; var x2 = destR;
        }
        cxt.beginPath();
        //绘制3次贝塞尔曲线  
        cxt.strokeStyle = "rgba(200,0,0,1)";
        cxt.beginPath();
        cxt.moveTo(x1, srcTop);
        cxt.bezierCurveTo(60, 80, 150, 30, 170, 150);
        cxt.stroke();

    }

}