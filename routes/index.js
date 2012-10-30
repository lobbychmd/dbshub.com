//var metaTable = require("metaTable").metaTable;
var mongoose = require('mongoose');
var Enumerable = require('linq');

 

exports.index = function (req, res) {
    res.render('index.html', {});
};

 

exports.tables = function (req, res) {
    var m = mongoose.model("MetaTable");
    console.log(req.query);

    var query = "";
    for (var i in req.query.term) query = query + "[" + req.query.term[i].toLowerCase() + req.query.term[i].toUpperCase() + "]";
    console.log(query);
    query = { TableName: eval('/' + query + '/') };

    var max = 20;
    m.find(query, function (err, docs) {
        var data = [];  
        for (var i in docs) {
            data.push({ type: '', value: docs[i].TableName });
            if (data.length == max) {
                res.json(data);
                return;
            }
        }
    });
};