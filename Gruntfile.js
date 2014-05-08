// Generated on 2014-03-28 using generator-webapp 0.4.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        config: {
            // Configurable paths
            app: 'app',
            dist: 'dist'
        },

        uglify: {
          options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'build/app.min.js': ['<%= concat.dist.dest %>']
            }
          }
        },

        react: {
            files: {
              expand: true,
              cwd: 'build/',
              src: ['app.jsx'],
              dest: 'build/',
              ext: '.js'
            }
          },

        copy:{
          html: {
            src: 'src/index.html', dest: 'build/index.html'
          },
          images: {
            src: 'images/*', dest: 'build/', cwd: 'src/', expand: true
          }
        },

        useminPrepare: {
          html: 'src/index.html',
          options: {
            dest: 'build'
          }
        },

        usemin: {
          html: ['build/{,*/}*.html'],
          css: ['build/{,*/}*.css'],
          options: {
            assetsDirs: ['build']
          }
        },

        cssmin: {
          minify: {
            expand: true,
            cwd: 'src',
            src: ['app.css',  '!*.min.css'],
            dest: 'build',
            ext: '.min.css'
          }
        },

        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          dist: {
            // the files to concatenate
            src: ['build/app.js'],
            // the location of the resulting JS file
            dest: 'build/app.js'
          }
        },

        browserify: {
          js: {
            // A single entry point for our app
            src: 'src/main.js',
            // Compile to a single file to add a script tag for in your HTML
            dest: 'build/app.jsx',
          },
          options: {
            transform:  [ require('grunt-react').browserify ],
            external: ['_', 'React']
          }
        },

        watch: {
          options: {
            livereload: true,
            interrupt: true
          },
          css: {
            files: 'src/*.scss',
            tasks: ['build'],
          },
          scripts: {
            files: ['src/**/*.js', 'src/**/*.jsx'],
            tasks: ['build'],
          },
          html: {
            files: 'src/*.html',
            tasks: ['build'],
          }
        },

        connect: {
          options: {
            port: 9000,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',
            livereload: 35729
          },
          livereload: {
            options: {
              open: true,
              base: [
                'build'
              ]
            }
          }
        },

        sass: {
          dist: {
            files: {
              'src/app.css': 'src/app.scss'
            }
          }
        },

        rsync: {
          options: {
            args: ["--verbose"],
            exclude: [".git*", ".module-cache/**", "node_modules", "robots.txt", ".htaccess", ".bowerrc", "bower.json", "package.json", "sshsettings.json", "Gruntfile.js", ".DS_Store", "bower_components/**"],
            recursive: true
          },
          prod: {
            options: {
              src: "./build/",
              dest: "/home/dhenein/public_html/labs/loop-mvp-spec/",
              host: "people",
              syncDestIgnoreExcl: true
            }
          }
        },

        clean: ['build']

    });


    grunt.registerTask('build', ['clean', 'browserify', 'react', 'sass', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin']);
    grunt.registerTask('deploy', ['build', 'rsync:prod']);
    grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);

};
