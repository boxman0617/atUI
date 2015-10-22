(function() {
	var app = angular.module('atUI');
	
	class DiffCodeItemController {
		constructor($scope, $element, CodeDetailDiffService, CodesService) {
			this.$scope = $scope;
			this.$element = $element;
			this.CodeDetailDiffService = CodeDetailDiffService;
			this.CodesService = CodesService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.exploded = false;
			this.$scope.item.index = this.$scope.item.shortName;
			this.$scope.details = null;
			this.$scope.parent = null;
			this.$scope.item.__LEVEL = 'code';
			
			if(this.$scope.item.parentID === 0) {
				this.$scope.parent = {'shortName': '', 'groupingName': 'NONE'};
			} else {
				this.CodesService.findById(this.$scope.item.parentID, function(parent) {
					self.$scope.parent = parent;
				});
			}
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-code-'+this.$scope.item.index, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').addClass('over');
					} else {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
				
				this.$scope.$on('mouseleave-code-'+this.$scope.item.index, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
			}
			
			this.$scope.openCode = function() {
				if(self.$scope.exploded === false) {
					self.$scope.$emit('open-diff-item', self.$scope.item);
				}
			};
			
			this.$scope.$on('open-code-'+this.$scope.item.index, function() {
				self.openCode();
			});

			this.$scope.$on('$destroy', function() {
				self.CodeDetailDiffService.onDestroy();
			});
		}
		
		openCode() {
			var self = this;
			
			// Register this Panel with our diff service
			this.CodeDetailDiffService.addPanel(this.$scope.deploymentID);
			
			// Register onComplete function for diff service
			this.CodeDetailDiffService.onComplete(this.$scope.deploymentID, function(details) {
				self.$scope.details = details;
				self.$scope.exploded = true;
			});

			this.CodeDetailDiffService.setData(this.$scope.deploymentID, this.$scope.item);
		}
	}
	
	app.directive('diffCodeItem', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/codegroup/code/diffCodeItem.html',
			'controller': ['$scope', '$element', 'CodeDetailDiffService', 'CodesService', DiffCodeItemController]
		};
	}]);
})();