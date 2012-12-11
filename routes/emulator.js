var fitnode = require('fitnode');
var config = require('config');

/*********** 页面的元数据信息，用来构造页面UI 或者测试 ***************/
var getFieldMeta = function (fields, context, callback) {
    var db = config.db();
    var q = { ProjectName: '5072868317f07b7013002040', FieldName: { "$in": fields} };
    //暂不考虑情景，待补充
    //if (context) q["Context"] = context;
    //else q["Context"] = { "$in": [null, ''] };
    db.collection("MetaField").find(q).toArray(function (err, docs) {
        callback(docs);
    });
}

var getPageMeta = function (_id, page, callback) {
    var db = config.db();
    db.collection("MetaModule").findOne({ _id: db.ObjectID(_id) }, function (err, m) {
        callback(m.ModulePages[page]);
    });
}

var getQueryMeta = function (queries, callback) {
    var db = config.db();
    var metaQuery = {};
    new fitnode.seq_asyncArray(
            function (queryName, data, c) {
                db.collection("MetaQuery").findOne({ QueryName: queryName }, function (err, query) {
                    metaQuery[queryName] = query;
                    c();
                });
            },
            queries,
            function () {
                callback(metaQuery);
            }
        ).exec();
}


var queryParamsMeta = function (fieldsMeta, query) {
    for (var p in query.Params)
        for (var f in fieldsMeta) {
            if (query.Params[p].ParamName == fieldsMeta[f].FieldName) {
                query.Params[p].metaField = fieldsMeta[f];
                break;
            }
        }
}

var getQueryData = function (fields, fieldsMeta, query) {
    var dataset = {
        Columns: [],
        Rows: [{}]
    };
    for (var i in fields) {
        var ff = { fieldName: fields[i] };
        for (var f in fieldsMeta) {
            if (fields[i] == fieldsMeta[f].FieldName) {
                ff["metaField"] = fieldsMeta[f];
                break;
            }
        }
        dataset.Columns.push(ff);
        dataset.Rows[0][fields[i]] = i;
    }
    return dataset;
}


exports.page = function (req, res) {
    var db = config.db();
    var page;
    new fitnode.seq_async([
        function (params, callback) {
            //取页面元数据
            getPageMeta(req.query._id, req.query.page, function (p) {
                page = p;
                callback();
            });
        },
        function (params, callback) {
            //取查询元数据
            page.Queries = page.Queries.trim().split(';');

            getQueryMeta(page.Queries, function (queries) {
                page.metaQueries = queries;

                callback();
            });
        },
        function (params, callback) {
            page.metaFields = {};
            page.dataSet = {};
            new fitnode.seq_asyncArray(
                function (queryName, params, c) {
                    //取查询的字段
                    var metaQuery = page.metaQueries[queryName];
                    var fields = new fitnode.sql(metaQuery.Scripts[0].Script).fieldsInclude();

                    //构造查询数据
                    getFieldMeta(fields, metaQuery.QueryName, function (metaFields) {
                        page.metaFields[metaQuery.QueryName] = metaFields;

                        page.dataSet[metaQuery.QueryName] = getQueryData(fields, metaFields, metaQuery);
                        page.dataSet[metaQuery.QueryName + ".0"] = page.dataSet[metaQuery.QueryName];

                        var queryParams = [];
                        for (var p in metaQuery.Params) queryParams.push(metaQuery.Params[p].ParamName);
                        getFieldMeta(queryParams, metaQuery.QueryName + "_p", function (pMetaFields) {
                            page.metaFields[metaQuery.QueryName + "_p"] = pMetaFields;
                            c();
                        });
                    });
                },
                page.Queries,
                function (params) {
                    callback();
                }
            ).exec();
        },
        function (params, callback) {
            for (var q in page.Queries) {
                queryParamsMeta(page.metaFields[page.Queries[q] + "_p"], page.metaQueries[page.Queries[q]]);
            }
            callback()
        }
    ], function (params) {
        console.log(page);
        res.json(page);

    }).exec();
};
  
