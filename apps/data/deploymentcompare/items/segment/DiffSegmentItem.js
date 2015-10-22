(function() {
	var app = angular.module('atUI');
	
	class DiffSegmentItemController {
		constructor($scope, $element, FieldDiffService, SegmentDetailsDiffService, APIService, $compile) {
			this.$scope = $scope;
			this.$element = $element;
			this.FieldDiffService = FieldDiffService;
			this.SegmentDetailsDiffService = SegmentDetailsDiffService;
			this.APIService = APIService;
			this.$compile = $compile;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.exploded = false;
			this.$scope.fields = null;
			this.$scope.segment = null;
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-segment-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').addClass('over');
					} else {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
				
				this.$scope.$on('mouseleave-segment-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
			}
			
			this.$scope.$on('open-segment-'+this.$scope.item.index, function(e) {
				self.openSegment();
			});
			
			this.$scope.openSegment = function() {
				self.$scope.$emit('open-diff-item', self.$scope.item);
			}
			
			this.$scope.$on('$destroy', function() {
				self.SegmentDetailsDiffService.onDestroy();
				self.FieldDiffService.onDestroy();
			});
		}
		
		openSegment() {
			var self = this;
			
			this.FieldDiffService.addPanel(this.$scope.deploymentID);
			this.SegmentDetailsDiffService.addPanel(this.$scope.deploymentID);
			
			this.FieldDiffService.onComplete(this.$scope.deploymentID, function(fields) {
				self.$scope.fields = fields;
				
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
	
	app.directive('diffSegmentItem', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/segment/diffSegmentItem.html',
			'controller': ['$scope', '$element', 'FieldDiffService', 'SegmentDetailsDiffService', 'APIService', '$compile', DiffSegmentItemController]
		};
	}]);
})();