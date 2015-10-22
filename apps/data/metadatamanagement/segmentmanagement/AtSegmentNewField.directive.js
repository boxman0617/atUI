(function() {
	var app = angular.module('atUI');

	app.directive('atSegmentFields', ['$timeout', 'LoadingScreenService',
		function($timeout, LoadingScreenService) {
			return {
				'restrict': 'A',
				'link': function(scope, element, attrs) {
					LoadingScreenService.show();
					$timeout(function() {
						var $side = $('#segment-list-viewer');
						var $panel = $('.panel');
						var $button = $('#segment-create-button');

						var segHeight = ($side.outerHeight() - (element.offset().top - $side.offset().top)) - ((parseInt($panel.css('margin-bottom')) + parseInt($panel.css('border-bottom-width'))) + $button.outerHeight());
						element.css({
							'height': segHeight
						});
						$timeout(function() {
							LoadingScreenService.hide();
						}, 200);
					}, 1300);
				}
			};
		}
	]);

	app.directive('atSegmentNewField', [
		function() {
			return {
				'restrict': 'A',
				'scope': {
					'field': '=',
					'lookupDataset': '=',
					'newAction': '=',
					'first': '=',
					'last': '=',
					'readStatus': '=isReadOnly',
					'editMode': '='
				},
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/segmentmanagement/_atSegmentNewField.html',
				'controller': function($scope) {
					$scope.types = ['SHORT', 'INTEGER', 'LONG', 'STRING', 'DATE'];
					var typeLengths = {
						'SHORT': 5,
						'INTEGER': 11,
						'LONG': 20,
						'STRING': 50,
						'DATE': 8
					};
					if($scope.field.dataTypeName === null || $scope.field.dataTypeName === '') {
						$scope.field.dataTypeName = 'STRING';
						$scope.field.length = typeLengths[$scope.field.dataTypeName];
					}
					if($scope.field.dataTypeName !== null && $scope.field.dataTypeName !== '' &&
						($scope.field.length === null || $scope.field.length === '')) {
						$scope.field.length = typeLengths[$scope.field.dataTypeName];
					}
					if($scope.editMode === null || $scope.editMode === '') {
						$scope.editMode = false;
					}

					$scope.setDefaultLength = function() {
						$scope.field.length = typeLengths[$scope.field.dataTypeName];
					};

					if($scope.field.fieldNumber === null || $scope.field.fieldNumber === '')
					{
						var fields = $scope.$parent.$parent.segment.fields;
						var hiNumber = 0;
						for(var i in fields) {
							if(parseInt(fields[i].fieldNumber) > hiNumber) {
								hiNumber = parseInt(fields[i].fieldNumber);
							}
						}

						$scope.field.fieldNumber = hiNumber + 1;
					}

					$scope.removeField = function() {
						var fields = $scope.$parent.$parent.segment.fields;
						for(i in fields) {
							if($scope.field.fieldNumber === fields[i].fieldNumber) {
								fields.splice(i, 1);
								break;
							}
						}
					};
				},
				'link': function(scope, element, attrs) {					
					if(scope.last && !scope.first) {
						element.find('.field-name').focus();

						element.find('.field-lookup').on('blur', function() {
							if(scope.field.name !== '' && scope.field.name !== null) {
								scope.$apply(function() {
									scope.newAction();
								});
							}
						});
					}
				}
			};
		}
	]);

	app.directive('atFieldValidationNumber', [function() {
		return {
			'restrict': 'A',
			'scope': {
				'in': '=in'
			},
			'link': function(scope, element, attrs) {
				scope.$watch('in', function(newValue, oldValue) {
					var v = element.val();
					if(isNaN(v)) {
						element.val('');
						scope.in = null;
					}
				});
			}
		};
	}]);

	app.directive('atFieldValidationMaxLength', [function() {
		return {
			'restrict': 'A',
			'scope': {
				'in': '=in',
				'limit': '=max'
			},
			'link': function(scope, element, attrs) {
				scope.$watch('in', function(newValue, oldValue) {
					var v = element.val();
					if(v.length > parseInt(scope.limit)) {
						var n = v.slice(0, scope.limit);
						element.val(n);
						scope.in = n;
					}
				});
			}
		};
	}]);

})();