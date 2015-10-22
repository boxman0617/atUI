(function() {
	var app = angular.module('atUI');
	
	app.directive('codeParentModal', ['CodesService',
  		function(CodesService) {
  			return {
  				'templateUrl': 'assets/templates/apps/data/metadatamanagement/codetablemanagement/codeTableParent/_partial.html',
  				'controller': function($scope, $element) {
  					$scope.parents = [];
  					$scope.choosen = null;
  					$scope.modalCodes = [];

  					$scope.chooseParent = function(parentId) {
  						$scope.$broadcast('codes-parent-chosen', parentId);
  						$scope.choosen = null;
  						$element.modal('hide');
  					};

  					$scope.unselectParent = function() {
  						$scope.$broadcast('codes-parent-chosen', null);
  						$scope.choosen = null;
  						$element.modal('hide');	
  					};
  					
  					$scope.$on('codes-parent-chooser-open', function(e, parent) {
  						$element.modal();
  						$scope.choosen = parent;
  					});
  					
  					$element.on('hidden.bs.modal', function() {
						$scope.$apply(function() {
							$scope.modalCodes = [];
							$scope.$broadcast('autocomplete-box-modal-deselect');
							$scope.$broadcast('codes-multiedit-deselect');
						});
					});
  				}
  			};
  		}
  	]);
})();