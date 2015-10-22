(function() {
	var app = angular.module('atUI');
	
	class DiffLayoutItemController {
		constructor($scope, $element, $compile, DeploymentLevelPathService, APIService, SegmentTreeDiffService) {
			this.$scope = $scope;
			this.$element = $element;
			this.$compile = $compile;
			this.DeploymentLevelPathService = DeploymentLevelPathService;
			this.APIService = APIService;
			this.SegmentTreeDiffService = SegmentTreeDiffService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.layout = null;
			this.$scope.segments = null;
			this.$scope.exploded = false;
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-layout-'+this.$scope.item.name, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').addClass('over');
					} else {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
				
				this.$scope.$on('mouseleave-layout-'+this.$scope.item.name, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
			}
			
			this.$scope.openSegments = function() {
				if(self.$scope.exploded === false) {
					self.$scope.$emit('open-diff-item', self.$scope.item);
				}
			};
			
			this.$scope.$on('open-layout-'+this.$scope.item.name, function() {
				self.openSegments();
			});
			
			this.$scope.$on('$destroy', function() {
				self.SegmentTreeDiffService.onDestroy();
			});
		}
		
		openSegments() {
			var self = this;
			
			// Register this Panel with our diff service
			this.SegmentTreeDiffService.addPanel(this.$scope.deploymentID);
			
			// Register onComplete function for diff service
			this.SegmentTreeDiffService.onComplete(this.$scope.deploymentID, function(segments) {
				self.$scope.segments = segments;
				
				self._injectLayoutName(self.$scope.segments);
				
				self._render();
			});

			// Call Layout details first
			this.APIService.get('layout/latest/'+this.$scope.item.id+'/p/'+this.$scope.deploymentID).success(function(layout) {
				self.$scope.layout = layout;
				
				// Then get all the segments
				if(self.$scope.layout === null) {
					self.SegmentTreeDiffService.setData(self.$scope.deploymentID, []);
					self.$scope.layout = {
						'description': 'MISSING'
					};
					self.$scope.exploded = true;
				} else {
					self.APIService.get('layout/segments/'+self.$scope.layout.id).success(function(segments) {
						self.SegmentTreeDiffService.setData(self.$scope.deploymentID, segments);
						self.$scope.exploded = true;
					});
				}
			});
		}
		
		_injectLayoutName(segment) {
			segment.layoutName = this.$scope.item.name;
			if(segment.children.length > 0) {
				for(var i in segment.children) {
					this._injectLayoutName(segment.children[i]);
				}
			}
		}
		
		_render() { 
			var dom = '<div diff-layout-segment-item></div>';
			var newScope = this.$scope.$new();
			newScope.item = this.$scope.segments;
			newScope.deploymentID = this.$scope.deploymentID;
			var $dom = this.$compile(dom)(newScope);
			this.$element.find('.segments-panel').append($dom);
		}
	}
	
	app.directive('diffLayoutItem', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/layout/diffLayoutItem.html',
			'controller': ['$scope', '$element', '$compile', 'DeploymentLevelPathService', 'APIService', 'SegmentTreeDiffService', DiffLayoutItemController]
		};
	}]);
})();