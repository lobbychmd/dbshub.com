var mongoose = require('mongoose');
var Enumerable = require('linq');
var metaTable = require('metaTable').metaTable;

exports.view = function (req, res) {
    res.render('dbchart.html', {});
};

exports.edit = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").find({ TableName: 'tCardReceive' }).exec(function (err, docs) {
        var doc = new metaTable(docs[0]);
        doc.layout = null;
        res.render('table.html', doc);  
    });
};