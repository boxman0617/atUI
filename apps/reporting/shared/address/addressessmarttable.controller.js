(function() {
	angular.module('atUI').controller('AddressesSmartTable', ['$scope', '$filter', function($scope, $filter) {

		$scope.addresses = [];

		$scope.addressStates = [
			{'value': 'California'}
		];

		$scope.countries = [
			{'value': 'USA'}
		];

		$scope.types = [
			{'value': 'Residence'},
			{'value': 'Office'},
			{'value': 'Vacation'}
		];

		$scope.statuses = [
			{'value': 'Current'},
			{'value': 'Previous'}
		];

		$scope.showState = function(address) {
			var selected = [];
			if(address.state) {
				selected = $filter('filter')($scope.addressStates, {'value': address.state});
			}

			return selected.length ? selected[0].value : ' - ';
		};

		$scope.showType = function(address) {
			var selected = [];
			if(address.type) {
				selected = $filter('filter')($scope.types, {'value': address.type});
			}

			return selected.length ? selected[0].value : ' - ';
		};

		$scope.showstatus = function(address) {
			var selected = [];
			if(address.status) {
				selected = $filter('filter')($scope.statuses, {'value': address.status});
			}

			return selected.length ? selected[0].value : ' - ';
		};

		$scope.showCountry = function(address) {
			var selected = [];
			if(address.country) {
				selected = $filter('filter')($scope.countries, {'value': address.country});
			}

			return selected.length ? selected[0].value : ' - ';
		};

		$scope.removeAddress = function(i) {
			$scope.addresses.splice(i, 1);
		};

		$scope.addAddress = function() {
			$scope.inserted = {
				'id': $scope.addresses.length + 1,
				'street1': '',
				'street2': '',
				'street3': '',
				'city': '',
				'state': $scope.addressStates[0].value,
				'postal': '',
				'country': $scope.countries[0].value,
				'type': $scope.types[0].value,
				'status': $scope.statuses[0].value
		    };
		    $scope.addresses.push($scope.inserted);
		};

		$scope.addAddress();

	}]);
})();