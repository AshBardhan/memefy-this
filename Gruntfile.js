module.exports = function (grunt) {
	grunt.initConfig({
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

	grunt.registerTask('build', ['copy', 'uglify', 'zip']);
	grunt.registerTask('test', ['copy', 'watch']);
};