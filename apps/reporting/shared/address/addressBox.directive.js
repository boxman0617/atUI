(function() {
	angular.module('atUI').directive('addressBox', function() {
		return {
			'restrict': 'A',
			'templateUrl': 'assets/templates/apps/reporting/shared/address/addressBox.template.html'
		}
	});
})();