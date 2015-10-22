module.exports = function (grunt) {
	grunt.registerTask('prod', [
		'clean:dev',
		'es6transpiler:prod',
		'uglify:prod',
		'less:prod',
		'copy:dev',
		'clean:trans',
		'linkAssets'
	]);
};