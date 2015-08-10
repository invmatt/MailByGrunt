/**
 * MailByGrunt
 */

module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // CLIENT SETTINGS
        // These are used to set the FTP upload location/DIST folder name, and email address for grunt send
        settings: {
        	name: 'CLIENTNAME',
        	email: 'EMAILADDRESS'
        },

        // GENERAL PATHS
        // You shouldn't need to edit these
        paths: {
            //where to store built files
            dist: 'dist',
            //sources
            src: 'src',
            //where json files are stored
            data: '<%= paths.src %>/data',
            //temporary files
            tmp: 'tmp',
            //pattern to HTML email files
            email: '*.html'
        },


        /**
         * Cleanup Tasks (used internally)
         * ===============================
         */
        clean: {
            all: ['dist*', '<%= paths.tmp %>']
        },


        /**
         * Copy files Tasks (used internally)
         * ===============================
         */
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/images',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.dist %>/images'
                }]
            },
            dist: {
            	images: {
	                files: [{
	                    expand: true,
	                    cwd: '<%= paths.src %>/images',
	                    src: ['**/*.{gif,png,jpg}'],
	                    dest: '<%= paths.dist %>/images'
	                }]
            	}
            }
        },


        /**
         * SCSS Compilation Tasks (used internally)
         * ===============================
         */
        compass: {

            options: {
                //default options for development and watch environment
                //accepts some compass command line option
                //see https://github.com/gruntjs/grunt-contrib-compass
                config: path.normalize(__dirname + '/vendor/compass-config.rb'),
                cssDir: '<%= paths.src %>/css',
                imagesDir: '<%= paths.src %>/images'
            },

            watch: {
                options: {
                    watch: true
                }
            },

            dev: {
            	cssDir: '<%= paths.src %>/css'
            },

            dist: {
                options: {
                    cssDir: '<%= paths.dist %>/css',
                    imagesDir: '<%= paths.dist %>/images',
                    force: true,
                    environment: 'production'
                }
            }
        },


        /**
         * Static EJS Render Tasks (used internally)
         * ===============================
         */
        render: {
            options: {
                data: ['<%= paths.data %>/*.json'],
            },

            html: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/'
                }]
            }
        },

        /**
         * Environment Related Tasks (used internally)
         * ===============================
         */
        preprocess: {
            options: {
                inline: true
            },
            dev: {
                src: ['<%= paths.tmp %>/<%= paths.email %>']
            },
            dist: {
                options: {
                    context: {
                        PRODUCTION: true
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/'
                }]
            }
        },

        /**
         * Premailer Parser Tasks (used internally)
         * ===============================
         */
        premailer: {
            options: {
                preserveStyles: true
            },

            dist_html: {
                options: {
                    css: ['<%= paths.dist %>/css/*.css'],
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/'
                }]

            },
            dist_txt: {
                options: {
                    //baseUrl: '<%= hosts.production.url %>/',
                    mode: 'txt'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/',
                    ext: '.txt'
                }]

            },

            dev_html: {
                options: {
                    css: ['<%= paths.tmp %>/css/*.css'],
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/'
                }]
            },
            dev_txt: {
                options: {
                    mode: 'txt'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/',
                    ext: '.txt'
                }]
            }
        },

		'sftp-deploy': {
		  build: {
		    auth: {
		      host: 'YOURHOSTNAME',
		      port: 22,
		      authKey: 'key1'
		    },
		    src: 'dist/images',
		    dest: '/var/www/YOUR-PATH-HERE/<%= settings.name %>',
		    server_sep: '/'
		  }
		},

		replace: {
			remote: {
				src: ['<%= paths.dist %>/*.html'],
				dest: '<%= paths.dist %>/<%= settings.name %>/',
				replacements: [
					{
						// Fixes background image path issue
						from: '../',
						to: ''
					},
					{
						from: 'images/',
						to: 'http://yourdomain.com/clientname/<%= settings.name %>/'
					},
					{
						from: '<link rel="stylesheet" type="text/css" href="css/style.css"/>',
						to: '<!-- Removed stylesheet -->'
					}
				]
			},
			local: {
				src: ['<%= paths.dist %>/*.html'],
				dest: '<%= paths.dist %>/<%= settings.name %>/',
				replacements: [
					{
						from: '<link rel="stylesheet" type="text/css" href="css/style.css"/>',
						to: ' '
					}
				]
			}
		},

        nodemailer: {

            options: {
                transport: grunt.file.readJSON('config/nodemailer-transport.json'),

                message: {
                    from: '<MailByGrunt> mailbygrunt@local.com'
                },


                // HTML and TXT email
                // A collection of recipients
                recipients: [
	                {
	                    email: '<%= settings.email %>',
	                    name: 'MailByGrunt',
	                }
                ]
            },

            dist: {
                src: ['<%= paths.dist %>/<%= settings.name %>/<%= paths.email %>']
            },

            send: {
                src: ['<%= paths.dist %>/<%= settings.name %>/<%= paths.email %>']
            },

            dev: {
                src: ['<%= paths.dist %>/<%= settings.name %>/<%= paths.email %>']
            }

        },


        /**
         * Watch Tasks (used internally)
         * ===============================
         */
        watch: {
            html: {
                files: ['<%= paths.src %>/<%= paths.email %>', '<%= paths.src %>/inc/**/*.html', '<%= paths.data %>'],
                tasks: ['render', 'preprocess:dev']
            },
            images: {
                files: ['<%= paths.src %>/images/**/*.{gif,png,jpg}'],
                tasks: ['copy:images']
            }
        },

        /**
         * Concurrent Task (used internally)
         * ===============================
         */
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['watch', 'compass:watch']
        },

    });

    grunt.registerTask('default', 'dev');

    //(used internally)
    grunt.registerTask('base_dev', [
        'clean',
        'copy',
        'compass:dev',
        'render',
        'preprocess:dev'
    ]);


    grunt.registerTask('dev', [
        'base_dev',
        'concurrent'
    ]);
    
    grunt.registerTask('local', [
        'clean',
        'copy',
        'compass:dist',
        'render',
        'preprocess:dist',
        'premailer:dist_html',
        'premailer:dist_txt',
        'replace:local'
    ]);


    grunt.registerTask('dist', [
        'clean',
        'copy',
        'compass:dist',
        'render',
        'preprocess:dist',
        'premailer:dist_html',
        'premailer:dist_txt',
        'sftp-deploy',
        'replace:remote'
    ]);

    grunt.registerTask('send', 'Simulates an email delivery.', function() {
        grunt.task.run([
	        'clean',
	        'copy',
	        'compass:dist',
	        'render',
	        'preprocess:dist',
	        'premailer:dist_html',
	        'premailer:dist_txt',
	        'sftp-deploy',
	        'replace',
            'nodemailer:dist'
        ]);
    });

};
