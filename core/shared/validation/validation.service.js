(function() {
	angular.module('atUI').service('ValidationService', ['APIService', function(APIService) {
		
		this.getValidationRulesFor = function(field, rules) {
			for(var i in rules) {
				if(rules[i].field_id === field.field_id) {
					return rules[i];
				}
			}
		};

	}]);
})();