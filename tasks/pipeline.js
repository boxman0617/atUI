/**
 * grunt/pipeline.js
 *
 * The order in which your css and javascript files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */

// CSS files to inject in order
var cssFilesToInject = [
	'bower_components/bootstrap/dist/css/bootstrap.min.css',
	'deps/bootstrap-theme.min.css',
	'bower_components/font-awesome/css/font-awesome.min.css',
	'deps/ng-tags-input.min.css',
	'deps/ng-tags-input.bootstrap.min.css',
	'deps/bootstrap-datepicker.min.css',
	'deps/hotkeys.min.css',
	'bower_components/dropzone/downloads/css/basic.css',
	'bower_components/angular-chart.js/dist/angular-chart.min.css'
];

// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
	'bower_components/jquery/jquery.min.js',
	'bower_components/jquery-ui/jquery-ui.min.js',
	'bower_components/bootstrap/dist/js/bootstrap.min.js',
	'bower_components/jquery-knob/dist/jquery.knob.min.js',
	'bower_components/moment/min/moment.min.js',
	'bower_components/jquery.transit/jquery.transit.js',
	'bower_components/chance/chance.js',
	'bower_components/fuzzy/fuzzy-min.js',
	'bower_components/simpleStorage/simpleStorage.js',
	'bower_components/gsap/src/minified/TweenMax.min.js',
	'bower_components/dropzone/downloads/dropzone.min.js',
	'deps/bootstrap-select.js',
	'deps/md5.min.js',
	'deps/IDBWrapper.min.js',
	'deps/bootstrap-datepicker.min.js',
	'bower_components/Chart.js/Chart.min.js',
	// ANGULARJS
	'bower_components/angular/angular.min.js',
	'bower_components/angular-animate/angular-animate.min.js',
	'bower_components/angular-route/angular-route.min.js',
	'bower_components/angular-cookies/angular-cookies.js',
	'bower_components/angular-knob/src/angular-knob.js',
	'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
	'bower_components/angular-moment/angular-moment.min.js',
	'bower_components/angular-sanitize/angular-sanitize.min.js',
	'bower_components/ngFX/dist/ngFx.min.js',
	'deps/xeditable.min.js',
	'deps/ng-tags-input.min.js',
	'deps/hotkeys.min.js',
	'bower_components/angular-jwt/dist/angular-jwt.min.js',
	'bower_components/angular-dropzone/lib/angular-dropzone.js',
	'bower_components/jsdiff/diff.min.js',
	'bower_components/angular-chart.js/dist/angular-chart.min.js'
];

var jsIEFilesToInject = [
	'deps/excanvas.js'
];

var jsIE8FilesToInject = [
	'deps/respond.min.js',
	'deps/json.js'
];

module.exports.cssFilesToInject = cssFilesToInject;
module.exports.jsFilesToInject = jsFilesToInject;
module.exports.jsIEFilesToInject = jsIEFilesToInject;
module.exports.jsIE8FilesToInject = jsIE8FilesToInject;

module.exports.angularFiles = [
	'init.js',
	'core/**/*.js',
	'apps/**/*.js'
];