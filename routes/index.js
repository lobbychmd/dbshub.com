var mongoose = require('mongoose');
var Enumerable = require('linq');
var account = require('account').account;
var db = require('config').db();

exports.index = function (req, res) {
    //var auth = snsauth.snsauth();
    new account(req).getState(req.session.project, "TabTree", function (doc) {
        res.render('index.html', {
            global_data: req.global_data, project: req.session.project, user: req.session.user,
            tabstate: doc ? (doc.ContentTab ? JSON.stringify(doc.ContentTab) :"null"): "null",
        });
    });

};

exports.changeprj = function (req, res) {
    new account(req).saveState(null, "ProjectName", req.params.project, function () {
        //
    });
    req.session["project"] = req.params.project;
    var rel = req.query.rel ? req.url.substring(req.url.indexOf('rel=') + 4) : "/";
    res.redirect(rel);
}

exports.tables = function (req, res) {
    var m = mongoose.model("MetaTable");

    var query = "";
    for (var i in req.query.term) query = query + "[" + req.query.term[i].toLowerCase() + req.query.term[i].toUpperCase() + "]";
    //console.log(query);
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

exports.reference = function(req, res){
    var q = {ProjectName: req.session.project}
    q[req.params.key] = eval('/^' + req.query.term + '/');
    db.collection(req.params.type).find(q).limit(20).toArray(function(err, docs){
        var data = [];
        for( var i in docs) data.push({type:req.params.type, value: docs[i][req.params.key], text:'aaa'});
        res.send(data);
    })
    
}