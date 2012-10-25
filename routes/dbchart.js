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

exports.view = function (req, res) {
    res.render('dbchart.html', {});
};

exports.demo = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").find({}).limit(10).exec(function (err, docs) {
        var data = [];
        for (var i in docs) {
            data.push(new metaTable(docs[i]));
        }
        res.send(data);
    });
};

exports.edit = function (req, res) {
    var db = require('mongo');
    var tables = mongoose.model("MetaTable").find({ TableName: 'tCardReceive' }).exec(function (err, docs) {
        var doc = new metaTable(docs[0]);
        doc.layout = null;
        res.render('table.html', doc);
    });
};