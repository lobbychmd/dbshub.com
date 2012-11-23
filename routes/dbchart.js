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

exports.demo_view = function (req, res) {
    res.render('dbchart/chart_view_demo.html', { layout: null, toolbar: []});
}

exports.view = function (req, res) {
    db.collection('DbView').findOne({ _id: db.ObjectID(req.params.id) }, function (err, doc) {
        if (!doc) doc = { _id: '000000000000000000000000', Caption: '新流程', Position: [] };
        var mt = db.collection('MetaTable');
        new fitnode.seq_asyncArray(
            function (item, data, callback) {
                mt.findOne({ _id: db.ObjectID(item.TableName) }, function (err, doc1) {
                    metaTable(doc1);
                    item.Schema = doc1;
                    callback(doc1);
                });
            },
            doc.Position,
            function () {
                for (var i in doc.LinkTo) {
                    for (var j in doc.Position) {
                        for (var k in doc.Position[j].Schema.cols) {
                            if (doc.Position[j].TableName == doc.LinkTo[i].Form.split('.')[0])
                                if (doc.Position[j].Schema.cols[k].ColumnName == doc.LinkTo[i].Form.split('.')[1]) {
                                    doc.Position[j].Schema.cols[k].LinkTo = doc.LinkTo[i].To.join(' ');
                                }
                        }
                    }
                }
                res.render('dbchart/chart_view.html', { layout: null, toolbar: [], view: doc });
            }
        ).exec();
    });
};

exports.save = function (req, res) {
    var c = db.collection('DbView');
    var _id = db.ObjectID(req.body._id);

    c.remove({ _id: _id }, function (err) {
        req.body._id = _id;
        console.log(err);
        c.insert(req.body);
        res.send('ok');
    });

};

exports.tree = function (req, res) {
    res.json([{text: 'asdf'}, {text: 'xxxx', children: [{text:'hahaha'}]}]);

};