//var metaTable = require("metaTable").metaTable;
var mongoose = require('mongoose');
var Enumerable = require('linq');

var metaTable = function (doc) {
    this.TableName = doc.TableName;

    for (var i in doc.Indexies)
        if (doc.Indexies[i].PrimaryKey) {
            //var
        }
    this.cols = doc.Columns.slice(10);
    Enumerable.From(doc.cols).ForEach(function (obj) {
        obj.PK = true;
        //console.log(obj.PK);
    });

    this.Get = function () {
        return { TableName: this.TableName };
    }
}

exports.index = function (req, res) {
    res.render('index.html', {});
};

exports.metaTable = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").findOne(function (err, doc) {
        res.send(new metaTable(doc));
    });
};

exports.table = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").findOne(function (err, doc) {
        var data1 = new metaTable(doc);
        data1.layout = null;    
        res.render("table.html", data1);
    });
};