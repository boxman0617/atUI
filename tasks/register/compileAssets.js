module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'es6transpiler:dev',
		'uglify:dev',
		'clean:trans',
		'less:dev',
		'copy:dev'
	]);
};