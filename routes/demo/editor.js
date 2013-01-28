var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.index = function (req, res) {
    var types = [
        {type: "string", size: 20},
        {type: "date" },
    ];
    res.render('demo/editor/index.html', { layout: "../demoLayout" });
};
