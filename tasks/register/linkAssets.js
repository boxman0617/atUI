module.exports = function (grunt) {
	grunt.registerTask('linkAssets', [
		'linker:devJs',
		'linker:devJsIE',
		'linker:devJsIE8',
		'linker:devCss'
	]);
};