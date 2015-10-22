(function() {
	var app = angular.module('atCore');
	
	app.directive('atModal', ['ModalService', function(ModalService) {
		return {
			'templateUrl': 'assets/templates/core/shared/modal/modal.html',
			'scope': {
				'modalId': '@',
				'modalSize': '@'
			},
			'transclude': true,
			'controller': function($scope, $element) {
				ModalService.register($scope.modalId, function() {
					$element.find('.modal').modal();
				});
				
				$scope.$on('$destroy', function() {
					ModalService.unregister($scope.modalId);
				});
			}
		};
	}]);
	
	class ModalService {
		constructor() {
			this._setupScope();
			this._init();
		}
		
		_setupScope() {
			
		}
		
		_init() {
			this._modals = [];
		}
		
		register(id, openCb) {
			var modal = {
				'id': id,
				'summon': openCb
			};
			this._modals.push(modal);
		}
		
		unregister(id) {
			for(let i in this._modals) {
				if(id === this._modals[i].id) {
					this._modals.splice(i, 1);
					return;
				}
			}
		}
		
		summon(id) {
			var modal = null;
			for(let m of this._modals) {
				if(id === m.id) {
					modal = m;
					break;
				}
			}
			
			if(modal === null) {
				throw new Exception('No Modal registered under ['+id+']');
			}
			
			modal.summon.apply(null, []);
		}
	}
	
	app.service('ModalService', [ModalService])
})();