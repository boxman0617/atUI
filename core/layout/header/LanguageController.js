(function() {
	angular.module('atUI').directive('languageToolbarItem', ['LocaleLabels', function(LocaleLabels) {
		return {
			'templateUrl': 'assets/templates/core/layout/header/languageToolbarItem.html',
			'controller': function($scope, $element) {
				$scope.langSelected = 'English';
				
				$scope.locales = [
	      			{'id': 'en-us', 'label': 'English'}, 
	      			{'id': 'es-mx', 'label': 'Spanish'}
	      		];

	      		$scope.selectLang = function(lang) {
	      			$scope.langSelected = lang.label;
	      			LocaleLabels.refreshLabels(lang);
	      		};

	      		$scope.selectLang($scope.locales[0]);
			}
		};
	}])
})();