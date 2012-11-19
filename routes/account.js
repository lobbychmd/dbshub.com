var fitnode = require('fitnode');
var config = require('config');

exports.projects = function (callback) {

    var auth = new fitnode.snsauth(config.db(), config.auth_config);
    auth.demo_data();

    var query_prjs = {};
    auth.limit(query_prjs, 'dev'); //限制只有开发者才可以浏览
    config.db().collection('Project').find(query_prjs).toArray(function (err, items) {
        
        callback(items);
    });
}
