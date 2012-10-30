var mongoose = require('mongoose');
var metaTable = require('metaTable').metaTable; 

exports.table = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").findOne({TableName: req.query.tableName}).exec(function (err, doc) {
        res.send(new metaTable(doc)); 
    });
};
  
exports.tables = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").find({}).limit(10).exec(function (err, docs) {
        var data = [];
        for (var i in docs) {
            data.push(new metaTable(docs[i]));
        }
        res.send(data);
    });
};
