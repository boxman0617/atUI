/**
 * Compiles LESS files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {

	grunt.config.set('less', {
		'dev': {
			'options': {
				'compress': false,
				'cleancss': true
			},
			'files': [{
				'src': 'less/main.less',
				'dest': 'dist/assets/css/target/main.css'
			}]
		},
		'prod': {
			'options': {
				'compress': true,
				'cleancss': true
			},
			'files': [{
				'src': 'less/main.less',
				'dest': 'dist/assets/css/target/main.css'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
