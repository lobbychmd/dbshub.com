var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.index = function (req, res) {
    res.render('demo/index.html', { toolbar: {}, layout: "demoLayout"});
};

exports.uidesigner = function (req, res) {
    res.render('demo/uidesigner.html', { toolbar: {}, layout: "demoLayout"});
};

