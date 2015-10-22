/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to clean out before recompile.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = function(grunt) {

	grunt.config.set('clean', {
		'dev': [
			'dist/assets/templates/*',
			'dist/assets/js/dep/*',
			'dist/assets/css/dep/*'
		],
		'templates': [
			'dist/assets/templates/*'
		],
		'trans': [
		    'trans/*', '!trans/.gitkeep'
		]
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
};
