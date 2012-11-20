var mongoose = require('mongoose');
var Enumerable = require('linq');
var account = require('./account');
var db = require('config').db();

exports.index = function (req, res) {
    //var auth = snsauth.snsauth();
    account.projects(function (items) {
        db.collection('Project').findOne({_id: db.ObjectID(req.params.id)}, function(err, doc){
            res.render('index.html', { toolbar: null, projects: items, project: doc });
        });
    });
};

exports.tables = function (req, res) {
    var m = mongoose.model("MetaTable");

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