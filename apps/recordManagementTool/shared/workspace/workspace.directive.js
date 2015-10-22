(function() {
	angular.module('atUI').directive('workspace', ['$log', '$timeout', function($log, $timeout) {
		return {
			'restrict': 'A',
			'link': function(scope, el) {
				el.find('.workspace-panel').each(function(i, panel) {
					if(panel.id !== scope.currentPanel) {
						$(panel).css({
							'display': 'none'
						});
					}
				});

				scope.$watch('currentPanel', function(newValue, oldValue) {
					if(newValue !== oldValue) {
						el.css({
							'height': el.height(),
							'overflow': 'hidden'
						});

						var $oldPanel = $('#'+oldValue);
						$oldPanel.addClass('workspace-panel-leave');
						$timeout(function() {
							$oldPanel.css({
								'display': 'none'
							});
							$oldPanel.removeClass('workspace-panel-leave');
						}, 1000);

						var $newPanel = $('#'+newValue);
						$newPanel.addClass('workspace-panel-enter');
						$newPanel.css({
							'display': 'block'
						});
						$timeout(function() {
							$newPanel.removeClass('workspace-panel-enter');
						}, 1000);
					}
				});
			}
		};
	}]);
})();