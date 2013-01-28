var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.dataGrid = function (req, res) {
    res.render('demo/grid/dataGrid.html', {  layout: "../demoLayout" });
};
