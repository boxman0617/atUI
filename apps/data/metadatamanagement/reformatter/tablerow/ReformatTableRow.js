(function() {
	var app = angular.module('atUI');
	
	class ReformatTableRowController {
		constructor($scope, $element, DragService) {
			this.$scope = $scope;
			this.$element = $element;
			this.DragService = DragService;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.mappedTo = null;
			this.$scope.isOver = false;
			
			this.$scope.mouseUp = function() {
				self.mouseUp();
			};
		}
		
		mouseUp() {
			this.$scope.mappedTo = this.DragService.drop();
			if(this.$scope.mappedTo !== null) {
				this.$scope.mappedTo.__NAME = this.$scope.mappedTo.segmentName+'.'+this.$scope.mappedTo.name;
			}
		}
	}
	
	app.directive('reformatTableRow', [function() {
		return {
			'templateUrl': 'assets/templates/apps/data/metadatamanagement/reformatter/tablerow/reformatTableRow.html',
			'controller': ['$scope', '$element', 'DragService', ReformatTableRowController]
		};
	}]);
})();