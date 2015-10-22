(function() {
	var app = angular.module('atUI');
	
	app.config(['$routeProvider',
        function($routeProvider) {
			$routeProvider
				.when('/:parent/:child', {
					'templateUrl': function(params) {
						return ('assets/templates/apps/'+params.parent+'/'+params.child+'/main.html?e=').toLowerCase()+(new Date()).getTime();
					}
				})
				.when('/:parent/:child/perspective/:perspective', {
					'templateUrl': function(params) {
						return ('assets/templates/apps/'+params.parent+'/'+params.child+'/main.html?e=').toLowerCase()+(new Date()).getTime();
					}
				});
		}
    ]);
})();
