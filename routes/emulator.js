var fitnode = require('fitnode');
var config = require('config');

/*********** 页面的元数据信息，用来构造页面UI 或者测试 ***************/
exports.page = function (req, res) {
    var db = config.db();
    db.collection("MetaModule").findOne({ _id: db.ObjectID(req.query._id) }, function (err, doc) {
        var page = doc.ModulePages[req.query.page];
        var Queries = page.Queries.trim().split(';');
        page.Queries = {};
        new fitnode.seq_asyncArray(
            function (queryName, data, callback) {
                console.log(queryName);
                db.collection("MetaQuery").findOne({ QueryName: queryName }, function (err, doc1) {
                    page.Queries[queryName] = doc1;
                    callback();
                });
            },
            Queries,
            function () {
                res.json(page);
            }
        ).exec();

    });
};
  
