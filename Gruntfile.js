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
		watch: {
			'src': {
				files: ['src/**/*.js', 'src/**/*.css'],
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
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['copy', 'uglify']);
	grunt.registerTask('test', ['copy']);
};