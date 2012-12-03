
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var db = require('schema');
db.connect();

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
var login = require('fitnode').login_filter;

app.get('/account/login', require('./routes/account').login)
app.post('/account/signin', require('./routes/account').signin)
//app.get('/account/login', routes.account.login)
app.get('/', login, routes.index);
app.get('/project/:id', login, routes.index);
app.get('/tables', routes.tables);
app.get('/data/tables', require('./routes/data').tables);
app.get('/data/table', require('./routes/data').table);
app.get('/data/doc', require('./routes/data').doc);
app.get('/flowchart/index', require('./routes/dbchart').index);
app.get('/flowchart/view/demo_view', require('./routes/dbchart').demo_view);
app.get('/flowchart/view/:id', require('./routes/dbchart').view);
app.get('/flowchart/edit/:id', require('./routes/dbchart').edit);
app.get('/flowchart/tree', require('./routes/dbchart').tree);
app.post('/flowchart/save', require('./routes/dbchart').save);
app.post('/flowchart/json2str', require('./routes/dbchart').json2str);

app.get('/documentation', require('./routes/documentation').index);
app.get('/documentation/:name', require('./routes/documentation').doc);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
