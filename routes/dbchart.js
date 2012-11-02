//require('schema');
var mongoose = require('mongoose');
var Enumerable = require('linq');
var metaTable = require('metaTable').metaTable;

exports.view = function (req, res) {
    res.render('dbchart.html', {});
};

exports.edit = function (req, res) {
    var db = require('schema');
    console.log(req.params.id);
    var tables = mongoose.model("MetaTable").findOne({ _id:  req.params.id }).exec(function (err, doc) {
        console.log(doc);
        doc = new metaTable(doc);
        doc.layout = null;
        res.render('design-table.html', doc);
    });
};