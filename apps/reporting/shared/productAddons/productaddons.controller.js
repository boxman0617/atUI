(function() {
	angular.module('atUI').controller('ProductAddonsController', ['$scope', function($scope) {
		$scope.productAddonsDisplay = true;
		$scope.showMore = false;
		$scope.showMoreToggleLabel = 'Show More';

		var $addonsBox = $('#productAddOnsBox');
		if($addonsBox.find('.addons').length > 4) {
			$scope.showMore = true;
			$scope.productAddonsDisplay = false;
		}

		$scope.toggleProductAddonsMoreLess = function() {
			if($scope.productAddonsDisplay === true) {
				$scope.productAddonsDisplay = false;
				$scope.showMoreToggleLabel = 'Show More';
			} else {
				$scope.productAddonsDisplay = true;
				$scope.showMoreToggleLabel = 'Show Less';
			}
		};
	}]);
})();