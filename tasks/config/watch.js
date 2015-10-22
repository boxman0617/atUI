/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `src` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

	grunt.config.set('watch', {
		'less': {
			'files': ['less/**/*.less'],
			'tasks': ['less:dev'],
			'options': {
				'spawn': false
			}
		},
		'uglify': {
			'files': require('../pipeline').angularFiles,
			'tasks': ['es6transpiler:dev', 'uglify:dev', 'clean:trans'],
			'options': {
				'spawn': false
			}
		},
		'templates': {
			'files': ['apps/**/*.html', 'core/**/*.html'],
			'tasks': ['clean:templates', 'copy:dev'],
			'options': {
				'spawn': false
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};
