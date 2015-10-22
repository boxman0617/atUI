/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

	grunt.config.set('copy', {
		'dev': {
			'files': [
				{
					'expand': true,
					'src': ['apps/**/*.html', 'core/**/*.html'],
					'dest': 'dist/assets/templates/'
				}
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
