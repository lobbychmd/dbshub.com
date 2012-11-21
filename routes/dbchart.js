var mongoose = require('mongoose');
var Enumerable = require('linq');
var metaTable = require('metaTable').metaTable;
var db = require('config').db();

exports.index = function (req, res) {
    db.collection('DbView').find().toArray(function (err, docs) {
        res.render('dbchart/dbchart.html', { toolbar: [], dbviews: docs });
    });
};

exports.view = function (req, res) {
    db.collection('DbView').findOne({ _id: db.ObjectID(req.params.id) }, function (err, doc) {
        if (!doc) doc = {_id: '000000000000000000000000', Caption: '新流程'};
        res.render('dbchart/chart_view.html', {layout:null, toolbar:[], view: doc});
    });
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