(function() {
	var app = angular.module('atCore');
	
	app.directive('listBoxFullHeight', [function() {
		return {
			'require': 'listBox',
			'terminal': true,
			'link': function(scope, element, attrs) {
				
				var sizeUp = function() {
					var stage_height = $('#stage').height();
					var wrapper_bottom = parseInt($('#stage .wrapper').css('padding-bottom'));
					var $mgma = $('#mgma');
					var toolbar_height = $mgma.find('.toolbar').height() + 
						(parseInt($mgma.find('.toolbar').css('padding-top')) * 2) + 
						parseInt($mgma.find('.toolbar').css('border-bottom-width'));
					var mgma_stage_top = parseInt($mgma.find('.mgma-stage').css('padding-top'));
					var element_height = stage_height - (wrapper_bottom + toolbar_height + mgma_stage_top);

					element.css({'height': element_height});

					element.find('.list-viewer-wrapper').css({
						'height': function() {
							var pad = (parseInt(element.css('padding-top')) + parseInt(element.css('border-top-width'))) * 2;
							return element_height - pad - element.find('.list-viewer-toolbar').height() - parseInt($(this).css('margin-top'));
						}
					});
				};
				
				sizeUp();
				
				scope.$on('list-box-redo-full-height', function() {
					sizeUp();
				});
			}
		};
	}]);
})();