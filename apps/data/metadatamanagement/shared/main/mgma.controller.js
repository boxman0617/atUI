(function() {
	var app = angular.module('atUI');

	app.controller('MGMAController', ['$scope', 'UserService', 'NavBarToggleService', 'StoreService', '$routeParams', '$locationEx', 'PlatformService', '$route', '$timeout',
	
		function($scope, UserService, NavBarToggleService, StoreService, $routeParams, $locationEx, PlatformService, $route, $timeout) {
			PlatformService.onChange(function() {
				$route.reload();
			});
			
			$timeout(function() {
				NavBarToggleService.doClose();
			}, 100);
			StoreService.leftOffHere('Metadata');

			$scope.changeRoute = function(currActive) {
				$locationEx.skipReload().path('/data/metadatamanagement/perspective/'+currActive.name.toLowerCase().replace(/ /ig, '_')).replace();
				StoreService.leftOffHere(currActive.name);
			};
			
			$scope.perspectives = [];
			$scope.loadedPerspectives = [];
			
			UserService.getPerspectives(function(p) {
				$scope.perspectives = p;

				if($routeParams.hasOwnProperty('perspective')) {
					$scope.perspectives = $scope.perspectives.map(function(p, i) {
						var l = p.name.toLowerCase().replace(/ /ig, '_');
						if(l === this.perspective) {
							p.active = true;
							return p;
						}
						p.active = false;
						return p;
					}, {
						'perspective': $routeParams.perspective
					});
				} else {
					$scope.perspectives = $scope.perspectives.map(function(p, i) {
						if(p.rank === 1) {
							p.active = true;
							return p;
						}
						p.active = false;
						return p;
					});
				}

				$scope.$watch('perspectives', function(newValue, oldValue, scope) {
					$scope.loadActive();
				}, true);
			});

			$scope.loadActive = function() {
				var currActive = $scope.perspectives.filter(function(el, i) {
					if(el.active) {
						return true;
					}
					return false;
				})[0];
				
				if($scope.loadedPerspectives.length > 0) {
					var loadedActive = $scope.loadedPerspectives.filter(function(el, i) {
						if(el.active) {
							return true;
						}
						return false;
					})[0];
					$scope.changeRoute(currActive);
					if(currActive.uiPerspectiveID !== loadedActive.id) {	
						var found = $scope.loadedPerspectives.filter(function(el, i) {
							if(el.id === this.id) {
								return true;
							}
							return false;
						}, {
							'id': currActive.uiPerspectiveID
						});

						for(var i in $scope.loadedPerspectives) {
							if($scope.loadedPerspectives[i].id === loadedActive.id) {
								$scope.loadedPerspectives[i].active = false;
							}
						}

						if(found.length > 0) {
							for(var i in $scope.loadedPerspectives) {
								if($scope.loadedPerspectives[i].id === found[0].id) {
									$scope.loadedPerspectives[i].active = true;
								}
							}
							return;
						}
					} else {
						return;
					}
				}

				var currActiveName = currActive.name.toLowerCase();
				currActiveName = currActiveName.replace(/ /g, '');
				$scope.loadedPerspectives.push({
					'id': currActive.uiPerspectiveID,
					'include': 'assets/templates/apps/data/metadatamanagement/'+currActiveName.toLowerCase()+'/main.html',
					'active': true
				});
			};

			$scope.$on('perspective-change', function(e, id) {
				$scope.$apply(function() {
					$scope.perspectives = $scope.perspectives.map(function(p, i) {
						if(p.uiPerspectiveID === this.id) {
							p.active = true;
							return p;
						}
						p.active = false;
						return p;
					}, {
						'id': id
					});
				});
			});
		}
	]);
	
	app.directive('perspectiveButton', [
		function() {
			return {
				'templateUrl': 'assets/templates/core/shared/perspective/perspective-button.template.html',
				'controller': function($scope, $element, $attrs) {
					$scope.changePerspective = function(id) {
						$scope.$emit('perspective-change', id);
					};
				},
				'link': function(scope, element, attrs) {
					element.find('a').on('click', function() {
						scope.changePerspective(scope.p.uiPerspectiveID);
					});
				}
			};
		}
	]);
})();