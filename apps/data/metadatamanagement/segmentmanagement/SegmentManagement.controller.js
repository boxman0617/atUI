(function() {
	var app = angular.module('atUI');

	app.controller('SegmentManagementController', [
	'$scope', 
	'$timeout',
	'SegmentListService',
	'UserService',
	
	function($scope, $timeout, SegmentListService, UserService) {
		UserService.getUserInfo();

		$scope.segmentList = [];
		$scope.listLoaded = false;
		SegmentListService.onUpdate(function(segments) {
			$scope.segmentList = segments;
			$scope.listLoaded = true;
		});
		SegmentListService.refresh();

		$scope.current_view = null;

		$scope.newSegment = function() {
			SegmentListService.select(false);
			$scope.current_view = 'assets/templates/apps/data/metadatamanagement/segmentmanagement/_newSegmentView.html';
		};

		$scope.selectSegment = function(segment) {
			SegmentListService.select(segment);
			$scope.$emit('at-change-to-edit-mode');
		};

		$scope.$on('at-change-to-edit-mode', function() {
			var s = SegmentListService.getSelected();
			$scope.current_view = 'assets/templates/apps/data/metadatamanagement/segmentmanagement/_editSegmentView.html?s='+s.name+'&t='+moment().toISOString();
		});
		
		$scope.$on('at-segment-reset', function() {
			SegmentListService.refresh();
			$scope.current_view = null;
		});

	}]);

	app.directive('atSegmentNameInput', ['SegmentService', 
		function(SegmentService) {
			return {
				'require': 'ngModel',
				'controller': function($scope, $element) {
					$scope._ctrl = null;
					var _prev = '';

					var toUpper = function() {
						if($scope.segment.name !== null && $scope.segment.name !== '') {
							$scope.segment.name = $scope.segment.name.toUpperCase();
						}
					};

					var toThree = function() {
						if($scope.segment.name.length > 3) {
							$scope.segment.name = $scope.segment.name.slice(0, 3);
						}
					};

					var toUnique = function() {
						if($scope.segment.name.length === 3 && $scope.segment.name !== _prev) {
							_prev = $scope.segment.name;
							SegmentService.checkUniqueName($scope.segment.name, function(is) {
								$scope._ctrl.$setValidity('unique', is);
							});
						}
					};


					$scope.checkName = function() {
						if(angular.isDefined($scope.segment.name) && $scope.segment.name.hasOwnProperty('length')) {
							toUpper();
							toThree();
							toUnique();
						}
					};
				},
				'link': function(scope, element, attr, c) {
					scope._ctrl = c;
				}
			};
		}
	]);

	app.directive('atDateWidget', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				var ref = this;
				
				this.applyModelChange = function(element) {
					var $elem = $(element);
					var model_name = $elem.attr('ng-model');
					var s = model_name.split('.', 1);
					scope.$apply(function() {
						scope[s[0]][s[1]] = $elem.val();
					});
				};

				element.datetimepicker({
					'pickTime': false
				}).on('dp.change', function(e) {
					ref.applyModelChange(this);
				});
			}
		}
	}]);

	app.directive('atLookupRefreshButton', ['LookupDatasetService', function(LookupDatasetService) {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				element.on('click', function() {
					element.find('i').removeClass('fa-exclamation-triangle').addClass('fa-refresh').addClass('fa-spin');
					LookupDatasetService.refresh(function(success) {
						if(success) {
							element.find('i').removeClass('fa-spin').removeAttr('style');
						} else {
							element.find('i').removeClass('fa-spin fa-refresh').addClass('fa-exclamation-triangle').css({
								'color': '#D0C60D'
							});
						}
					});
				});
			}
		}
	}]);

	app.directive('atFullScreenButton', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				element.on('click', function() {
					if(element.find('.fa-expand').length > 0) { // To full screen
						element.find('.fa-expand').removeClass('fa-expand').addClass('fa-compress');
						element.attr('title', 'Compress');
						element.closest('.panel').addClass('full-screen');
					} else { // To NOT full screen
						element.find('.fa-compress').removeClass('fa-compress').addClass('fa-expand');
						element.attr('title', 'Expand to full screen');
						element.closest('.panel').removeClass('full-screen');
					}
				});
			}
		}
	}]);
})();