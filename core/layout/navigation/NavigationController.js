(function() {
	var app = angular.module('atUI');
	
	class NavBarController {
		constructor($scope, $element, $compile, NavService, $location, NavBarToggleService) {
			this.$scope = $scope;
			this.$element = $element;
			this.$compile = $compile;
			this.NavService = NavService;
			this.$location = $location;
			this.NavBarToggleService = NavBarToggleService;
			
			this._init();
		}
		
		_init() {
			this._initScope();
		}
		
		_initScope() {
			var self = this;
			this.$scope.links = null;
			
			this.$scope.$on('$locationChangeSuccess', function() {
				self.setCurrentLocation(self.$location.path());
			});
			
			this.NavService.fetch(function(data) {
				self.$scope.links = data;
				self.setCurrentLocation(self.$location.path());
				
				self._render();
			});
			
			this.NavBarToggleService.on('open', function() {
				self.showMenu();
			});
			this.NavBarToggleService.on('close', function() {
				self.hideMenu();
			});
		}
		
		showMenu() {
			var self = this;
			var $stage = $('#stage');
			$stage.stop(true).animate({
				'left': self.NavBarToggleService.getStageLeft()
			});
			this.$element.stop(true).animate({'width': '240px'}, 350, function() {
				self.$element.children('ul').stop(true).slideDown();
			});
		}
		
		hideMenu() {
			var self = this;
			var $stage = $('#stage');
			this.$element.children('ul').stop(true).slideUp(function() {
				$stage.stop(true).animate({
					'left': 0
				});
				self.$element.stop(true).animate({'width': 0}, 350);
			});
		}
		
		setCurrentLocation(location) {
			this.$scope.currentLocation = location;
			this._syncWithLinks();
		}
		
		open(link) {
			for(var i in this.$scope.links) {
				if(this.$scope.links[i].uiNavParentID === link.uiNavParentID) {
					this.$scope.links[i].__ACTIVE = true;
				} else {
					this.$scope.links[i].__ACTIVE = false;
				}
			}
		}
		
		_syncWithLinks() {
			var parent = null;
			for(var i in this.$scope.links) {
				for(var ii in this.$scope.links[i].children) {
					if(this.$scope.links[i].children[ii].link === this.$scope.currentLocation) {
						this.$scope.links[i].children[ii].__ACTIVE = true;
						parent = this.$scope.links[i].uiNavParentID;
					} else {
						this.$scope.links[i].children[ii].__ACTIVE = false;
					}
				}
			}
			for(var iii in this.$scope.links) {
				if(this.$scope.links[iii].uiNavParentID === parent) {
					this.$scope.links[iii].__ACTIVE = true;
				} else {
					this.$scope.links[iii].__ACTIVE = false;
				}
			}
		}
		
		_render() {
			var dom = '<li nav-bar-parent></li>';
			var $links = this.$element.find('.links');
			
			for(var i in this.$scope.links) {
				var s = this.$scope.$new();
				s.link = this.$scope.links[i];
				var $dom = this.$compile(dom)(s);
				$links.append($dom);
			}
		}
	}
	
	app.directive('navBar', [function() {
		return {
			'priority': 1000,
			'templateUrl': 'assets/templates/core/layout/navigation/navBar.html',
			'controller': ['$scope', '$element', '$compile', 'NavService', '$location', 'NavBarToggleService', NavBarController]
		}
	}]);
	
	class NavService {
		constructor(APIService) {
			this.APIService = APIService;
			
			this._init();
		}
		
		_init() {
			this._nav = [];
		}
		
		fetch(cb) {
			var self = this;
			if(this._nav.length > 0) {
				return cb.apply(null, [this._nav]);
			} else {
				this.APIService.get('nav', {'cache': true}).success(function(data) {
					self._nav = data.map(function(parent) {
						for(var i in parent.children) {
							parent.children[i].link = '/'+parent.name.toLowerCase()+'/'+parent.children[i].name.toLowerCase();
						}
						return parent;
					});
					cb.apply(null, [self._nav]);
				});
			}
		}
	}
	
	app.service('NavService', ['APIService', NavService]);
	
	class NavBarParentController {
		constructor($scope, $element, $compile) {
			this.$scope = $scope;
			this.$element = $element;
			this.$compile = $compile;
			
			this._init();
		}
		
		_init() {
			for(let child of this.$scope.link.children) {
				this.render(child);
			}
			
			this._initScope();
		}
		
		_initScope() {
			var self = this;
			
			this.$scope.$watch('link.__ACTIVE', function(newValue, oldValue) {
				if(newValue === true) {
					return self.$element.find('.children').slideDown();
				}
				if(newValue === false) {
					return self.$element.find('.children').slideUp();
				}
			});
		}
		
		render(link) {
			var dom = '<li nav-bar-child></li>';
			var s = this.$scope.$new();
			s.link = link;
			var $dom = this.$compile(dom)(s);
			this.$element.find('.children').append($dom);
		}
	}
	
	app.directive('navBarParent', [function() {
		return {
			'require': '^navBar',
			'templateUrl': 'assets/templates/core/layout/navigation/navBarParent.html',
			'controller': ['$scope', '$element', '$compile', NavBarParentController],
			'link': function(scope, element, attrs, Controller) {
				scope.open = function() {
					Controller.open(scope.link);
				};
			}
		};
	}]);
	
	class NavBarChildController {
		constructor($scope, $element) {
			this.$scope = $scope;
			this.$element = $element;
			
			this._init();
		}
		
		_init() {
			
		}
	}
	
	app.directive('navBarChild', [function() {
		return {
			'require': '^navBarParent',
			'templateUrl': 'assets/templates/core/layout/navigation/navBarChild.html',
			'controller': ['$scope', '$element', NavBarChildController],
			'link': function(scope, element, attrs, ParentController) {
				
			}
		};
	}]);
})();