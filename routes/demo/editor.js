var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.index = function (req, res) {
    res.render('demo/editor/index.html', { layout: "../demoLayout"});
};
