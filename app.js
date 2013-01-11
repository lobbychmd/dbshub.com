
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jqtpl');
  app.register(".html", require("jqtpl").express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
      secret: "keyboard cat"
  }));

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var login = require('filter').login_filter;
var auth = require('filter').auth_filter;

app.get('/jqtpl', require('./routes/utils').jqtpl);
app.get('/account/login', require('./routes/account').login);
app.get('/account/logout', require('./routes/account').logout);
app.post('/account/signin', require('./routes/account').signin);
app.post('/account/savestate/:group', require('./routes/account').savestate);
app.get('/account/setting', login, auth, require('./routes/account').setting);
app.get('/account/setting/:type', login, auth, require('./routes/account').setting);
app.post('/account/addPrj', login, auth, require('./routes/account').addPrj);
app.get('/', login, auth, routes.index);
app.get('/index/reference/:type/:key',  routes.reference);
app.get('/changeprj/:project', login, routes.changeprj);

app.get('/project/:id', login, routes.index);
app.get('/tables', routes.tables);
app.get('/data/tables', require('./routes/data').tables);
app.get('/data/table', require('./routes/data').table);
app.get('/data/doc', require('./routes/data').doc);
app.post('/data/savedoc', require('./routes/data').savedoc);
app.get('/emulator/page', require('./routes/emulator').page);
app.get('/emulator/preview', require('./routes/emulator').preview);
app.post('/emulator/biz/:biz', require('./routes/emulator').biz);
 
app.get('/flowchart/index', require('./routes/dbchart').index);
app.get('/flowchart/view/demo_view', require('./routes/dbchart').demo_view);
app.get('/flowchart/view/:id', require('./routes/dbchart').view);
app.get('/flowchart/edit/:id', require('./routes/dbchart').edit);
app.get('/flowchart/tree', require('./routes/dbchart').tree);
app.post('/flowchart/save', require('./routes/dbchart').save);
app.post('/flowchart/json2str', require('./routes/dbchart').json2str);

app.get('/demo/uidesigner', require('./routes/demo').uidesigner);
app.get('/demo/dataGrid', require('./routes/demo').dataGrid);
app.get('/demo/lookupdemo', require('./routes/demo').lookupdemo);
app.get('/demo/lookupquery/:query', require('./routes/demo').lookup);
app.get('/demo/searchquery/:query', require('./routes/demo').search);
app.get('/demo/lookupquery_fail/:query', require('./routes/demo').lookupfail);

app.get('/documentation', require('./routes/documentation').index);
app.get('/documentation/:name', require('./routes/documentation').doc);

app.get('/game/ant', require('./routes/game').ant);

app.listen(3000, function () {
    var sql = "declare @Tag int \
    select  @Tag = min(nTag) from tMemCard where nMemberID = :MemberID \
select \
    MemberID = a.nMemberID, \
    Name = a.sName, \
    SexTypeID = a.sSexID, \
    SexType = a.sSex, \
    IDTypeID = a.sIDTypeID, \
    IDType = a.sIDType, \
    IDCardNO = a.sIDCardNO, \
    Birthday = a.dBirthday, \
    Address = a.sAddress, \
    BizRangeTypeID = a.sBizRangeID, ";
    var reg1 = /[Ss][Ee][Ll][Ee][Cc][Tt]\s+(\w+\s+)*(\w+\s*=.+[,\s]+)+\s+[Ff][Rr][Oo][Mm]/g;
    reg1.exec(sql);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    var db = require('config').db();
    //db.collection('MetaField').remove({ ProjectName: '4f61852865631f03146075c8' }, null, function () {
    //  console.log('remove ok.');
    //})
});
