(function() {
	angular.module('atUI').factory('AddressService', ['ErrorMessagesService', function(ErrorMessagesService) {
		var data = [];

		return {
			'checkIfValid': function() {
				if(data.length === 0) {
					this.isInvalid.isIt = true;
					ErrorMessagesService.msgs.push('This form requires a minimum of 1 address! Please add one.');
				} else {
					this.isInvalid.isIt = false;
				}
			},
			'add': function(address) {
				data.push(address);
				this.checkIfValid();

				return data;
			},
			'remove': function(address) {
				var i = data.indexOf(address);
				data.splice(i, 1);

				return data;
			},
			'update': function(address, updated) {
				var i = data.indexOf(address);
				data[i] = updated;

				return data;
			},
			'getData': function() {
				return data;
			},
			'isInvalid': {
				'isIt': false
			}
		};
	}]);
})();