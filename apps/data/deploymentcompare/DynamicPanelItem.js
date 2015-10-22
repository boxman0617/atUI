(function() {
	var app = angular.module('atUI');
	
	class DynamicPanelItemController {
		constructor($scope, $element, $compile, DiffService) {
			this.$scope = $scope;
			this.$element = $element;
			this.$compile = $compile;
			this.DiffService = DiffService;
			
			this._initScope();
			this._init();
		}
		
		_initScope() {
			this.$scope.items = [];
		}
		
		_init() {
			this._setupDataStream();
		}
		
		_setupDataStream() {
			var self = this;
			this.DiffService.onComplete(self.$scope.deploymentId, function(diff) {
				self.$scope.items = diff;
				self._render();
			});
			
			this.$scope.itemData.onUpdate(function(items) {
				self.DiffService.setData(self.$scope.deploymentId, items.map(function(i) {
					i.index = i.name;
					return i;
				}));
			});
			
			this.$scope.mouseOver = function(item) {
				self.$scope.$emit('mouseover-diff-item', item);
			};
			
			this.$scope.mouseLeave = function(item) {
				self.$scope.$emit('mouseleave-diff-item', item);
			};
		}
		
		_getLevel() {
			var tmp = this.$scope.level.toLowerCase();
			return tmp.replace(' ', '-');
		}
		
		_render() {
			for(let item of this.$scope.items) {
				var dom = '<div ng-mouseenter="mouseOver(item)" ng-mouseleave="mouseLeave(item)" class="diff-item" diff-'+this._getLevel()+'-item></div>';
				var newScope = this.$scope.$new();
				newScope.deploymentID = this.$scope.deploymentId; 
				item.__LEVEL = this._getLevel();
				newScope.item = item;
				var el = this.$compile(dom)(newScope);
				this.$element.append(el);
			}
		}
	}
	
	app.directive('dynamicPanelItem', [function() {
		return {
			'scope': {
				'itemData': '=',
				'level': '=',
				'deploymentId': '='
			},
			'controller': ['$scope', '$element', '$compile', 'DiffService', DynamicPanelItemController]
		};
	}]);
})();