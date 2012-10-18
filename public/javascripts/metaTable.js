$.fn.metaTable = function () {
    return this.each(function () {
        $(this).find('tr').click(function () {
            $(this).parent().children().removeClass("sel");
            $(this).addClass("sel");
        });
    });
}