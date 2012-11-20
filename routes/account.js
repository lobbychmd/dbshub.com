var fitnode = require('fitnode');
var config = require('config');

exports.projects = function (callback) {
    var auth = new fitnode.snsauth(config.db(), config.auth_config);
    auth.demo_data();

    var query_prjs = {};
    query_prjs = auth.limit(query_prjs, "_id", 'dev', null, null, function (query) {
        //限制只有开发者才可以浏览
        config.db().collection('Project').find(query).toArray(function (err, items) {
            callback(items);
        });
    });

    //auth.filter(config.db().collection('Project').find(query_prjs), 'dev', null, null, function (items) {
    //    callback(items);
    //});
}

exports.login = function (req,res) {
    return res.render('account/login.html', {layout:null, toolbar: [], rel: req.query.rel? req.url.substring(req.url.indexOf('rel=') + 4): "/"});
}

exports.signin = function (req, res) { 
    if (req.body.UserNO) {
        config.db().collection('Account').findOne({ UserNO: req.body.UserNO }, function (err, doc) {
            if (err) res.json({ IsValid: false, Errors: [{ ErrorMessage: err }] });
            else if (!doc) res.json({ IsValid: false, Errors: [{ ErrorMessage: "无此用户", MemberNames: ["UserNO"] }] });
            else {
                var hasher = require('crypto').createHash('sha1');
                hasher.update(req.body.UserNO + req.body.Password);
                if (doc.Password != hasher.digest('hex')) {
                    res.json({ IsValid: false, Errors: [{ ErrorMessage: "密码不正确", MemberNames: ["UserNO", "Password"] }] });
                } else
                {
                    req.session.user = doc;
                    //require('account').getLastPosition(doc._id, function (err, position) {
                    //   if (!err) req.session.project = position;
                        res.json({ IsValid: true });
                    //});
                }
            }
        });
    } else res.json({ IsValid: false, Errors: [{ ErrorMessage: "用户名不能为空", MemberNames: ["UserNO"] }] });
}