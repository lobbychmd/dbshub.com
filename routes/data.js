var mongoose = require('mongoose');
var metaTable = require('metaTable').metaTable; 

exports.table = function (req, res) {
    var db = require('schema');
    //var tables = mongoose.model("MetaTable").findOne({_id: '4fb9e61d62de5d0f208411d9'}).exec(function (err, doc) {
    var tables = mongoose.model("MetaTable").findOne({TableName: req.query.tableName}).exec(function (err, doc) {
        res.send(new metaTable(doc)); 
    });
};
  
exports.tables = function (req, res) {
    var db = require('schema');
    var tables = mongoose.model("MetaTable").find({}).limit(10).exec(function (err, docs) {
        var data = [];
        for (var i in docs) {
            data.push(new metaTable(docs[i]));
        }
        res.send(data);
    });
};