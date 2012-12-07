var config = require('config');
var mongoose = require('mongoose');
var metaTable = require('metaTable').metaTable; 

exports.table = function (req, res) {
    var db = require('schema');
    //var tables = mongoose.model("MetaTable").findOne({_id: '4fb9e61d62de5d0f208411d9'}).exec(function (err, doc) {
    var tables = mongoose.model("MetaTable").findOne({TableName: req.query.tableName}).exec(function (err, doc) {
        res.send(metaTable(doc)); 
    });
};
  
exports.tables = function (req, res) {
    var db = require('schema');
    var tables = mongoose.model("MetaTable").find({}).limit(10).exec(function (err, docs) {
        var data = [];
        for (var i in docs) {
            data.push(metaTable(docs[i]));
        }
        res.send(data);
    });
};

exports.doc = function (req, res) {
    var db = config.db();
    db.collection(req.query.table).findOne({_id: db.ObjectID(req.query._id)}, function (err, doc) {
        res.render("meta/doc.html", {layout:null, toolbar:[], _id: doc._id, type:doc._t, str:JSON.stringify( doc)});
    });
};

