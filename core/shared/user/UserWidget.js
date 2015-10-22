(function() {
	var app = angular.module('atCore');
	
	class UserWidgetController {
		constructor($scope, $element, $attrs, UserService) {
			this.$scope = $scope;
			this.$element = $element;
			this.$attrs = $attrs;
			this.UserService = UserService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			if(this.$attrs.hasOwnProperty('atType')) {
				this.$scope.type = this.$attrs.atType;;
			} else {
				this.$scope.type = 'default';
			}
			
			this.$scope.background = false;
			this.$scope.backgroundImg = null;
			
			this.$scope.userImg = null;
			
			this.UserService.getThisUserImage(this.$scope.atUser, function(img) {
				self.$scope.userImg = img;
			});
		}
	}
	
	app.directive('userWidget', [function() {
		return {
			'templateUrl': 'assets/templates/core/shared/user/userWidget.html',
			'scope': {
				'atUser': '='
			},
			'controller': ['$scope', '$element', '$attrs', 'UserService', UserWidgetController]
		};
	}]);
})();