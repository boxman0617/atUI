(function() {
	var app = angular.module('atUI');

	app.directive('newTypeModal', ['DataTypeService', 'RecordLayoutCommonService',
		function(DataTypeService, RecordLayoutCommonService) {
			return {
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/newType/_newTypeModal.html',
				'controller': function($scope, $element) {
					$scope.types = [];
					$scope.type = {
						'name': null,
						'description': null
					};

					DataTypeService.onSummon(function() {
						$element.find('.modal').modal();

						RecordLayoutCommonService.getTypes(function(types) {
							$scope.types = types;
						});
					});

					$scope.createType = function() {
						DataTypeService.create($scope.type, function(type) {
							$element.find('.modal').modal('hide');
							$scope.$broadcast('datatype-refresh', type);
						});
					};

					$element.find('.modal').on('hidden.bs.modal', function() {
						$scope.types = [];
						$scope.type = {
							'name': null,
							'description': null
						};
					});
				}
			};
		}
	]);

	app.service('DataTypeService', ['APIService',
		function(APIService) {
			var _onSummonCB;

			this.onSummon = function(cb) {
				_onSummonCB = cb;
			};

			this.summon = function() {
				_onSummonCB.apply(null, []);
			};

			this.checkUniqueName = function(name, cb) {
				APIService.get('datatype/is/unique/'+name)
					.success(function(is) {
						cb.apply(null, [is]);
					});
			};

			this.create = function(type, cb) {
				APIService.put('datatype/new', type)
					.success(function(t) {
						cb.apply(null, [t]);
					});
			};
		}
	]);

	app.directive('atTypeNameInput', ['DataTypeService', 
		function(DataTypeService) {
			return {
				'require': 'ngModel',
				'controller': function($scope, $element) {
					$scope._ctrl = null;
					var _prev = '';

					var toUpper = function() {
						if($scope.type.name !== null && $scope.type.name !== '') {
							$scope.type.name = $scope.type.name.toUpperCase();
						}
					};

					var toThree = function() {
						if($scope.type.name.length > 3) {
							$scope.type.name = $scope.type.name.slice(0, 3);
						}
					};

					var toUnique = function() {
						if($scope.type.name.length === 3 && $scope.type.name !== _prev) {
							_prev = $scope.type.name;
							DataTypeService.checkUniqueName($scope.type.name, function(is) {
								$scope._ctrl.$setValidity('unique', is);
							});
						}
					};

					$scope.checkName = function() {
						if(angular.isDefined($scope.type.name) && $scope.type.name.hasOwnProperty('length')) {
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
})();