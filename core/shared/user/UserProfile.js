(function() {
	var app = angular.module('atCore');
	
	class UserProfileController {
		constructor($scope, $element, UserService) {
			this.$scope = $scope;
			this.$element = $element;
			this.UserService = UserService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			this.$scope.user = null;
			this.$scope.userImg = null;
			
			this.UserService.getUserImage(function(img) {
				self.$scope.userImg = img;
			});
			this.UserService.getUserInfo(function(user) {
				self.$scope.user = user;
			});
		}
	}
	
	app.directive('userProfile', [function() {
		return {
			'templateUrl': 'assets/templates/core/shared/user/userProfile.html',
			'controller': ['$scope', '$element', 'UserService', UserProfileController]
		};
	}]);
})();