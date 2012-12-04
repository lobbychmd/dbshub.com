var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.uidesigner = function (req, res) {
    res.render('demo/uidesigner.html', { toolbar: {}, layout: null });
};

