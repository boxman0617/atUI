(function() {
	var app = angular.module('atUI');

	app.directive('atItemLocked', ['UserService', function(UserService) {
		return {
			'restrict': 'A',
			'scope': {
				'item': '=',
				'lockAction': '&',
				'itemName': '@'
			},
			'templateUrl': 'assets/templates/apps/data/metadatamanagement/shared/itemStatus/_atItemLocked.html',
			'link': function(scope, element, attrs) {
				scope.disable_lock = false;
				
				if(scope.item.checked_out.is) {
					UserService.getUserInfo(function(user) {
						if(scope.item.checked_out.by.id !== user.id) {
							scope.disable_lock = true;
						}
					});
				}
			}
		};
	}]);

	app.directive('atItemCheckedOut', ['UserService', function(UserService) {
		return {
			'restrict': 'A',
			'scope': {
				'item': '=',
				'checkInAction': '&',
				'checkOutAction': '&',
				'itemName': '@'
			},
			'templateUrl': 'assets/templates/apps/data/metadatamanagement/shared/itemStatus/_atItemCheckedOut.html',
			'link': function(scope, element, attrs) {
				scope.$watch('item.checked_out.is', function(newValue, oldValue) {
					if(scope.item.checked_out.is) {
						UserService.getUserInfo(function(data) {
							if(scope.item.checked_out.by.id === data.id) {
								scope.item.checked_out.self_checked = true;
							} else {
								scope.item.checked_out.self_checked = false;
							}
						});
					}
				});

				scope.performCheckOut = function() {
					var direction = 'out';
					element.find('.fa-sign-'+direction).removeClass('fa-sign-'+direction).addClass('fa-spinner fa-spin');
					scope.checkOutAction({'cb': function() {
						element.find('.fa-spinner').removeClass('fa-spinner fa-spin').addClass('fa-sign-out');
					}});
				};

				scope.performCheckIn = function() {
					var direction = 'in';
					element.find('.fa-sign-'+direction).removeClass('fa-sign-'+direction).addClass('fa-spinner fa-spin');
					scope.checkInAction({'cb': function() {
						element.find('.fa-spinner').removeClass('fa-spinner fa-spin').addClass('fa-sign-in');
					}});
				};
			}
		};
	}]);
})();