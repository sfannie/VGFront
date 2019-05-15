var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var gutil = require('gulp-util');
var expressLess = require('express-less');
var _ = require('underscore');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/www/css', expressLess(__dirname + '/www/less'));

//设置静态路径
app.use('/www', express.static('www'));
app.use('/images', express.static('www/images'));
app.use('/modules', express.static('www/modules'));

//设置模板路径
app.set('views', path.join(__dirname, 'templates')); 

var CONTEXT_PATH = '/www',
    BUILD_TIMESTAMP = gutil.date(new Date(), "yyyymmddHHMMss"),
    env = 'DEV',
    CDN_PATH = 'https://cdn.m.annie.com';

if (env == 'UAT') {
  CDN_PATH = 'https://cdn.m.uat.annie.com'
} else if (env == 'DEV') {
  CDN_PATH = '/www';
}

app.engine('ejs', function() {
  ejs.renderFile(arguments[0], {
    ctx: CONTEXT_PATH,
    _build: {
        //pkg: pkg,
        //version: pkg.version,
        ts: BUILD_TIMESTAMP,
        env: env,
        cdn: CDN_PATH
    },
    //Utils: new Utils(env),
    _: _,
    data: {}
  }, arguments[1], arguments[2]);
});

app.set('view engine', 'ejs');
ejs.delimiter = '@';

//匹配所有html文件
app.use('/*.html', function(req, res) {
  res.render(req.params[0]);
});


var server = app.listen(8008, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});