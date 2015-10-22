(function() {
	var app = angular.module('atUI');
	
	class DiffGroupCodeItemController {
		constructor($scope, $element, CodeDiffService, APIService, $compile) {
			this.$scope = $scope;
			this.$element = $element;
			this.CodeDiffService = CodeDiffService;
			this.APIService = APIService;
			this.$compile = $compile;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.item.index = this.$scope.item.name;
			this.$scope.codes = null;
			this.$scope.exploded = false;
			
			if(!this.$scope.item.hasOwnProperty('__MISSING')) {
				this.$scope.$on('mouseover-code-group-'+this.$scope.item.name, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').addClass('over');
					} else {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
				
				this.$scope.$on('mouseleave-code-group-'+this.$scope.item.name, function() {
					if(!self.$scope.exploded) {
						self.$element.find('.diff-item-inner').removeClass('over');
					}
				});
			}
			
			this.$scope.openCodes = function() {
				if(self.$scope.exploded === false) {
					self.$scope.$emit('open-diff-item', self.$scope.item);
				}
			};
			
			this.$scope.$on('open-code-group-'+this.$scope.item.index, function() {
				self.openCodes();
			});
			
			this.$scope.$on('$destroy', function() {
				self.CodeDiffService.onDestroy();
			});
		}
		
		openCodes() {
			var self = this;
			
			// Register this Panel with our diff service
			this.CodeDiffService.addPanel(this.$scope.deploymentID);
			
			// Register onComplete function for diff service
			this.CodeDiffService.onComplete(this.$scope.deploymentID, function(codes) {
				self.$scope.codes = codes;
				
				self._render();
			});

			// Call Layout details first
			this.APIService.get('code/name/'+this.$scope.item.name+'/p/'+this.$scope.deploymentID).success(function(codes) {
				self.CodeDiffService.setData(self.$scope.deploymentID, codes);
				self.$scope.exploded = true;
			});
		}
		
		_render() {
			var $panel = this.$element.find('.codes-panel:first');
			var dom = '<div diff-code-item></div>';
			
			for(var i in this.$scope.codes) {
				var newScope = this.$scope.$new();
				newScope.item = this.$scope.codes[i];
				newScope.deploymentID = this.$scope.deploymentID;
				var $dom = this.$compile(dom)(newScope);
				$panel.append($dom);
			}
		}
	}
	
	app.directive('diffCodeGroupItem', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/deploymentcompare/items/codegroup/diffGroupCodeItem.html',
			'controller': ['$scope', '$element', 'CodeDiffService', 'APIService', '$compile', DiffGroupCodeItemController]
		};
	}]);
})();