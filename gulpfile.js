 var gulp = require('gulp');
var concat = require('gulp-concat'); 
var cat = require('gulp-cat');  
var addsrc = require('gulp-add-src');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css'); 
var base64 = require('gulp-base64');
var gulpSequence = require('gulp-sequence');
var exec  =require('child_process').exec;
var remoteSrc = require('gulp-remote-src');

var fs = require('fs');
var _properties = require('./env.js')(fs).readEnv();
var properties= JSON.parse(_properties);

console.log(properties);

var folderPath="", file="";

if(properties.enviornment=="production"){
  folderPath='client/prod/';
}else if(properties.enviornment=="test"){
  folderPath='client/tests/';
}else{
  folderPath='client/build/';
}

gulp.task('vendorjs',function() {
    vendorJsList=[ 
      "https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.6/socket.io.min.js",
      "https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"
    ]; 
    remoteSrc(vendorJsList, {base: '' })
        .pipe(concat('webrtcdevelopment_header.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('screensharejs',function() {
    console.log(" gulping screensharing  ");
    list=[ 
        "client/build/scripts/screensharing.js",
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('webrtcdevelopment_screenshare.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

/*gulp.task('adminjs',function() {
    console.log(" gulping admin script  ");
    list=[ 
        "client/build/scripts/admin.js",
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('webrtcdevelopmentAdmin.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});*/

gulp.task('serverjs',function() {
    console.log(" gulping admin script  ");
    list=[ 
        "realtimecomm.js",
        "restapi.js"
    ]; 
    console.log(list);
    gulp.src(list)
        /*.pipe(uglify())*/
        .pipe(concat('webrtcdevelopmentServer.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('drawjs',function() {
    console.log(" gulping drawjs  ");
    list=[ 
        "client/build/drawboard/common.js",
        "client/build/drawboard/decorator.js",
        "client/build/drawboard/draw-helper.js",
        "client/build/drawboard/drag-helper.js",
        "client/build/drawboard/pencil-handler.js",
        "client/build/drawboard/eraser-handler.js",
        "client/build/drawboard/line-handler.js",
        "client/build/drawboard/rect-handler.js",
        "client/build/drawboard/events-handler.js"
    ]; 
    console.log(list);
    gulp.src(list)
        /*.pipe(uglify())*/
        .pipe(concat('drawBoardScript.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('drawcss',function() {
    console.log(" gulping main drawcss  ");
    list=[ "client/build/css/Style.css",
        "client/build/drawboard/drawing.css"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(concat('drawBoardCss.css'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('codejs',function() {
    console.log(" gulping codejs  ");
    list=[ 
        "client/build/codemirror/lib/codemirror.js",
        "client/build/codemirror/addon/selection/active-line.js",
        "client/build/codemirror/addon/mode/loadmode.js",
        "client/build/codemirror/mode/meta.js",
        "client/build/codemirror/mode/javascript/javascript.js",
        "client/build/codemirror/codeStyles.js"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('codeEditorScript.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('codecss',function() {
    console.log(" gulping main codecss  ");
    list=[ 
        "client/build/codemirror/theme/mdn-like.css",
        "client/build/codemirror/lib/codemirror.css",
        "client/build/codemirror/style.css"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(concat('codeEditorCss.css'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

var scriptList=[
    "client/build/scripts/_init.js",
    "client/build/scripts/_notify.js",
    "client/build/scripts/RTCMultiConnection.js",
    "client/build/scripts/_screenshare.js",
    "client/build/scripts/_detectRTC.js",
    "client/build/scripts/_webrtcchecks.js",
    "client/build/scripts/_settings.js",
    "client/build/scripts/firebase.js",
    "client/build/scripts/FileBufferReader.js",
    "client/build/scripts/MediaStreamRecorder.js",
    "client/build/scripts/RecordRTC.js",
    "client/build/scripts/screenshot.js",
    "client/build/scripts/_snapshot.js",
    "client/build/scripts/_geolocation.js",
    "client/build/scripts/_chat.js",
    "client/build/scripts/_mediacontrol.js",
    "client/build/scripts/_record.js",
    "client/build/scripts/_screenrecord.js",
    "client/build/scripts/_filesharing.js",
    "client/build/scripts/_draw.js",
    "client/build/scripts/_redial.js",
    "client/build/scripts/_listenin.js",
    "client/build/scripts/_cursor.js",
    "client/build/scripts/_codeeditor.js",
    "client/build/scripts/_texteditor.js",
    "client/build/scripts/_turn.js",
    "client/build/scripts/_timer.js",
    "client/build/scripts/_stats.js"
];

gulp.task('betawebrtcdevelopmentjs',function() {
    console.log(" gulping main webrtc development scripts ");
    console.log(scriptList);
    gulp.src(scriptList)
        .pipe(concat('webrtcdevelopment.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});
/*.pipe(uglify())*/
gulp.task('webrtcdevelopmentjs',function() {
    console.log(" gulping main webrtc development scripts ");
    scriptList.push("client/build/scripts/start.js");
    scriptList.push("client/build/scripts/admin.js");    
    console.log(scriptList);
    gulp.src(scriptList)
        .pipe(concat('webrtcdevelopment.js'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});


gulp.task('mainstyle',function() {
    console.log(" gulping main stylesheets css  ");
    cssList=[ 
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css",
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css",
      "https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css",
      "https://www.gstatic.com/firebasejs/4.2.0/firebase.js"
    ]; 
    console.log(cssList);
    remoteSrc(cssList, {base: '' })
        .pipe(concat('webrtcdevelopment_header.css'))  
        .pipe(gulp.dest(folderPath+'minScripts/')); 
});

gulp.task('webrtcdevelopmentcss',function() {
    console.log(" gulping custom stylesheets css  ");
    cssList=[
      "client/build/css/Style.css",
      "client/build/css/styles.css",
      "client/build/css/chat.css",
      "client/build/css/cursor.css",
      "client/build/css/timer.css",
      "client/build/css/filesharing.css",
      "client/build/css/screenshare.css"
    ];
    console.log(cssList);
    gulp.src(cssList)
      .pipe(concat('webrtcdevelopment.css'))
      .pipe(gulp.dest(folderPath+'minScripts/'));
});

/*.pipe(minifyCss())*/

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout,stderr); });
};

gulp.task('git_pull',function(cb){
  execute('git pull',function(resp) {
      cb();
  });
});

gulp.task('default', gulpSequence(
    'betawebrtcdevelopmentjs',
    'screensharejs',
    'webrtcdevelopmentcss',
    'serverjs'
));

gulp.task('develop', gulpSequence(
    'vendorjs',
    'drawjs' , 
    'drawcss',
    'codejs',
    'codecss',
    'betawebrtcdevelopmentjs',
    'screensharejs',
    'mainstyle',
    'webrtcdevelopmentcss',
    'serverjs'
)); 

gulp.task('production', gulpSequence(
    //'vendorjs',
    'drawjs' , 
    'drawcss',
    'codejs',
    'codecss',
    'webrtcdevelopmentjs',
    'screensharejs',
    //'mainstyle',
    'webrtcdevelopmentcss',
    'serverjs'
)); 