module.exports = function (grunt) {
	grunt.registerTask('prodWatch', [
		'uglify:prod',
		'less:prod'
	]);
};