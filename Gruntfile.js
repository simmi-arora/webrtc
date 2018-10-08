"use strict";

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: 'grunt-*',
        config: 'package.json',
        scope: 'devDependencies'
    });

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        
        concat: {
            options: {
                stripBanners: true,
                separator: '\n',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },

            dist1: {
                src: [
                    'client/src/scripts/rtcconn/head.js',

                    'client/src/scripts/rtcconn/SocketConnection.js', // You can replace it with: FirebaseConnection.js || PubNubConnection.js
                    'client/src/scripts/rtcconn/MultiPeersHandler.js',

                    // 'client/src/scripts/rtcconn/adapter.js', ---- optional
                    // 'client/src/scripts/rtcconn/DetectRTC.js',
                    'client/src/scripts/rtcconn/globals.js',

                    'client/src/scripts/rtcconn/ios-hacks.js', // to support ios
                    'client/src/scripts/rtcconn/RTCPeerConnection.js',
                    'client/src/scripts/rtcconn/CodecsHandler.js', // to force H264 or codecs other than opus

                    'client/src/scripts/rtcconn/OnIceCandidateHandler.js',
                    'client/src/scripts/rtcconn/IceServersHandler.js',

                    'client/src/scripts/rtcconn/getUserMedia.js',
                    'client/src/scripts/rtcconn/StreamsHandler.js',

                    'client/src/scripts/rtcconn/Screen-Capturing.js',

                    'client/src/scripts/rtcconn/TextSenderReceiver.js',
                    'client/src/scripts/rtcconn/FileProgressBarHandler.js',

                    'client/src/scripts/rtcconn/TranslationHandler.js',

                    'client/src/scripts/rtcconn/RTCMultiConnection.js',
                    'client/src/scripts/rtcconn/tail.js'
                ],
                dest: 'client/src/scripts/RTCMultiConnection_custom.js',
            },


            dist2: {
                src: [
                    "client/src/scripts/_init.js",
                    "client/src/scripts/_notify.js",
                    //"client/src/scripts/RTCMultiConnection_custom.js",
                    "client/src/scripts/DetectRTC.js",
                    "client/src/scripts/RTCMultiConnection.js",
                    "client/src/scripts/_screenshare.js",
                    "client/src/scripts/_detectRTC.js",
                    "client/src/scripts/_webrtcchecks.js",
                    "client/src/scripts/_settings.js",
                    "client/src/scripts/firebase.js",
                    "client/src/scripts/FileBufferReader.js",
                    "client/src/scripts/MediaStreamRecorder.js",
                    "client/src/scripts/RecordRTC.js",
                    "client/src/scripts/screenshot.js",
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
                    "client/src/scripts/jszip.js",
                    "client/src/scripts/start.js",
                ],
                dest: 'client/build/webrtcdevelopment.js',
            }
        },

        // uglify: {
        //     options: {
        //         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //     },
        //     build: {
        //         src: 'src/<%= pkg.name %>.js',
        //         dest: 'build/<%= pkg.name %>.min.js'
        //     }
        // },
      
        jshint: {
            files: ['Gruntfile.js', 'client/src/scripts/start.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                },
                "esversion": 6
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },

        // copy: {
        //   main: {
        //     files: [
        //         // includes files within path and its sub-directories
        //         {expand: true, src: ['client/build/minScripts/**'], dest: 'client/prod/minScripts/'},
        //         {expand: true, src: ['client/build/api/**'], dest: 'client/prod/api/'},
        //     ],
        //   },
        // },

        // replace: {
        //     dist: {
        //         options: {
        //             patterns: [{
        //                 json: {} //grunt.file.readJSON('config.json')
        //             }, {
        //                 match: 'version',
        //                 replacement: versionNumber
        //             }]
        //         },
        //         files: [{
        //             expand: true,
        //             flatten: true,
        //             src: ['./temp/RTCMultiConnection.js'],
        //             dest: './'
        //         }]
        //     }
        // },

        // clean: ['./temp', 'RTCMultiConnection.js'],
        
        uglify: {
            // options: {
            //     mangle: false,
            //     banner: banner
            // },
            // options: {
            //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            // },
            build: {
                src: 'client/build/webrtcdevelopment.js',
                dest: 'client/build/webrtcdevelopment.min.js'
            }
        },
        
        // copy: {
        //     main: {
        //         options: {
        //             flatten: true
        //         },
        //         files: {
        //             'dist/RTCMultiConnection.js': ['RTCMultiConnection_custom.js']
        //         },
        //     },
        // }

        release: {
            options: {
              bump: true, //default: true
              changelog: true, //default: false
              changelogText: '<%= version %>\n', //default: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
              file: 'package.json', //default: package.json
              add: true, //default: true
              commit: true, //default: true
              tag: false, //default: true
              push: true, //default: true
              pushTags: false, //default: true
              npm: true, //default: true
              npmtag: false, //default: no tag
              indentation: '\t', //default: '  ' (two spaces)
              //folder: 'folder/to/publish/to/npm', //default project root
              tagName: 'some-tag-<%= version %>', //default: '<%= version %>'
              commitMessage: 'check out my release <%= version %>', //default: 'release <%= version %>'
              tagMessage: 'tagging version <%= version %>', //default: 'Version <%= version %>',
              beforeBump: [], // optional grunt tasks to run before file versions are bumped
              afterBump: [], // optional grunt tasks to run after file versions are bumped
              beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
              afterRelease: [], // optional grunt tasks to run after release is packaged
              updateVars: [], // optional grunt config objects to update (this will update/set the version property on the object specified)
              github: {
                apiRoot: 'https://github.com', // Default: https://github.com
                repo: 'altanai/webrtc', //put your user/repo here
                accessTokenVar: 'GITHUB_ACCESS_TOKE', //ENVIRONMENT VARIABLE that contains GitHub Access Token
         
                // Or you can use username and password env variables, we discourage you to do so
                usernameVar: 'GITHUB_USER', //ENVIRONMENT VARIABLE that contains GitHub username
                passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains GitHub password
              }
            }
          }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-publish');
    grunt.loadNpmTasks('grunt-release');


    // Default task(s).
    grunt.registerTask('dev', ['concat','jshint','uglify']);
    // grunt.registerTask('production', ['jshint','uglify','copy']);
    grunt.registerTask('production', ['concat','uglify','copy']);
    grunt.registerTask('default', ['concat']);
    grunt.registerTask('release', ['release']);
    // grunt.registerTask('rtcconn', ['concat', 'replace', 'jsbeautifier', 'uglify', 'copy', 'clean']);
};