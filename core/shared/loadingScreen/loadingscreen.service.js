(function() {
	var app = angular.module('atUI');

	app.service('LoadingScreenService', ['$timeout',
		function($timeout) {
			var _queue = [];
			var _subs = {
				'show': [],
				'hide': []
			};
			var _debounce = null;
			var _dSpeed = 500;

			this.on = function(e, cb) {
				_subs[e].push(cb);
			};

			this.show = function() {
				if(_queue.length === 0) {
					if(_debounce !== null) {
						$timeout.cancel(_debounce);
					}
					for(var i in _subs.show) {
						_subs.show[i].call();
					}
				}
				_queue.push(1);
			};

			this.hide = function() {
				_queue.pop();
				if(_queue.length === 0) {
					_debounce = $timeout(function() {
						_doHide();
					}, _dSpeed);
				}
			};

			var _doHide = function() {
				for(var i in _subs.hide) {
					_subs.hide[i].call();
				}
				_debounce = null;
			};
		}
	]);

	app.directive('loadingScreen', ['LoadingScreenService', '$log',
		function(LoadingScreenService, $log) {
			return {
				'controller': function($scope) {
					$scope.show = false;
				},
				'link': function(scope, element) {
					LoadingScreenService.on('show', function() {
						scope.show = true;
					});
					LoadingScreenService.on('hide', function() {
						scope.show = false;
					});

					var text = $('#footer').find('.patent').text();
					var s = text.split('');
					var r = chance.natural({'min': 5, 'max': s.length - 1});
					s[r] = '<a href="javascript:void(0);">'+s[r]+'</a>';
					$('#footer').find('.patent').html(s.join(''));
					$('#footer').find('a').on('click', function() {
						$log.log(
							"###########################################################\n"+
							"# Look at you! You not only find me, you are also         #\n"+
							"# reading this! Which means you are a dev!! Yay!          #\n"+
							"# There really isn't much to say after that.              #\n"+
							"# Enjoy the UI!                                           #\n"+
							"###########################################################"
						);
						$('#loading-screen').find('.spinner').removeClass('ball-grid-pulse');
						$('#loading-screen').find('.spinner').children().remove();
						$('#loading-screen').find('.spinner').append($('<img style="width: 57px;" src="assets/img/_loading_.gif">'));
					});
				}
			};
		}
	]);
})();