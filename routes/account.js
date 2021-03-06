var fitnode = require('fitnode');
var config = require('config');
var acc = require('account');

exports.projects = function (callback) {
    var auth = new fitnode.snsauth(config.db(), config.auth_config);
    auth.demo_data();

    var query_prjs = {};

    new fitnode.seq_async([
            function (data, callback) {
                auth.limit(query_prjs, "_id", 'dev', null, null, callback);
            },
            function (query, callback) {
                config.db().collection('Project').find(query).toArray(callback);
            },
        ],
        function (data) {
            callback(data[1]);
        }).exec();
}

exports.login = function (req,res) {
    return res.render('account/login.html', {layout:null, toolbar: [], rel: req.query.rel? req.url.substring(req.url.indexOf('rel=') + 4): "/"});
}

exports.logout = function (req, res) {
    delete req.session.user;
    delete req.session.project;
    res.redirect('/');
}


exports.signin = function (req, res) {
    if (req.body.UserNO) {
        config.db().collection('Account').findOne({ UserNO: req.body.UserNO }, function (err, doc) {
            if (err) res.json({ IsValid: false, Errors: [{ ErrorMessage: err}] });
            else if (!doc) res.json({ IsValid: false, Errors: [{ ErrorMessage: "无此用户", MemberNames: ["UserNO"]}] });
            else {
                var hasher = require('crypto').createHash('sha1');
                hasher.update(req.body.UserNO + req.body.Password);
                if (doc.Password != hasher.digest('hex')) {
                    res.json({ IsValid: false, Errors: [{ ErrorMessage: "密码不正确", MemberNames: ["UserNO", "Password"]}] });
                } else {
                    req.session.user = doc;
                    new acc.account(req).getState(null, "ProjectName", function (data) {
                        req.session.project = data;
                        res.json({ IsValid: true });
                    });

                    //});
                }
            }
        });
    } else res.json({ IsValid: false, Errors: [{ ErrorMessage: "用户名不能为空", MemberNames: ["UserNO"]}] });
}


exports.savestate = function (req, res) {
    //console.log(req.params.group);
    //console.log(req.body.NavTree);
    new acc.account(req).saveState(req.session.project, req.params.group, req.body, function () {
        res.send('ok');
    });
}

exports.setting = function (req, res) {
    var type = req.params.type ? req.params.type : "Pwd";
    res.render('account/set' + type + '.html', {
        global_data: req.global_data, project: req.session.project, user: req.session.user,
        type: type
    });
}

exports.addPrj = function (req, res) {
    config.db().collection('Project').insert(req.body, function () {
        res.redirect('/account/setting/Prj');
    });

}