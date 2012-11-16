/* 保存界面状态 */
$.lastStateSetting = {}; 
$.lastState = {
    register: function (id, get, save, load) {
        $('<span style="display:none"><span>').attr('id', 'statestr_' + id).appendTo('body');
        $.lastStateSetting[id] = {get: get, save: save, load: load};
    },
    change: function (id) {
        var statestr = $.lastStateSetting[id].get();
        
        //这里用了一个巧妙的方法, 延时0.5秒执行, 并只执行最后那一次
        $('#statestr_' + id).text(statestr);
        setTimeout(function(){  
            if ($('#statestr_' + id).text() == statestr)
                $.lastStateSetting[id].save();
        }, 500);

    }
}