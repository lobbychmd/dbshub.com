//require('schema');
var mongoose = require('mongoose');
var Enumerable = require('linq');
var metaTable = require('metaTable').metaTable;

exports.index = function (req, res) {
    res.render('documentation/doc_index.html', {toolbar: []});
};

exports.doc = function (req, res) {
    res.render('documentation/' + req.params.name + '.html', {layout:null, toolbar: []});
};

