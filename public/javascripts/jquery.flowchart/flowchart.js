//混合型流程图
//主要功能是画线，因为节点元素是用 dom 构造

var flowchart = function (canvas) {
    if(canvas) this.cxt = canvas.getContext('2d');
}

flowchart.prototype = {
    constructor: flowchart,
    createCanvas: function (div) {
        var w = $(div).width();
        var h = $(div).height();
        var canvasId = 'canvas' + Math.random().toString().substring(2);
        var cv = $('<canvas>').insertAfter(this).addClass('flowchart')
            .attr('id', canvasId).attr('width', w).attr('height', h)
            .css('position', 'relative')
            .css('z-index', '-1').insertBefore(div);
        $(div).css('position', 'relative').attr('canvasId', canvasId).css('margin-top', '-' + h + 'px');
        return cv[0];
    },

    drawNodeLink: function (srcL, srcR, srcTop, destL, destR, destTop) {

        var cxt = this.cxt;
        if (destL > srcR) {
            var x1 = srcR; var x2 = destL;
            var c1x = srcR + (destL - srcR) / 2; var c2x = destL - (destL - srcR) / 2;
        }
        else if (destR < srcL) {
            var x1 = srcL; var x2 = destR;
            var c1x = srcL - (srcL - destR) / 2; var c2x = destR + (srcL - destR) / 2;
        }
        else if ((destR + destL) / 2 > (srcR + destL) / 2) {
            var x1 = srcL; var x2 = destL;
            var c1x = srcL - 20; var c2x = c1x;
        }
        else {
            var x1 = srcR; var x2 = destR;
            var c1x = srcR + 20; var c2x = c1x;
        }
        cxt.strokeStyle = "rgba(10,14,134,1)";
        cxt.fillStyle = "rgba(10,14,134,1)";
        cxt.lineWidth = 2;
        cxt.beginPath();
        cxt.moveTo(x1, srcTop);
        cxt.bezierCurveTo(c1x, srcTop, c2x, destTop, x2, destTop);
        //cxt.lineTo(c2x, destTop);
        cxt.stroke();
        
        
        //cxt.beginPath();
        //cxt.fillStyle = "rgba(10,14,134,1)";
        //cxt.arc(x2, destTop, 5, 0, Math.PI * 2);
        //cxt.fill();

    }

}