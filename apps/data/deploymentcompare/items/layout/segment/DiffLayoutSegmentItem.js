(function() {
	var app = angular.module('atUI');
	
	class DiffLayoutSegmentItemController {
		constructor($scope, $element, FieldDiffService, APIService, $compile, SegmentDetailsDiffService) {
			this.$scope = $scope;
			this.$element = $element;
			this.FieldDiffService = FieldDiffService;
			this.APIService = APIService;
			this.$compile = $compile;
			this.SegmentDetailsDiffService = SegmentDetailsDiffService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.exploded = false;
			this.$scope.fields = null;
			this.$scope.segment = null;
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-layout-segment-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').addClass('over');
					} else {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
				
				this.$scope.$on('mouseleave-layout-segment-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
			}
			
			this.$scope.$on('open-layout-segment-'+this.$scope.item.index, function(e) {
				if(self.$scope.exploded === false) {
					self.openSegment();
				}
			});
			
			this.$scope.openSegment = function() {
				self.$scope.$emit('open-diff-item', self.$scope.item);
			};
			
			this.$scope.$on('$destroy', function() {
				self.SegmentDetailsDiffService.onDestroy();
			});
		}
		
		openSegment() {
			var self = this;
			
			this.FieldDiffService.addPanel(this.$scope.deploymentID);
			this.SegmentDetailsDiffService.addPanel(this.$scope.deploymentID);
			
			this.FieldDiffService.onComplete(this.$scope.deploymentID, function(fields) {
				self.$scope.fields = fields.map(function(f) {
					f.layoutName = self.$scope.item.layoutName;
					return f;
				});
				
				self._render();
			});
			this.SegmentDetailsDiffService.onComplete(this.$scope.deploymentID, function(segment) {
				self.$scope.segment = segment;
			});
			
			this.APIService.get('segment/latest/'+this.$scope.item.name+'/p/'+this.$scope.deploymentID, {'raw': true}).success(function(data) {
				self.SegmentDetailsDiffService.setData(self.$scope.deploymentID, data[0]);
				
				self.FieldDiffService.setData(self.$scope.deploymentID, data[3]);
				self.$scope.exploded = true;
			});
		}
		
		_render() {
			var $panel = this.$element.find('.fields-panel:first');
			var dom = '<div diff-field-item></div>';
			
			for(var i in this.$scope.fields) {
				var newScope = this.$scope.$new();
				newScope.item = this.$scope.fields[i];
				newScope.deploymentID = this.$scope.deploymentID;
				var $dom = this.$compile(dom)(newScope);
				$panel.append($dom);
			}
		}
	}
	
	app.directive('diffLayoutSegmentItem', ['$compile', function($compile) {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/layout/segment/diffLayoutSegmentItem.html',
			'controller': ['$scope', '$element', 'FieldDiffService', 'APIService', '$compile', 'SegmentDetailsDiffService', DiffLayoutSegmentItemController],
			'link': function(scope, element) {
				this._render = function(item) {
					var dom = '<div diff-layout-segment-item></div>';
					var newScope = scope.$new();
					newScope.item = item;
					newScope.deploymentID = scope.deploymentID;
					if(newScope.item.hasOwnProperty('__MISSING')) {
						for(var i in newScope.item.children) {
							newScope.item.children[i].__MISSING = true;
						}
					}
					var $dom = $compile(dom)(newScope);
					element.find('.children').append($dom);
				};
				
				if(scope.item.children.length > 0) {
					for(var i in scope.item.children) {
						this._render(scope.item.children[i]);
					}
				}
			}
		};
	}]);
})();