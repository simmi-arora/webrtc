'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: 'grunt-*',
        config: 'package.json',
        scope: 'devDependencies'
    });

    var versionNumber = grunt.file.readJSON('package.json').version;

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
      
        jshint: {
            files: ['Gruntfile.js', 'client/build/minSscripts/start.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },

        copy: {
          main: {
            files: [
                // includes files within path and its sub-directories
                {expand: true, src: ['client/build/minScripts/**'], dest: 'client/prod/minScripts/'},
                {expand: true, src: ['client/build/api/**'], dest: 'client/prod/api/'},
            ],
          },
        },


        dist: {
            src: [
                'dev/head.js',

                'dev/SocketConnection.js', // You can replace it with: FirebaseConnection.js || PubNubConnection.js
                'dev/MultiPeersHandler.js',

                // 'dev/adapter.js', ---- optional
                'dev/DetectRTC.js',
                'dev/globals.js',

                'dev/ios-hacks.js', // to support ios
                'dev/RTCPeerConnection.js',
                'dev/CodecsHandler.js', // to force H264 or codecs other than opus

                'dev/OnIceCandidateHandler.js',
                'dev/IceServersHandler.js',

                'dev/getUserMedia.js',
                'dev/StreamsHandler.js',

                'dev/Screen-Capturing.js',

                'dev/TextSenderReceiver.js',
                'dev/FileProgressBarHandler.js',

                'dev/TranslationHandler.js',

                'dev/RTCMultiConnection.js',
                'dev/tail.js'
            ],
            dest: 'client/src/scripts/RTCMultiConnection_new.js',
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint','uglify']);
    grunt.registerTask('production', ['jshint','uglify','copy']);
};