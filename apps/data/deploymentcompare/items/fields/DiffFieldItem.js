(function() {
	var app = angular.module('atUI');
	
	class DiffFieldItemController {
		constructor($scope, $element, FieldDetailDiffService) {
			this.$scope = $scope;
			this.$element = $element;
			this.FieldDetailDiffService = FieldDetailDiffService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.exploded = false;
			this.$scope.details = null;
			this.$scope.item.index = '';
			this.$scope.item.__LEVEL = 'field';
			if(this.$scope.item.hasOwnProperty('layoutName')) {
				this.$scope.item.index = this.$scope.item.layoutName+'-';
			}
			this.$scope.item.index += this.$scope.item.segmentName+'-'+this.$scope.item.fieldNumber;
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-field-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').addClass('over');
					} else {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
				
				this.$scope.$on('mouseleave-field-'+this.$scope.item.index, function(e) {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner:first').removeClass('over');
					}
					
					e.preventDefault();
				});
			}
			
			this.$scope.$on('open-field-'+this.$scope.item.index, function(e) {
				if(self.$scope.exploded === false) {
					self.openField();
				}
			});
			
			this.$scope.openField = function() {
				self.$scope.item.__LEVEL = 'field';
				self.$scope.$emit('open-diff-item', self.$scope.item);
			};
			
			this.$scope.$on('$destroy', function() {
				self.FieldDetailDiffService.onDestroy();
			});
		}
		
		openField() {
			var self = this;
			
			this.FieldDetailDiffService.addPanel(this.$scope.deploymentID);
			
			this.FieldDetailDiffService.onComplete(this.$scope.deploymentID, function(details) {
				self.$scope.details = details;
				self.$scope.exploded = true;
			});
			
			this.FieldDetailDiffService.setData(this.$scope.deploymentID, this.$scope.item);
		}
	}
	
	app.directive('diffFieldItem', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/fields/diffFieldItem.html',
			'controller': ['$scope', '$element', 'FieldDetailDiffService', DiffFieldItemController]
		};
	}]);
})();