/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {
	grunt.config.set('uglify', {
		'dev': {
			'options': {
				'mangle': false,
				'beautify': true,
				'compress': false
			},
			'files': {
				'dist/assets/js/target/app.min.js': require('../pipeline').angularFiles.map(function(f) {
					return 'trans/'+f;
				})
			}
		},
		'prod': {
			'options': {
				'mangle': false,
				'beautify': false
			},
			'files': {
				'dist/assets/js/target/app.min.js': require('../pipeline').angularFiles.concat(['prod.js']).map(function(f) {
					return 'trans/'+f;
				})
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};
