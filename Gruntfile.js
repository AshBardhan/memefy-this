module.exports = function (grunt) {
	const sass = require('node-sass');
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
				sourceMap: true
			},
			dist: {
				files: {
					'src/content_scripts/inject.css': 'styles/inject.scss'
				}
			}
		},
		copy: {
			'folders': {
				src: ['src/**', '_locales/**', 'icons/**'],
				dest: 'dist/'
			},
			'files': {
				src: ['manifest.json'],
				dest: 'dist/'
			}
		},
		uglify: {
			'js': {
				expand: true,
				cwd: 'dist/src',
				src: ['**/*.js'],
				dest: 'dist/src'
			}
		},
		zip: {
			'using-cwd': {
				cwd: 'dist/',
				src: ['dist/**'],
				dest: 'memefy-this.zip'
			}
		},
		watch: {
			'src': {
				files: ['src/**'],
				tasks: ['copy:folders']
			},
			'sass': {
				files: ['styles/**'],
				tasks: ['sass']
			},
			'manifest': {
				files: ['manifest.json'],
				tasks: ['copy:files']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['sass', 'copy', 'uglify', 'zip']);
	grunt.registerTask('test', ['sass', 'copy', 'watch']);
};