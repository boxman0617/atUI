(function() {
	var app = angular.module('atUI');

	app.directive('navBarTrigger', ['NavBarToggleService', function(NavBarToggleService) {
		return {
			'controller': function($scope, $element)  {
				$scope.toggle = function() {
					if(NavBarToggleService.currentState() === true) {
						$element.find('a').attr('title', 'Show Menu');
					} else {
						$element.find('a').attr('title', 'Hide Menu');
					}
					NavBarToggleService.toggleState();
				};
			},
			'link': function(scope, element, attrs) {
				NavBarToggleService.setStageLeft($('#stage').css('left'));
			}
		};
	}]);

	app.service('NavBarToggleService', function() {
		var _opened = true;
		var _stageLeft = 0;
		var _events = {
			'open': [],
			'close': []
		};
		var _runActionsFor = function(action) {
			for(var i in _events[action]) {
				_events[action][i].apply(null, []);
			}
		};

		this.currentState = function() {
			return _opened;
		};

		this.toggleState = function() {
			_opened = !_opened;
			if(_opened) {
				_runActionsFor('open');
			} else {
				_runActionsFor('close');
			}
		};

		this.doOpen = function() {
			if(_opened === false) {
				this.toggleState();
			}
		};

		this.doClose = function() {
			if(_opened) {
				this.toggleState();
			}
		};

		this.setStageLeft = function(left) {
			_stageLeft = left;
		};

		this.getStageLeft = function() {
			return _stageLeft;
		};

		this.on = function(action, cb) {
			_events[action].push(cb);
		};
	});
})();