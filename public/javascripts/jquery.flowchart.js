$.fn.flowchart = function () {
    return this.each(function () {
        new flowchart().createCanvas(this);

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
