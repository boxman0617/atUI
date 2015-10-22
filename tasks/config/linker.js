/**
 * Autoinsert script tags (or other filebased tags) in an html file.
 *
 * ---------------------------------------------------------------
 *
 * Automatically inject <script> tags for javascript files and <link> tags
 * for css files.  Also automatically links an output file containing precompiled
 * templates using a <script> tag.
 *
 */

var util = require('util');
var path = require('path');

module.exports = function(grunt) {

	grunt.config.set('linker', {
		'devJs': {
			'files': {
				'dist/assets/js/dep': require('../pipeline').jsFilesToInject
			}
		},
		'devJsIE': {
			'options': {
				'startTag': '<!-- LINK:JS:IE:START -->',
				'endTag': '<!-- LINK:JS:IE:END -->',
				'tmpl': '<!--[if IE]><script type="text/javascript" src="%s"></script><![endif]-->'
			},
			'files': {
				'dist/assets/js/dep': require('../pipeline').jsIEFilesToInject
			}
		},
		'devJsIE8': {
			'options': {
				'startTag': '<!-- LINK:JS:IE8:START -->',
				'endTag': '<!-- LINK:JS:IE8:END -->',
				'tmpl': '<!--[if lte IE 8]><script type="text/javascript" src="%s"></script><![endif]-->'
			},
			'files': {
				'dist/assets/js/dep': require('../pipeline').jsIE8FilesToInject
			}
		},
		'devCss': {
			'options': {
				'startTag': '<!-- LINK:CSS:START -->',
				'endTag': '<!-- LINK:CSS:END -->',
				'tmpl': '<link rel="stylesheet" href="%s">',
				'as': 'assets/css/dep'
			},
			'files': {
				'dist/assets/css/dep': require('../pipeline').cssFilesToInject
			}
		}
	});

	grunt.registerMultiTask('linker', 'Autoinsert asset tags in an html file.', function() {
		var options = this.options({
			'startTag': '<!-- LINK:JS:START -->',
			'endTag': '<!-- LINK:JS:END -->',
			'tmpl': '<script src="%s"></script>',
			'injectFile': 'dist/index.html',
			'as': 'assets/js/dep'
		});

		this.files.forEach(function(f) {
			var scripts,
				page = '',
				newPage = '',
				start = -1,
				end = -1;

			scripts = f.src.filter(function(filePath) {
				if(!grunt.file.exists(filePath)) {
					grunt.log.warn('File not found ['+filePath+']');
					return false;
				}
				return true;
			});

			scripts = scripts.map(function(filePath) {
				var _newPath = f.dest + '/' + path.basename(filePath);
				var _asPath = options.as + '/' + path.basename(filePath);
				grunt.file.write(_newPath, grunt.file.read(filePath));
				grunt.log.writeln('Moving: ['+filePath+'] => ['+_newPath+']');
				return util.format(options.tmpl, _asPath);
			});

			page = grunt.file.read(options.injectFile);
			start = page.indexOf(options.startTag);
			end = page.indexOf(options.endTag, start);

			if(start === -1 || end === -1 || start >= end) {
				grunt.log.warn('Injection tags are not set correctly!');
				return;
			} else {
				var padding = '';
				var ind = start - 1;
				while(/[^\S\n]/.test(page.charAt(ind))) {
					padding += page.charAt(ind);
					ind -= 1;
				}
				newPage = page.substr(0, start + options.startTag.length) 
					+ grunt.util.linefeed 
					+ padding 
					+ scripts.join(grunt.util.linefeed + padding) 
					+ grunt.util.linefeed 
					+ padding 
					+ page.substr(end);

				grunt.file.write(options.injectFile, newPage);
				grunt.log.writeln('File ['+options.injectFile+'] updated.').ok();
			}
		});
	});
};
