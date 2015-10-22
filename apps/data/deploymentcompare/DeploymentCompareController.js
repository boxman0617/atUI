(function() {
	var app = angular.module('atUI');
	
	class DeploymentLevelPathService {
		constructor() {
			this._levelPaths = {
				'Layout': 'layout/all/',
			    'Segment': 'segment/all/raw/',
			    'Code Group': 'code/groups/p/'
			};
		}
		
		getPath(path, deploymentID) {
			return this._levelPaths[path]+deploymentID;
		}
	}
	
	app.service('DeploymentLevelPathService', [DeploymentLevelPathService]);
	
	class DeploymentCompareController {
		constructor($scope, PlatformService, NavBarToggleService, ModalService, APIService, DiffService, DeploymentLevelPathService, StoreService, $route) {
			this.$scope = $scope;
			this.PlatformService = PlatformService;
			this.NavBarToggleService = NavBarToggleService;
			this.ModalService = ModalService;
			this.APIService = APIService;
			this.DiffService = DiffService;
			this.DeploymentLevelPathService = DeploymentLevelPathService;
			this.StoreService = StoreService;
			this.$route = $route;
			
			this._setupScope();
			this._init();
		}
		
		_setupScope() {
			var self = this;
			
			this._setupGlobalScope();
			this._setupScopeForDiffSelectDeployments();
			this._setupLevelScope();
		}
		
		_init() {
			this.StoreService.leftOffHere('Deployment Compare');
			this._globalInit();
		}
		
		_deploymentsSelected() {
			this.NavBarToggleService.doClose();
			this.$scope.deploymentsSelected = true;
			
			this.ModalService.summon('diff-step1-modal');
		}
		
		// ################################ #diff-global
		_globalInit() {
			this._MAX_DIFFS = 3;
		}
		
		_setupGlobalScope() {
			var self = this;
			
			this.$scope.diffDeployments = [];
			this.$scope.deploymentPanels = {};
			
			this.$scope.deploymentsSelected = false;
			
			this.$scope.reset = function() {
				self.reset();
			};
			
			this.$scope.$on('$destroy', function() {
				self.DiffService.onDestroy();
			});
		}
		
		reset() {
			this.$route.reload();
		}
		// END ####
		
		// ################################ #diff-levels
		_setupLevelScope() {
			var self = this;
			this.$scope.levels = [
			    'Layout',
			    'Segment',
			    'Code Group',
            ];
			this.$scope.currentLevel = this.$scope.levels[0];
			
			this.$scope.selectLevel = function(level) {
				self.selectLevel(level);
			};
			
			this.$scope.fetchLevel = function() {
				self.fetchLevel();
			};
			
			this.$scope.$on('mouseover-diff-item', function(e, item) {
				self.$scope.$broadcast('mouseover-'+item.__LEVEL+'-'+item.index);
				e.preventDefault();
				e.stopPropagation();
			});
			
			this.$scope.$on('mouseleave-diff-item', function(e, item) {
				self.$scope.$broadcast('mouseleave-'+item.__LEVEL+'-'+item.index);
				e.preventDefault();
				e.stopPropagation();
			});
			
			this.$scope.$on('open-diff-item', function(e, item) {
				self.$scope.$broadcast('open-'+item.__LEVEL+'-'+item.index);
				e.preventDefault();
				e.stopPropagation();
			});
		}
		
		_getPath(level, id) {
			return this.DeploymentLevelPathService.getPath(level, id);
		}
		
		selectLevel(level) {
			this.$scope.currentLevel = level;
		}
		
		fetchLevel() {
			var self = this;
			for(let deploymentID in this.$scope.deploymentPanels) {
				this.APIService.get(this._getPath(this.$scope.currentLevel, deploymentID)).success(function(items) {
					var ii = items.map(function(c) {
						if(typeof c !== 'object') {
							return {
								'name': c
							};
						}
						return c;
					});
					self.$scope.deploymentPanels[deploymentID].setItems(ii);
				});
			}
		}
		// END ####
		
		// ################################ #diff-select-deployments
		_setupScopeForDiffSelectDeployments() {
			var self = this;
			this.$scope.deployments = [];
			
			this._fetchDeployments();
			
			this.$scope.selectDeployment = function(deployment) {
				self.selectDeployment(deployment);
			};
			
			this.$scope.addForDiff = function() {
				self.addForDiff();
			};
			
			this.$scope.doDeploymentsSelected = function() {
				self._deploymentsSelected();
			};
		}
		
		_fetchDeployments() {
			var self = this;
			
			this.PlatformService.fetchPlatforms(function() {
				self.$scope.deployments = angular.copy(self.PlatformService.getPlatforms());
				self.$scope.currentSelectedDeployment = self.$scope.deployments[0];
			});
		}
		
		selectDeployment(deployment) {
			this.$scope.currentSelectedDeployment = deployment;
		}
		
		addForDiff() {
			var deployment = this.$scope.currentSelectedDeployment;
			if(this.$scope.diffDeployments.length === this._MAX_DIFFS) {
				return;
			}
			
			this.$scope.diffDeployments.push(deployment);
			this.$scope.deploymentPanels[deployment.id] = {
				'_cb': null,
				'items': [],
				'onUpdate': function(cb) {
					this._cb = cb;
				},
				'setItems': function(items) {
					this.items = items;
					this._cb.apply(null, [this.items]);
				}
			};
			this.DiffService.addPanel(deployment.id);
			for(let i in this.$scope.deployments) {
				if(this.$scope.deployments[i].id === deployment.id) {
					this.$scope.deployments.splice(i, 1);
					this.$scope.currentSelectedDeployment = this.$scope.deployments[0];
					if(this.$scope.diffDeployments.length === this._MAX_DIFFS) {
						this._deploymentsSelected();
					}
					return;
				}
			}
		}
		// END ####
	}
	
	app.controller('DeploymentCompareController', [
	                                               '$scope', 
	                                               'PlatformService', 
	                                               'NavBarToggleService', 
	                                               'ModalService',
	                                               'APIService',
	                                               'DiffService',
	                                               'DeploymentLevelPathService',
	                                               'StoreService',
	                                               '$route',
	                                               DeploymentCompareController]);
	
	app.directive('fullHeightPanel', ['$timeout', function($timeout) {
		return {
			'link': function(scope, element) {
				$timeout(function() {
					var stageHeight = parseInt($('#stage').height());
					var wrapperPadding = parseInt($('#stage > .wrapper').css('paddingTop')) * 2;
					var headingHeight = parseInt(element.find('.panel-heading').outerHeight(true));
					var panelHeight = parseInt(element.outerHeight(true)) - parseInt(element.outerHeight());
					
					element.find('.panel-body').css('height', stageHeight - wrapperPadding - headingHeight - panelHeight - 2);
				}, 100);
			}
		};
	}]);
	
	app.directive('syncedScrollManager', [function() { 
		return {
			'controller': ['$scope', '$element', function($scope, $element) {
				$scope.panels = [];
				var _scroll = {
					'left': 0,
					'top': 0
				};
				
				var _attachListener = function(panel) {
					$(panel).on('scroll', function(e) {
						_syncScrollFire(e);
					});
					
					return panel;
				};
				
				var _syncScrollFire = function(e) {
					if(e.isTrigger) {
						$(e.target).scrollLeft(_scroll.left);
						$(e.target).scrollTop(_scroll.top);
					} else {
						_scroll.left = e.target.scrollLeft;
						_scroll.top = e.target.scrollTop;
						
						for(let el of $scope.panels) {
							if(!$(el)[0].isSameNode(e.target)) {
								$(el).trigger('scroll');
							}
						}
						
					}
				};
				
				this.addPanel = function(panel) {
					$scope.panels.push(_attachListener(panel));
				};
				
			}]
		};
	}]);
	
	app.directive('syncedScroll', [function() {
		return {
			'require': '^syncedScrollManager',
			'link': function(scope, element, attrs, controller) {
				controller.addPanel(element);
			}
		};
	}]);
})();