/* 保存界面状态 */
$.lastStateSetting = {}; 
$.lastState = {
    register: function (id, group, get, save) {
        $('<span style="display:none"><span>').attr('id', 'statestr_' + id).appendTo('body').attr('group', group);
        $.lastStateSetting[id] = {get: get, save: save};
    },
    change: function (id) {
        var statestr = $.lastStateSetting[id].get();
        
        //这里用了一个巧妙的方法, 延时0.5秒执行, 并只执行最后那一次
        $('#statestr_' + id).text(statestr);
        setTimeout(function(){  
            if ($('#statestr_' + id).text() == statestr)
                $.lastStateSetting[id].save(statestr);
        }, 500);

    }
}

$.dic2array = function (data) {
    var result = [];
    for (var i in data) result.push({ key: i, value: data[i] });
    return result;
}

/**********  顺序执行n个函数 ****************/
var seq_async = function (funcs, callback) {
    this.funcs = funcs;
    this.callback = callback;
}

seq_async.prototype = {
    constructor: seq_async,
    execOne: function (params, index) {
        var obj = this;
        this.funcs[index](params, function (data) {
            if (arguments.length <= 1) data = data;
            else data = arguments;

            if (index == obj.funcs.length - 1)
                obj.callback(data);
            else obj.execOne(data, index + 1);
        })
    },
    exec: function () {
        this.execOne(null, 0);
    }
}

/**********  只执行一个函数，执行次数由数组决定     ***********/
var seq_asyncArray = function (func, paramsArray, callback) {
    this.func = func;
    this.paramsArray = paramsArray;
    this.callback = callback;
}


seq_asyncArray.prototype = {
    constructor: seq_asyncArray,
    execOne: function (params, index) {
        var obj = this;
        this.func(this.paramsArray[index], params, function (data) {
            if (arguments.length <= 1) data = data;
            else data = arguments;

            if (index == obj.paramsArray.length - 1)
                obj.callback(data);
            else obj.execOne(data, index + 1);
        })
    },
    exec: function () {
        if (this.paramsArray.length > 0) this.execOne(null, 0);
        else this.callback(null);
    }
}