var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose  = require('mongoose');
var config = require('./config/config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/home');
var personalRouter = require('./routes/personal');
var manageRouter = require('./routes/Manage');
var publicRouter = require('./routes/public');

var app = express();


const port = config.apiPort;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('cbd_react_cookie'));
app.use(session({
  secret: 'cbd_react_cookie',
  resave: true,
  saveUninitialized:true,
  cookie: {maxAge: 60 * 1000 * 30}//过期时间
}))

app.use(express.static(path.join(__dirname, './public')));

app.all('*', function(req, res, next) {
    console.log(req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
    next();  
});
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/main', mainRouter);
app.use('/api/personal', personalRouter);
app.use('/api/manage', manageRouter);
app.use('/api/public', publicRouter)


// 数据库连接
mongoose.Promise = require('bluebird');

// 线上地址 mongodb://root:9527007@${config.dbHost}:${config.dbPort}/admin
// 开发地址 mongodb://${config.dbHost}:${config.dbPort}/blog

mongoose.connect(`mongodb://root:9527007@81.70.202.166:${config.dbPort}/admin`, function (err) {
    if (err) {
        console.log(err, "数据库连接失败");
        return;
    }
    console.log('数据库连接成功');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
