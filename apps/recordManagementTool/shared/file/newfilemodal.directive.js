(function() {
	angular.module('atUI').directive('newFileModal', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, el) {
				el.find('#file_name').on('keypress', function(e) {
					var key = e.which;
					if(key === 13) {
						scope.createNewFile();
					}
				});
			}
		};
	}]);
})();