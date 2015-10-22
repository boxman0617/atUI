(function() {
	angular.module('atUI').directive('undoBox', ['UndoService', function(UndoService) {
		return {
			'restrict': 'A',
			'template': '<div id="undo" style="display: none;">{{message}}. If it was a mistake click <a href="" ng-click="undoNow()" class="undo-trigger">here</a> to undo.<div class="dismiss"><a ng-click="dismissNow()" href="" title="Click here to dismiss"><i class="fa fa-times"></i></a></div></div>',
			'controller': function($scope, $element) {
				var ref = this;
				var defaultMessage = 'Nice! Your action completed successfully';
				UndoService.on('show', function(message) {
					message = message || defaultMessage;
					$scope.message = message;
					ref.openMessage.apply(ref, [message]);
				});
				UndoService.on('hide', function() {
					ref.closeMessage.apply(ref, []);
				});

				this.openMessage = function() {
					$element.find('#undo').css({
						'display': 'block',
						'opacity': 0
					});
					$element.find('#undo').animate({
						'opacity': 1
					}, 1000);
				};

				this.closeMessage = function() {
					UndoService.cancelTimeout();
					$element.find('#undo').css({
						'display': 'block',
						'opacity': 1
					});
					$element.find('#undo').animate({
						'opacity': 0
					}, 1000, function() {
						$(this).css({
							'display': 'none'
						});
						$scope.message = defaultMessage;
					});
				};

				$scope.undoNow = function() {
					UndoService.runLastAction(function() {
						ref.closeMessage();
					});
				};

				$scope.dismissNow = function() {
					UndoService.clearLastAction();
					ref.closeMessage();
				};
			}
		};
	}]);
})();