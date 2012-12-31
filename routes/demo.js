var Enumerable = require('linq');
var db = require('config').db();
var fitnode = require('fitnode');

exports.uidesigner = function (req, res) {
    res.render('demo/uidesigner.html', { toolbar: {}, layout: null });
};

exports.dataGrid = function (req, res) {
    res.render('demo/dataGrid.html', {  layout: null });
};

exports.lookupdemo = function (req, res) {
    res.render('demo/lookup.html', {  layout: null });
};

exports.lookupfail = function (req, res) { 
    res.json(null);
}

exports.lookup = function (req, res) {
    var result = {};
    var value = '';
    for (var i in req.query) {
        if (i != 'lookupfields') value += req.query[i];
    }
    var lookupfields = req.query.lookupfields.split(';');
    for (var i in lookupfields)
        result[lookupfields[i]] = value + i;
    res.json(result);
};

exports.search = function (req, res) {
    res.render("demo/searchlookup.html", {layout: null, lookupfields: req.query.lookupfields.split(';'), multisel: req.query.multisel, rows:[{idx: 1}, {idx: 2}]});
};
