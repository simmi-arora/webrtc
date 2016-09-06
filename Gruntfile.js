module.exports = function(grunt) {

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