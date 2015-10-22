(function() {
	var app = angular.module('atUI');

	app.directive('atNotificationCenter', ['NotificationQueue', function(NotificationQueue) {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				scope.queue = NotificationQueue.queue;
			}
		};
	}]);

	app.directive('atNotification', ['$timeout', 'NotificationQueue', function($timeout, NotificationQueue) {
		return {
			'restrict': 'A',
			'templateUrl': 'assets/templates/core/shared/notification/atnotification.template.html',
			'link': function(scope, element, attrs) {
				$timeout(function() {
					scope.$apply(function() {
						NotificationQueue.remove(scope.$index);
					});
				}, 9000);
			}
		};
	}]);

	app.service('NotificationQueue', [function() {
		this.queue = {
			'q': []
		};

		this.push = function(msg) {
			this.queue.q.push(msg);
		};

		this.remove = function(i) {
			this.queue.q.splice(i, 1);
		};
	}]);
})();