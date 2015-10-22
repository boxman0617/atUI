(function() {
	angular.module('atUI').service('HashService', [function() {

		var hash = null;

		this.save = function(newHash) {
			hash = newHash;
		};

		this.get = function() {
			return hash;
		};

	}]);
})();