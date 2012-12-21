var fitnode = require('fitnode');
var config = require('config');

/*********** 页面的元数据信息，用来构造页面UI 或者测试 ***************/

/*********** 处理下拉选择***************/
var fieldMetaSelection = function (fieldsMeta) {
    for (var i in fieldsMeta) {
        if (fieldsMeta[i].DicNO)
            fieldsMeta[i].Selection = fieldsMeta[i].DicNO + "." + fieldsMeta[i].DisplayLabel + "1";
        if (fieldsMeta[i].Selection && (fieldsMeta[i].Selection.indexOf('.') > 0)) {
            var selection = fieldsMeta[i].Selection.split(';');
            fieldsMeta[i].Selection = [];
            for (var j in selection)
                fieldsMeta[i].Selection.push({ key: selection[j].split('.')[0], value: selection[j].split('.')[1] });
        }
    }
    return fieldsMeta;
}

var getFieldMeta = function (project, fields, context, callback) {
    var db = config.db();
    var q = { ProjectName: project, FieldName: { "$in": fields} };
    //暂不考虑情景，待补充
    if (context) q["Context"] = context;
    //else q["Context"] = { "$in": [null, ''] };
    db.collection("MetaField").find(q).toArray(function (err, docs) {
        for (var i in docs) {
            var idx = fields.indexOf(docs[i].FieldName);
            if (idx >= 0) delete fields[idx];

        }
        q["Context"] = { "$in": [null, ''] };
        db.collection("MetaField").find(q).toArray(function (err, docs1) {
            callback(fieldMetaSelection(docs.concat(docs1)));
        });
    });
}

var getPageMeta = function (_id, page, callback) {
    var db = config.db();
    db.collection("MetaModule").findOne({ _id: db.ObjectID(_id) }, function (err, m) {
        var m1 = /\/module\/query\/(\w+)\?mid=\w+/.exec(m.Path)
        if (m1) {
            m.ModulePages = [{ UI: "\
                Toolbar {}\n\
                    PageButton {name: 'query', caption: '查询'}\n\
                    PageButton {name: 'print', caption: '打印', type: 'report'}\n\
                QueryParams {name:'sqm', mq: 'FlowTurndays', grid: 'grid1', button:'query', fieldMeta: 'FlowTurndays_p'}\n\
                QueryGrid {name: 'grid1', table:'FlowTurndays.0'}\n\
                Paginating {table:'FlowTurndays.0', dataTable:'FlowTurndays.0', sumTable:'FlowTurndays.1', reqPageKey:'page', countPerPage: 10}  "
                .replace(/FlowTurndays/ig, m1[1]),
                Queries: m1[1]
            }];
        }
        var p = m.ModulePages[page];
        if (p.PageFlow) {
            p.PageFlow = eval(p.PageFlow);
            if (p.PageFlow) p.ActiveFlow = p.PageFlow[0];
        }
        p.ModuleID = m.ModuleID;
        p.ModuleCaption = m.Caption;
        callback(p);
    });
}

var getLayout = function (ProjectName, page, callback) {
    var db = config.db();
    db.collection("MetaTheme").findOne({ ProjectName: ProjectName, Theme:'lfLayout' }, function (err, lay) {
        callback(lay);
    });
}

var getModules = function (ProjectName, page, callback) {
    var db = config.db();
    db.collection("MetaModule").find({ ProjectName: ProjectName }, {_id:1, ModuleID:1, Caption:1, ParentID:1}).toArray(function (err, modules) {
        for (var i in modules) { 
            modules[i].Path = '/emulator/preview?_id=' + modules[i]._id + '&page=0';
        }
        callback(modules);
    });
}


var getQueryMeta = function (project, queries, callback) {
    var db = config.db();
    var metaQuery = {};
    new fitnode.seq_asyncArray(
            function (queryName, data, c) {
                if (!queryName) c();
                else db.collection("MetaQuery").findOne({ ProjectName: project, QueryName: queryName }, function (err, query) {
                    if (!query) console.log(queryName + "不存在");
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
    //console.log(fieldsMeta);
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
        Rows: [{},{},{},{},{},{},{},{},{},{},{}]
    };
    for (var i in fields) {
        var ff = { fieldName: fields[i] };
        for (var f in fieldsMeta) {
            if (fields[i] == fieldsMeta[f].FieldName) {
                ff["metaField"] = fieldsMeta[f];
                break;
            }
        }
        if (!ff["metaField"]) ff["metaField"] = {DisplayLabel: fields[i]}
        dataset.Columns.push(ff);
        for(var j = 0;j <11; j++) dataset.Rows[j][fields[i]] = i + j;
    }
    return dataset;
}


exports.page = function (req, res) {
    var db = config.db();
    var project = req.session.project;
    var page;
    new fitnode.seq_async([

        function (params, callback) {
            console.log('取页面元数据');
            getPageMeta(req.query._id, req.query.page, function (p) {
                page = p;
                callback();
            });
        },
        function (params, callback) {
            console.log('布局');
            getLayout(req.session.project, req.query.page, function (lay) {
                page.layout = lay;
                callback();
            });
        },

        function (params, callback) {
            console.log('//取查询元数据');
            page.Queries = page.Queries ? page.Queries.trim().split(';') : [];
            getQueryMeta(project, page.Queries, function (queries) {
                page.metaQueries = queries;

                callback();
            });
        },
        function (params, callback) {
            page.metaFields = {};
            page.dataSet = {};
            new fitnode.seq_asyncArray(
                function (queryName, params, c) {
                    if (!queryName) c();
                    else {
                        console.log('//取查询的字段');
                        var metaQuery = page.metaQueries[queryName];
                        var queryFields = [];
                        var i = 0;
                        new fitnode.seq_asyncArray(
                            function (script, params1, c1) {
                                var fields = new fitnode.sql(script.Script).fieldsInclude();
                                console.log('//构造查询数据');
                                getFieldMeta(project, fields, metaQuery.QueryName, function (metaFields) {
                                    queryFields = queryFields.concat(metaFields);
                                    page.dataSet[metaQuery.QueryName + "." + i] = getQueryData(fields, metaFields, metaQuery);
                                    if (i == 0) page.dataSet[metaQuery.QueryName] = page.dataSet[metaQuery.QueryName + ".0"];
                                    i++;
                                    c1();
                                });

                            },
                            metaQuery.Scripts,
                            function (params) {
                                page.metaFields[metaQuery.QueryName] = queryFields;
                                var queryParams = [];
                                for (var p in metaQuery.Params) queryParams.push(metaQuery.Params[p].ParamName);
                                getFieldMeta(project, queryParams, metaQuery.QueryName + "_p", function (pMetaFields) {
                                    page.metaFields[metaQuery.QueryName + "_p"] = pMetaFields;
                                    c();
                                });
                            }
                        ).exec();
                        
                    }
                },
                page.Queries,
                function (params) {
                    callback();
                }
            ).exec();
        },
        function (params, callback) {
            for (var q in page.Queries) {
                if (page.Queries[q]) queryParamsMeta(page.metaFields[page.Queries[q] + "_p"], page.metaQueries[page.Queries[q]]);
            }
            callback()
        },
        function (params, callback) {
            //菜单
            getModules(req.session.project, req.query.page, function (modules) {
                console.log(page);
                page.modules = modules;
                callback();
            });
        },
    ], function (params) {

        res.json(page);

    }).exec();
};

exports.preview = function (req, res) {
    res.render("meta/preview.html", { layout: false, _id: req.query._id, page: req.query.page });
}

exports.biz = function (req, res) {
    var q = { ProjectName: req.session.project, BizID: req.params.biz };
    config.db().collection("MetaBiz").findOne(q, function (err, biz) {
        if (!biz) res.json({ IsValid: false, ErrorMessage: "没找到业务逻辑 " + req.params.biz });
        else {
            var msg = "执行业务逻辑: " + req.params.biz + "\n";
            for (var i in biz.Scripts) {
                var s = biz.Scripts[i];
                if (s.ProcEnabled) {
                    if (!s.ProcRepeated) {
                        msg += "  1) " + s.ProcSummary + " (参数: [])\n";
                    }
                }
            }
            res.json({ IsValid: true, Message: msg});
        }
    });
}