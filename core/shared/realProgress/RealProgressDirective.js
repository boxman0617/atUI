(function() {
	var rp = angular.module('RealProgress', []);

	rp.service('RealProgressService', [
		function() {
			var _steps = [];
			var _initCallback = null;
			var _onCompleteCallback = null;
			var _onReady = null;

			/**
			 * Initialize a new set of steps
			 * @public
			 * @param  {Array} steps A simple array of steps
			 * @return {self}
			 */
			this.init = function(steps) {
				_steps = steps.map(function(step, i) {
					var show = false;
					var badges = [];
					var status = 'pending';
					if(i === 0) {
						show = true;
						badges = ['fa-spin', 'fa-cog'];
						status = 'running';
					}
					return {
						'showBadge': show,
						'badges': badges,
						'status': status,
						'title': step
					};
				});

				_initCallback.apply(null, [_steps]);

				return this;
			};

			this.startStep = function(step) {
				var _c = true;
				angular.forEach(_steps, function(_step, i, s) {
					if(_c === false) {
						return;
					}

					if(_step.title !== step) {
						if(_step.status === 'pending') {
							s[i] = _markSkipped(_step);
						}
					} else {
						_c = false;
						s[i] = _markRunning(_step);
					}
				});
				return this;
			};

			this.markComplete = function(step) {
				var i = _steps.map(function(e) { return e.title; }).indexOf(step);
				_steps[i] = _markComplete({'title': step});
				_checkComplete();
				return this;
			};

			var _markRunning = function(step) {
				return {
					'showBadge': true,
					'badges': ['fa-spin', 'fa-cog'],
					'status': 'running',
					'title': step.title
				};
			};

			var _markComplete = function(step) {
				return {
					'showBadge': true,
					'badges': ['fa-check'],
					'status': 'complete',
					'title': step.title
				};
			};

			var _markSkipped = function(step) {
				return {
					'showBadge': true,
					'badges': ['fa-fast-forward'],
					'status': 'skipped',
					'title': step.title
				};
			};

			var _checkComplete = function() {
				if(_steps[_steps.length - 1].status === 'complete') {
					_onCompleteCallback.apply(null, []);
				}
			};

			/**
			 * Hook for directive to show modal
			 * @private
			 * @param  {Function} cb Callback to show modal
			 */
			this._onInit = function(cb) {
				_initCallback = cb;
				_onReady.apply(null, []);
			};

			/**
			 * Hook for directive to close modal
			 * @private
			 * @param  {Function} cb Callback to close modal
			 */
			this._onComplete = function(cb) {
				_onCompleteCallback = cb;
			};

			this.ready = function(cb) {
				_onReady = cb;
			};
		}
	]);

	rp.directive('realProgress', ['RealProgressService', '$timeout',
		function(RealProgressService, $timeout) {
			return {
				'template': '<div class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><ul class="list-group" style="margin: 0;"><li class="list-group-item" ng-repeat="step in steps"><span class="badge" ng-if="step.showBadge"><i class="fa" ng-class="step.badges"></i></span>{{step.title}}</li></ul></div></div></div</div>',
				'controller': function($scope, $element) {
					$scope.steps = [];

					RealProgressService._onInit(function(steps) {
						$scope.steps = steps;
						$element.find('.modal').modal({
							'backdrop': 'static',
							'keyboard': false
						});
					});

					RealProgressService._onComplete(function() {
						$timeout(function() {
							$element.find('.modal').modal('hide');
						}, 500);
					});

					$element.find('.modal').on('hidden.bs.modal', function() {
						$scope.$apply(function() {
							$scope.steps = [];
						});
					});
				}
			};
		}
	]);
})();

// <div class="modal fade" tabindex="-1" role="dialog">
// 	<div class="modal-dialog modal-sm">
// 		<div class="modal-content">
// 			<div class="modal-body">
// 				<ul class="list-group" style="margin: 0;">
// 					<li class="list-group-item" ng-repeat="step in steps">
// 						<span class="badge" ng-if="step.showBadge"><i class="fa" ng-class="step.badges"></i></span>
// 						{{step.title}}
// 					</li>
// 				</ul>
// 			</div>
// 		</div>
// 	</div>
// </div>