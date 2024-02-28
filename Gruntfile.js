module.exports = function (grunt) {
	const sass = require('node-sass');
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
				outputStyle: 'expanded',
				indentType: 'tab',
				sourceMap: false
			},
			build: {
				files: {
					'src/content_scripts/inject.css': 'styles/inject.scss'
				}
			}
		},
		clean: {
			'build' : ['dist/', 'memefy-this.zip'],
			'dev' : ['dist/']
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
		zip: {
			'using-cwd': {
				cwd: 'dist/',
				src: ['dist/**'],
				dest: 'memefy-this.zip'
			}
		},
		uglify: {
			'js': {
				expand: true,
				cwd: 'dist',
				src: ['**/*.js'],
				dest: 'dist/'
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

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['clean:build', 'sass', 'copy', 'uglify', 'zip']);
	grunt.registerTask('dev', ['clean:dev', 'sass', 'copy', 'watch']);
};