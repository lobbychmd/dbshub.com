$.fn.createCanvas = function () {
    return this.each(function () {
        var w = $(this).width();
        var h = $(this).height();
        var canvasId = 'canvas' + Math.random().toString().substring(2);
        $('<canvas>').insertAfter(this).css('border', '1px solid red')
            .attr('id', canvasId ).attr('width', w).attr('height', h)
            .css('position', 'relative').css('margin-top', '-' + h + 'px')
            .css('z-index', '-1');
        $(this).css('position', 'relative').attr('canvasId', canvasId);
    });
}

$.fn.testCanvas = function () {
    return this.each(function () {
        var black1 = $('<div>').css('border', '1px solid gray').css('width', '100px').css('height', '100px')
            .css('position', 'absolute').css('left', '100px').css('top', '100px')
            .appendTo(this);
        var black2 = $('<div>').css('border', '1px solid gray').css('width', '100px').css('height', '100px')
            .css('position', 'absolute').css('left', '200px').css('top', '200px')
            .appendTo(this).draggable({
                stop: function () {
                    var x1 = black1.css('left');
                    x1 = $(this).css('left');
                    alert(x1);  
                }
            });
    });
}
