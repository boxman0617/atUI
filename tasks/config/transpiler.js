/**
 * Transpiles ES6 into ES5
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * 		https://github.com/sindresorhus/grunt-es6-transpiler
 */
module.exports = function(grunt) {

	grunt.config.set('es6transpiler', {
		'dev': {
			'files': [{
				'expand': true,
				'src': require('../pipeline').angularFiles,
				'dest': 'trans/'
			}],
			'options': {
				'disallowUnknownReferences': false,
				'disallowDuplicated': false,
				'environments': ['browser'],
				
			}
		},
		'prod': {
			'files': [{
				'expand': true,
				'src': require('../pipeline').angularFiles.concat(['prod.js']),
				'dest': 'trans/'
			}],
			'options': {
				'disallowUnknownReferences': false,
				'disallowDuplicated': false,
				'environments': ['browser'],
				
			}
		}
	});

	grunt.loadNpmTasks('grunt-es6-transpiler');
};
