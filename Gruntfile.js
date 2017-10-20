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
		/*uglify: {
			'js': {
				src: ['public/js/interaction.js'],
				dest: 'public/js/interaction.min.js'
			}
		},
		cssmin: {
			'css': {
				src: ['public/css/style.css'],
				dest: 'public/css/style.min.css'
			}
		},*/
		watch: {
			'js' : {
				files: ['public/js/*.js', '!public/js/interaction*.js'],
				tasks: ['concat:js', 'uglify:js']
			},
			'css' : {
				files: ['public/less/**/*.less'],
				tasks: ['less', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	/*grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');*/

	/*grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);*/
	grunt.registerTask('default', ['copy']);
};