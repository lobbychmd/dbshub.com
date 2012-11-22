var mongoose = require('mongoose');
var Enumerable = require('linq');
var metaTable = require('metaTable').metaTable;
var db = require('config').db();
var fitnode = require('fitnode');
var metaTable = require('metaTable').metaTable; 

exports.index = function (req, res) {
    db.collection('DbView').find().toArray(function (err, docs) {
        res.render('dbchart/dbchart.html', { toolbar: {}, dbviews: docs });
    });
};

exports.view = function (req, res) {
    db.collection('DbView').findOne({ _id: db.ObjectID(req.params.id) }, function (err, doc) {
        if (!doc) doc = { _id: '000000000000000000000000', Caption: '新流程', Data: [] };
        var mt = db.collection('MetaTable');
        new fitnode.seq_asyncArray(
            function (item, data, callback) {
                mt.findOne({ TableName: item.TableName }, function (err, doc) {
                //mongoose.model("MetaTable").findOne({ TableName: item.TableName }).exec(function (err, doc) {
                    item.Schema = metaTable( doc);
                    console.log(item );
                    callback(doc);
                });
            },
            doc.Data,
            function () {
                
                res.render('dbchart/chart_view.html', { layout: null, toolbar: [], view: doc });
            }
        ).exec();
    });
};

exports.save = function (req, res) {
    var c = db.collection('DbView');
    var _id = db.ObjectID( req.body._id) ;
    req.body._id = null;
    c.update({ _id: _id}, req.body, function (err) {
        console.log(err);
        c.insert(req.body);
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