(function() {
	var app = angular.module('atUI');
	
	class AdminModalService {
		constructor(APIService) {
			this.APIService = APIService;
			this.modals = {};
		}
		
		register(name, onUp) {
			this.modals[name] = onUp;
		}
		
		up(name, data) {
			this.modals[name].apply(null, [data]);
		}
	}
	
	app.service('AdminModalService', ['APIService', AdminModalService]);
})();