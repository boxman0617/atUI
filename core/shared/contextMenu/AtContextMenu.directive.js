(function() {
	var app = angular.module('atCore');

	app.directive('atContextMenu', ['$document', 'ContextMenuService', function($document, ContextMenuService) {
		return {
			'templateUrl': 'assets/templates/core/shared/contextMenu/atcontextmenu.template.html',
			'controller': function($scope, $element) {
				var _toggleMenu,
					_setInitLocation,
					_getContextMenuDOM;

				$scope.showMenu = false;
				$scope.items = [];

				$scope.fire = function(item) {
					item.fireAction();
					_toggleMenu();
				};

				ContextMenuService.onSummon(function($event) {
					_toggleMenu($event);
				});

				_toggleMenu = function($event) {
					$scope.showMenu = !$scope.showMenu;
					if($scope.showMenu) {
						_setInitLocation($event);
					} else {
						$document.off('click');
						$('#stage').off('scroll');
					}
				};

				_getContextMenuDOM = function() {
					return $element.find('.context-menu');
				};

				_setInitLocation = function($event) {
					var $main = _getContextMenuDOM();
					_fillItems();

					$main.css({
						'top': $event.pageY + 5,
						'left': $event.pageX + 5
					});
					$document.on('click', function() {
						$scope.$apply(function() {
							_toggleMenu();
						});
					});
					$('#stage').on('scroll', function() {
						$scope.$apply(function() {
							_toggleMenu();
						});
					});
				};

				_fillItems = function() {
					$scope.items = ContextMenuService.getItems();
				};
			}
		};
	}]);

})();