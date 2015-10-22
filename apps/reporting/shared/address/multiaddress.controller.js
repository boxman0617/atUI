(function() {
	angular.module('atUI').controller('MultiAddressController', ['$scope', function($scope) {
		
		$scope.moreMode = false;

		$scope.ready = false;
		$scope.readyToAdd = false;

		$scope.addresses = [];
		
		$scope.states = [
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

		$scope.resetAddress = {
			'street1': '',
			'street2': '',
			'street3': '',
			'city': '',
			'state': null,
			'postal': '',
			'country': $scope.countries[0].value,
			'type': null,
			'status': null,
		};
		
		$scope.inputAddress = angular.copy($scope.resetAddress);
		$scope.currAddress = angular.copy($scope.resetAddress);
		$scope.currAddress.status = $scope.statuses[0];
		$scope.prevAddress = angular.copy($scope.resetAddress);
		$scope.prevAddress.status = $scope.statuses[1];

		$scope.checkIfAddressIsReady = function() {
			if($scope.currAddress.street1 === '') {
				$scope.ready = false;
				return;
			}
			if($scope.currAddress.postal === '') {
				$scope.ready = false;
				return;
			}
			if($scope.prevAddress.street1 === '') {
				$scope.ready = false;
				return;
			}
			if($scope.prevAddress.postal === '') {
				$scope.ready = false;
				return;
			}
			
			$scope.ready = true;
		};

		$scope.checkIfReadyToAdd = function() {
			if($scope.address.street1 === '') {
				$scope.readyToAdd = false;
				return;
			}
			if($scope.address.postal === '') {
				$scope.readyToAdd = false;
				return;
			}
			
			$scope.readyToAdd = true;
		};

		$scope.removeAddress = function(address) {
			var i = $scope.addresses.indexOf(address);

			$scope.addresses[i].$isDeleted = true;
		};

		$scope.addAddresses = function() {
			$scope.addresses.push($scope.currAddress);
			$scope.addresses.push($scope.prevAddress);
			$scope.currAddress = angular.copy($scope.resetAddress);
			$scope.prevAddress = angular.copy($scope.resetAddress);
		};

		$scope.addMore = function() {
			$scope.inputMode = 'opened';
			$scope.addAddresses();
		};

		$scope.addAddress = function() {
			$scope.addresses.push($scope.address);
			$scope.address = angular.copy($scope.resetAddress);
		};

	}]);
})();