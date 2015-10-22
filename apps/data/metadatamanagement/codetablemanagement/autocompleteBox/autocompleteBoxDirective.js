(function() {
	var app = angular.module('atUI');

	app.directive('codesTable', ['$timeout',
		function($timeout) {
			return {
				'controller': function($scope) {
					$scope.deSelect = function() {
						$scope.$broadcast('codes-multiedit-deselect');
					};
				},
				'link': function(scope, element, attrs) {
					$timeout(function() {
						var stage_height = $('#stage').height();
						var wrapper_bottom = parseInt($('#stage .wrapper').css('padding-bottom'));
						var $mgma = $('#mgma');
						var toolbar_height = $mgma.find('.toolbar').height() + 
							(parseInt($mgma.find('.toolbar').css('padding-top')) * 2) + 
							parseInt($mgma.find('.toolbar').css('border-bottom-width'));
						var mgma_stage_top = parseInt($mgma.find('.mgma-stage').css('padding-top'));						
						var bottom = $('#code-table-action-button').outerHeight();
						var panel_heading = element.find('.panel-heading').outerHeight();
						var table_heading = element.find('.segment-field-heading').outerHeight();
						var element_height = stage_height - (wrapper_bottom + toolbar_height + mgma_stage_top) - (table_heading + panel_heading) - bottom - 22;

						element.find('.segment-fields').css({'height': element_height});
					}, 1000);
				}
			};
		}
	]);
	
	app.directive('sidebarBox', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/metadatamanagement/codetablemanagement/autocompleteBox/_partial.html',
			'link': function(scope, element) {
				var stage_height = $('#stage').height();
				var wrapper_bottom = parseInt($('#stage .wrapper').css('padding-bottom'));
				var $mgma = $('#mgma');
				var toolbar_height = $mgma.find('.toolbar').height() + 
					(parseInt($mgma.find('.toolbar').css('padding-top')) * 2) + 
					parseInt($mgma.find('.toolbar').css('border-bottom-width'));
				var mgma_stage_top = parseInt($mgma.find('.mgma-stage').css('padding-top'));
				var element_height = stage_height - (wrapper_bottom + toolbar_height + mgma_stage_top);

				element.css({'height': element_height});

				element.find('.list-viewer-wrapper').css({
					'height': function() {
						var pad = (parseInt(element.css('padding-top')) + parseInt(element.css('border-top-width'))) * 2;
						return element_height - pad - element.find('.list-viewer-toolbar').height() - parseInt($(this).css('margin-top'));
					}
				});
			}
		};
	}]);
	
	app.directive('autocompleteBoxModal', [
		function() {
		  	return {
		  		'controller': function($scope, $element) {
		  			$scope.$on('autocomplete-box-modal-deselect', function() {
		  				$scope.selected = false;
						$scope.active = 0;
						$scope.selectedOne = null;
		  			});
		  			
		  			$scope.selectGroup = function(index, name) {
						index = typeof index !== 'undefined' ? index : null;
		
						if(index === null) {
							$scope.selectedOne = name;
							index = name;
						} else {
							$scope.selectedOne = $scope.results[index].original;
						}
						$scope.search = '';
						$scope.selected = index;
						$scope.$emit('autocomplete-box-modal-item-selected', $scope.selectedOne);
					};
		  		}
		  	};
		}
    ]);
	
	app.directive('autocompleteBoxMain', ['CodeTableStateService', 'AlertMessageService', 'CodesService', 'NotificationQueue',
        function(CodeTableStateService, AlertMessageService, CodesService, NotificationQueue) {
        	return {
        		'controller': function($scope, $element) {
        			$scope.dirty = false;
        			$scope.newGroupMode = false;
        			CodeTableStateService.watch('state', function(oldValue, newValue) {
        				$scope.dirty = newValue;
        			});
        			
        			$scope.newGrouping = function() {
        				$scope.newGroupMode = true;
        				$scope.$parent.newGroupingName = $scope.search;
        				$scope.$parent.clearCodes();
        				$scope.$parent.addNewCode($scope.$parent.newGrouping);
        			};
        			
        			$scope.$on('cancel-new-group', function() {
        				$scope.newGroupMode = false;
        				$scope.dirty = false;
        			});
        			
        			$scope.askDeleteGroup = function(item) {
        				var buttons = [];
        				buttons.push({
        					'class': 'btn-danger',
        					'label': 'DELETE',
        					'action': function() {
        						CodesService.deleteGrouping(item, function() {
        							NotificationQueue.push({
        								'icon': 'thumbs-up',
        								'text': 'Successfully deleted Code Group!'
        							});
        							$scope.$emit('code-table-saved');
        						});
        					},
        					'dismiss': true
        				});
        				buttons.push({
        					'class': 'btn-default',
        					'label': 'Cancel',
        					'dismiss': true
        				});
        				AlertMessageService.showQuestion('Hold on!', 'This will delete the entire Group including all of the attached codes. Continue?', buttons);
        			};
        			
        			$scope.selectGroup = function(index, name) {
        				if($scope.dirty) {
        					AlertMessageService.showQuestion('Unsaved Changes!', 'You have unsaved changes, do you wish to discard them?', [
        						{
        							'class': 'btn-danger',
        							'label': 'Discard',
        							'action': function() {
        								_selectGroup(index, name);
        							},
        							'dismiss': true
        						},
        						{
        							'class': 'btn-default',
        							'label': 'No',
        							'dismiss': true
        						}
        					]);
        					return;
        				}
						_selectGroup(index, name);
					};
					
					var _selectGroup = function(index, name) {
						index = typeof index !== 'undefined' ? index : null;
						$scope.newGroupMode = false;
        				$scope.dirty = false;

						if(index === null) {
							$scope.selectedOne = name;
							index = name;
						} else {
							$scope.selectedOne = $scope.results[index].original;
						}
						$scope.search = '';
						$scope.selected = index;
						$scope.$emit('autocomplete-box-item-selected', $scope.selectedOne);
					};
        		}
        	};
        }
    ]);

	app.directive('autocompleteBox', ['$sce', 'CodesService',
		function($sce, CodesService) {
			return {
				'scope': true,
				'controller': function($scope, $element, $attrs) {
					$scope.search = '';
					$scope.results = [];
					$scope.selected = false;
					$scope.active = 0;
					$scope.selectedOne = null;
					$scope.canCreate = false;
					$scope.canDelete = true;
					$scope.trashMode = false;
					
					$scope.$on('cancel-new-group', function() {
        				$scope.search = '';
        				$scope.active = 0;
        				$scope.selectedOne = null;
        				$scope.selected = false;
        			});

					$scope.list = [];
					
					$scope.fetchGroups = function(cb = null) {
						CodesService.fetchGroups(function(groups) {
							$scope.list = groups;
							if(cb !== null) {
								cb.apply();
							}
						});
					};
					$scope.fetchGroups();
					
					$scope.toggleDelete = function() {
						$scope.trashMode = !$scope.trashMode;
					};
					
					$scope.$on('code-table-saved', function() {
						var _search = $scope.search;
						$scope.search = '';
						$scope.fetchGroups(function() {
							$scope.active = $scope.list.indexOf(_search);
							$scope.selectedOne = $scope.list[$scope.active];
						});
						$scope.trashMode = false;
					});
					
					$scope.$on('code-table-has-changed', function() {
						$scope.dirty = true;
					});
					
					$scope.$on('code-table-refresh-selected', function() {
						$scope.selectGroup($scope.selectedOne);
					});

					$scope.$watch('search', function(newValue, oldValue, scope) {
						if(scope.results.length === 0 || scope.selected !== false && angular.isDefined(scope.selected) && newValue !== scope.results[scope.selected].original) {
							scope.selected = false;
						}
						if(newValue !== oldValue && newValue !== '' && scope.selected === false) {
							var m = fuzzy.filter(newValue, scope.list, {
								'pre': '<strong>',
								'post': '</strong>'
							});
							scope.results = [];
							let found = false;
							for(let r of m) {
								if(newValue === r.original) {
									found = true;
									scope.canCreate = false;
									break;
								}
							}
							if(found === false) {
								scope.canCreate = true;
							}
							scope.active = 0;
							for(var i in m) {
								scope.results.push({
									'string': $sce.trustAsHtml(m[i].string),
									'original': m[i].original
								});
							}
						}
						if(newValue === '') {
							scope.results = [];
							scope.canCreate = false;
						}
					});

					$scope.onDownArrow = function() {
						if(parseInt($scope.active) + 1 < $scope.results.length) {
							$scope.$apply(function() {
								$scope.active = parseInt($scope.active) + 1;
							});
						}
					};

					$scope.onUpArrow = function() {
						if(parseInt($scope.active) - 1 >= 0) {
							$scope.$apply(function() {
								$scope.active = parseInt($scope.active) - 1;
							});
						}
					};

					$scope.onEnter = function() {
						$scope.$apply(function() {
							$scope.selectGroup($scope.active);
						});
					};
				},
				'link': function(scope, element, attrs) {
					scope.$watchGroup('results', function(newValue, oldValue) {
						if(newValue.length > 0) {
							element.on('keydown', function(e) {
								if(e.which === 40) { // Down Arrow
									scope.onDownArrow();
									return e.preventDefault();
								} else if(e.which === 38) { // Up Arrow
									scope.onUpArrow();
									return e.preventDefault();
								} else if(e.which === 13) { // Enter
									scope.onEnter();
									return e.preventDefault();
								}
							});
						} else {
							element.off('keydown');
						}
					});

					scope.$watch('active', function(newValue, oldValue) {
						var $results = element.find('.list-viewer-wrapper');
						var F = $results.outerHeight();
						if(newValue !== oldValue) {
							var T = element.find('.active').outerHeight();
							var O = ((parseInt(newValue) + 2) * T);
							var X = Math.abs(F - O);
							if(O > F) {
								$results.scrollTop(X);
							} else {
								$results.scrollTop(0);
							}
						}
					});
				}
			};
		}
	]);
})();