$.fn.headerTabs = function (option) {
    return this.each(function () {
        $(this).addClass('headerTabs').tabs(option);

    });
}