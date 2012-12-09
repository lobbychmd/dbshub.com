var fitnode = require('fitnode');
var config = require('config');

/*********** 页面的元数据信息，用来构造页面UI 或者测试 ***************/
exports.page = function (req, res) {
    var db = config.db();
    db.collection("MetaModule").findOne({ _id: db.ObjectID(req.query._id) }, function (err, doc) {
        var page = doc.ModulePages[req.query.page];
        var Queries = page.Queries.trim().split(';');
        page.Queries = {};
        page.DataSet = {};
        page.FieldsMeta = {};
        new fitnode.seq_asyncArray(
            function (queryName, data, callback) {

                db.collection("MetaQuery").findOne({ QueryName: queryName }, function (err, doc1) {
                    page.Queries[queryName] = doc1;
                    page.DataSet[queryName + ".0"] = {
                        Columns: [{ fieldName: "field1" }, { fieldName: "field2"}],
                        Rows: [{ field1: "asdf", field2: 1}]
                    };
                    page.DataSet[queryName] = page.DataSet[queryName + ".0"]

                    //page.FieldsMeta[queryName + "_p"] = {};
                    new fitnode.seq_asyncArray(
                        function (param, data1, callback1) {

                            db.collection("MetaField").findOne({ FieldName: param.ParamName }, function (err, metafield) {
                                param.metaField = metafield;

                                callback1();
                            });
                        },
                        doc1.Params,
                        function () {
                            page.Queries[queryName] = doc1;
                            
                            callback();
                        }
                    ).exec();

                });
            },
            Queries,
            function () {
                res.json(page);
            }
        ).exec();

    });
};
  
