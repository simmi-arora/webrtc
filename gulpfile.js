
var gulp = require('gulp');
var concat = require('gulp-concat'); 
var cat = require('gulp-cat');  
var addsrc = require('gulp-add-src');
var uglify = require('gulp-uglify');
let babel = require('gulp-babel');
// var uglify = require("uglify-js");
var replace = require('gulp-replace');
var less = require('gulp-less');
var base64 = require('gulp-base64');
var gulpSequence = require('gulp-sequence');
var exec  =require('child_process').exec;
var remoteSrc = require('gulp-remote-src');
var rev = require('gulp-rev-timestamp');
var replace = require('gulp-replace');

var del = require('del');

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

var header = require('gulp-header'),
    date = new Date(),
    pckg = require("./package.json"),
    version = pckg.version,
    headerComment = '/* Generated on:' + date + 
                    ' || version: '+ version+' - Altanai , License : MIT  */';

// gulp.task('clean', function(done) {
//   return Promise.all([
//     del(dist),
//     del(srcBundleJs)
//   ]);
// });

gulp.task('clean', function (done) {
  del.sync('dist');
  cone();
})

gulp.task('vendorjs',function(done) {
    vendorJsList=[ 
      "https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js",
      "https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"
    ]; 
    remoteSrc(vendorJsList, {base: null })
        // .pipe( rev({strict: true}) )
        .pipe(header(headerComment))
        .pipe(uglify())
        .pipe(concat('webrtcdevelopment_header.js'))  
        .pipe(gulp.dest(folderPath)); 
    done();
});

// gulp.task('screensharejs',function(done) {
//     console.log(" gulping screensharing  ");
//     list=[ 
//         "client/build/scripts/screensharing.js",
//     ]; 
//     console.log(list);
//     gulp.src(list)
//         .pipe(rev({strict: true}) )
//         .pipe(uglify())
//         .pipe(concat('webrtcdevelopment_screenshare.js'))  
//         .pipe(gulp.dest(folderPath+'minScripts/')); 
//     done();
// });

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

gulp.task('webrtcdevelopmentServer',function(done) {
    console.log(" gulping admin script  ");
    list=[ 
        "realtimecomm.js",
        "restapi.js"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe( rev({strict: true}) )
        .pipe(header(headerComment))
        .pipe(uglify())
        .pipe(concat('webrtcdevelopmentServer.js'))  
        .pipe(gulp.dest(folderPath)); 
    done();
});

gulp.task('drawjs',function(done) {
    console.log(" gulping drawjs  ");
    list=[ 
        "client/src/drawboard/common.js",
        "client/src/drawboard/decorator.js",
        "client/src/drawboard/draw-helper.js",
        "client/src/drawboard/drag-helper.js",
        "client/src/drawboard/pencil-handler.js",
        "client/src/drawboard/eraser-handler.js",
        "client/src/drawboard/line-handler.js",
        "client/src/drawboard/rect-handler.js",
        "client/src/drawboard/events-handler.js"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('drawBoardScript.js'))  
        .pipe(gulp.dest(folderPath)); 
    done();
});

gulp.task('drawcss',function(done) {
    console.log(" gulping main drawcss  ");
    list=[ "client/src/css/Style.css",
        "client/src/drawboard/drawing.css"
    ]; 
    console.log(list);
    gulp.src(list)
        // .pipe(uglify())
        .pipe(concat('drawBoardCss.css'))  
        .pipe(gulp.dest(folderPath)); 
    done();

});

gulp.task('codejs',function(done) {
    console.log(" gulping codejs  ");
    list=[ 
        "client/src/codemirror/lib/codemirror.js",
        "client/src/codemirror/addon/selection/active-line.js",
        "client/src/codemirror/addon/mode/loadmode.js",
        "client/src/codemirror/mode/meta.js",
        "client/src/codemirror/mode/javascript/javascript.js",
        "client/src/codemirror/codeStyles.js"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(uglify())
        .pipe(concat('codeEditorScript.js'))  
        .pipe(gulp.dest(folderPath));
    done(); 
});

gulp.task('codecss',function(done) {
    console.log(" gulping main codecss  ");
    list=[ 
        "client/src/codemirror/theme/mdn-like.css",
        "client/src/codemirror/lib/codemirror.css",
        "client/src/codemirror/style.css"
    ]; 
    console.log(list);
    gulp.src(list)
        .pipe(concat('codeEditorCss.css'))  
        .pipe(gulp.dest(folderPath)); 
    done();
});

var scriptList=[
    "client/src/scripts/_logger.js",
    "client/src/scripts/RTCM.js",
    // --------------------- helper libs
    "client/src/helperlibs/html2canvas.js",
    // "client/src/scripts/jszip.js"
    // "client/src/scripts/firebase.js",
    "client/src/scripts/head.js",
    "client/src/scripts/_init.js",
    // --------------------- dom modifiers
    "client/src/dommodifiers/_webcallviewmanager.js",
    "client/src/dommodifiers/_filesharingdommanager.js",
    "client/src/dommodifiers/_mediadommanager.js",
    "client/src/dommodifiers/_notify.js",
    // "client/src/scripts/_settings.js",
    // ---------------------- scripts
    "client/src/scripts/_screenshare.js",
    "client/src/scripts/_webrtcchecks.js",
    "client/src/scripts/FileBufferReader.js",
    "client/src/scripts/MediaStreamRecorder.js",
    "client/src/scripts/RecordRTC.js",
    "client/src/scripts/_snapshot.js",
    "client/src/scripts/_geolocation.js",
    "client/src/scripts/_chat.js",
    "client/src/scripts/_mediacontrol.js",
    "client/src/scripts/_record.js",
    "client/src/scripts/_screenrecord.js",
    "client/src/scripts/_filesharing.js",
    "client/src/scripts/_draw.js",
    "client/src/scripts/_redial.js",
    "client/src/scripts/_listenin.js",
    "client/src/scripts/_cursor.js",
    "client/src/scripts/_codeeditor.js",
    "client/src/scripts/_texteditor.js",
    "client/src/scripts/_turn.js",
    "client/src/scripts/_timer.js",
    "client/src/scripts/_stats.js",
    "client/src/scripts/_tracing.js",
    "client/src/scripts/_peerinfomanager.js",
    "client/src/scripts/_sessionmanager.js",
    "client/src/scripts/_exitmanager.js",
    "client/src/scripts/tail.js"
];

gulp.task('betawebrtcdevelopmentjs',function(done) {
    console.log(" gulping main webrtc development scripts into beta ");
    scriptList.push("client/src/scripts/admin.js");  
    console.log(scriptList);
    gulp.src(scriptList , {allowEmpty: true })
        // .pipe( rev({strict: true}) )
        .pipe(concat('webrtcdevelopment.js'))  
        .pipe(replace(/"use strict"/g, ''))
        .pipe(gulp.dest(folderPath))
    done(); 

});

// .pipe( rev({strict: true}) )
gulp.task('webrtcdevelopmentjs',function(done) {
    console.log(" gulping main webrtc development scripts ");
    scriptList.push("client/src/scripts/start.js");
    scriptList.push("client/src/scripts/admin.js");    
    console.log(scriptList);
    gulp.src(scriptList)
        .pipe(header(headerComment))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('webrtcdevelopment.js'))  
        .pipe(replace(/use strict/g, ''))
        .pipe(gulp.dest(folderPath));
        //.pipe(uglify()); 
    done();
});


gulp.task('mainstyle',function(done) {
    console.log(" gulping main stylesheets css  ");
    cssList=[ 
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css",
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css",
      "https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css",
      "https://www.gstatic.com/firebasejs/4.2.0/firebase.js"
    ]; 
    console.log(cssList);
    remoteSrc(cssList, {base: null })
        .pipe( rev({strict: true}) )
        .pipe(header(headerComment))
        .pipe(concat('webrtcdevelopment_header.css'))  
        .pipe(gulp.dest(folderPath));
    done(); 
});

gulp.task('webrtcdevelopmentcss',function(done) {
    console.log(" gulping custom stylesheets css  ");
    cssList=[
        "client/src/css/Style.css",
        "client/src/css/styles.css",
        "client/src/css/media.css",
        "client/src/css/chat.css",
        "client/src/css/cursor.css",
        "client/src/css/draw.css",
        "client/src/css/filesharing.css",
        "client/src/css/screenshare.css"
    ];
    console.log(cssList);
    gulp.src(cssList)
      //.pipe(uglify())
        .pipe( rev({strict: true}) )
        .pipe(header(headerComment))
        .pipe(concat('webrtcdevelopment.css'))
        .pipe(less().on('error', function(error) { console.error(error)}))
        .pipe(gulp.dest(folderPath));
    done();

});

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
        callback(stdout,stderr); 
    });
};

gulp.task('git_pull',function(cb){
  execute('git pull',function(resp) {
      cb();
  });
});

// gulp webrtc dev css and js along with server changes 
gulp.task('default', gulp.series(
    'betawebrtcdevelopmentjs',
    'webrtcdevelopmentcss',
    'webrtcdevelopmentServer'
));

// onlu gulp webrtcdev js changes 
gulp.task('develop', gulp.series(
    // 'vendorjs',
    // 'drawjs' , 
    // 'drawcss',
    // 'codejs',
    // 'codecss',
    'betawebrtcdevelopmentjs',
    // 'screensharejs',
    // 'mainstyle',
    // 'webrtcdevelopmentcss',
    // 'serverjs'

)); 

//gulp aall components to make it production ready
gulp.task('production', gulp.parallel(
    'clean',
    'vendorjs',
    'drawjs' , 
    'drawcss',
    'codejs',
    'codecss',
    'webrtcdevelopmentjs',
    /*'screensharejs',*/
    'mainstyle',
    'webrtcdevelopmentcss',
    'webrtcdevelopmentServer'
)); 