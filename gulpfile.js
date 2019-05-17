var gulp = require('gulp'),
    gutil = require('gulp-util'),
    args = require('yargs').argv,
    clean = require('gulp-clean'),
    path = require('path'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    cssTimeStamp = require('gulp-timestamp-css-url'),
    rev = require('gulp-rev'),
    plumber = require('gulp-plumber'),
    _ = require('underscore'),
    ejs = require('gulp-ejs'),
    through = require('through2'),
    htmlmin = require('gulp-htmlmin'),
    runSequence = require('gulp-run-sequence'),
    cdnify = require('gulp-cdnify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    amdOptimize = require("amd-optimize"),
    glob = require('glob'),
    cached = require('gulp-cached'),
    merge = require("merge-stream");

var Config = {
    //基本目录
    src: '.',
    dest: '../dist',
    templates: '../templates'
};

_.extend(Config, {
    //清空目录
    clean_dest: Config.dest + '/*',

    //less
    less_src: [
      Config.src + "/less/*.less",
      '!'+ Config.src + '/less/include/*.less'
    ],
    less_dest: Config.dest + '/css',

    copy_src: [
      Config.src + '/**/*',
      "!"+ Config.src + '/less',
      "!"+ Config.src + '/less/**',
      "!"+ Config.src + '/modules',
      "!"+ Config.src + '/modules/**',
      "!"+ Config.src + '/js/common/**'
    ],
    copy_dest: Config.dest,

    //ejs目录
    ejs_src: [
      Config.templates + "/**/*.ejs",
      "!" + Config.templates + "/include/**/*.ejs"
    ],
    ejs_dest: Config.dest + '/',

    //源文件
    source_src: [
      Config.src + '/modules*/**/*.js',
      Config.src + '/js*/**/*.js',
      Config.src + '/libs*/**/*.js',
      Config.src + '/images*/',
    ],
    sourc_dest: Config.dest + '/src',

    //公共sjs合并
    concat_src: Config.src + "/js/**/*.js",
    concat_dest: Config.dest +'/js/common',

    //优化modules目录下js
    concat_modules_src: Config.src + "/?(modules|js)/!(common|filters|demo|directives|component)/*.js",
    concat_modules_dest: Config.dest,

    exclude: {
        "zepto": 'empty:',
        'vue': 'empty:'
    },

    optimize_exclude: [],

    //js压缩
    uglifyjs_src: [
      Config.dest + '/js*/**/*.js',
      Config.dest + '/modules*/**/*.js'
    ],
    uglifyjs_dest: Config.dest

})

// 设置默认工作目录为./www
process.chdir("www");
//argv = process.argv.slice(2);

var _build = '',
    ctx = '',
    env = args.env,
    BUILD_TIMESTAMP = args.ts || gutil.date(new Date(), "yyyymmddHHMMss"),
    CDN_PATH = 'https://cdn.m.annie.com';

if (env == 'UAT') {
  CDN_PATH = 'https://cdn.m.uat.annie.com'
} else if (env == 'DEV') {
  CDN_PATH = '';
}

//清空目录
gulp.task('clean', function(){
  return gulp.src(Config.clean_dest, {read: false})
        .pipe(clean({ force: true}));
});

//less编译
gulp.task('less', function(){
  return gulp.src(Config.less_src)
      .pipe(plumber())
      .pipe(less())
      //.pipe(minifyCSS())
      .pipe(cssTimeStamp({
        useDate:false,  //取当前时间
        customDate: BUILD_TIMESTAMP  //自定义时间，跟html,js保持同步
      }))
      .pipe(gulp.dest(Config.less_dest))
      //.pipe(rev.manifest())
      //.pipe(gulp.dest(Config.src + '/rev'))
});

//拷贝文件
gulp.task('copy', function(){
  return gulp.src(Config.copy_src)
      .pipe(gulp.dest(Config.copy_dest))
});

//拷贝源码
gulp.task('source', function(){
  return gulp.src(Config.source_src)
  .pipe(gulp.dest(Config.sourc_dest));
});

//ejs编译
//ejs(data, options, settings)
gulp.task('ejs', function(){
  console.log(env);
  return gulp.src(Config.ejs_src)
      .pipe(ejs({
        ctx: ctx,
        _build: {
          env: env,
          ts: BUILD_TIMESTAMP,
          cdn: CDN_PATH
        },
        _: _
      },{
        delimiter: "@",
        root: __dirname + "/templates"
      },{
        ext:'.html'
      }))
      .pipe(cdnify({
        base: CDN_PATH,
        html: {
          'img[src]': 'src'
        },
        timestamp: BUILD_TIMESTAMP
      }))
      .pipe(htmlmin({
            removeComments: true, 
            collapseWhitespace: false, 
            minifyJS: true,
            minifyCSS: true
      }))
      .pipe(gulp.dest(Config.ejs_dest))
});

gulp.task('concat_loader', function(){
  return gulp.src([Config.src + '/libs/require.js',Config.src + '/libs/require-config.js'])
      .pipe(concat({
        path: 'loader.min.js'
      }))
      .pipe(uglify())
      .pipe(gulp.dest(Config.dest + '/libs/'))
});

//公共js合并
gulp.task('concatCommon', function(){
  return gulp.src(Config.concat_src)
      .pipe(amdOptimize('C',{
        configFile: Config.src + "/libs/require-config.js",
        paths: Config.exclude,
        exclude: Config.optimize_exclude
      }))
      .pipe(concat('common.js'))
      .pipe(gulp.dest(Config.concat_dest))
});

//优化modules
gulp.task('concatModules', function(){
  var sequence = [];
  var files = glob.sync(Config.concat_modules_src)
    files.forEach(function(item) {
        sequence.push(
            // 优化common
            gulp.src([Config.src + "/modules/**/*.js", Config.src + "/js/**/*.js"])
                //.pipe(cached("JS_OPTIMIZE"))
                .pipe(amdOptimize(item.replace('./', '').replace('.js', ''), {
                    configFile: Config.src + "/libs/require-config.js",
                    paths: Config.exclude,
                    exclude: Config.optimize_exclude.concat(["C"])
                }))
                // 合并
                .pipe(concat(item))
                .pipe(gulp.dest(Config.concat_modules_dest))
        )
    });
    return merge.apply(this, sequence);
});

//压缩js
gulp.task('uglifyjs', function(){
  return gulp.src(Config.uglifyjs_src)
      .pipe(uglify())
      .pipe(gulp.dest(Config.uglifyjs_dest))
});

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    ['less', 'ejs', 'copy', 'concat_loader', 'source'],
    ['concatCommon','concatModules'],
    'uglifyjs',
    cb);
});


