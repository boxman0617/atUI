(function() {
	angular.module('atUI').directive('simpleFileList', [function() {
		return {
			'restrict': 'A',
			'templateUrl': 'public/js/ATAD/templates/simpleFileList.template.html'
		}
	}]);
})();