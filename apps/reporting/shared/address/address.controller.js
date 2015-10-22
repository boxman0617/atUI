(function() {
	angular.module('atUI').controller('Address', ['$scope', 'AddressService', function($scope, AddressService) {
		$scope.addMoreReady = false;

		$scope.addresses = AddressService.getData();

		$scope.isInvalid = AddressService.isInvalid;
		
		$scope.states = [
			{'value': 'California', 'label': 'California'}
		];

		$scope.countries = [
			{'value': 'USA'},
			{'value': 'AUS'}
		];

		$scope.types = [
			{'value': 'Residence', 'label': 'Residence'},
			{'value': 'Office', 'label': 'Office'},
			{'value': 'Vacation', 'label': 'Vacation'}
		];

		$scope.statuses = [
			{'value': 'Current', 'label': 'Current'},
			{'value': 'Previous', 'label': 'Previous'}
		];

		$scope.resetAddress = {
			'street1': '',
			'city': '',
			'state': null,
			'postal': '',
			'country': $scope.countries[0].value,
			'type': null,
			'status': $scope.statuses[0].value,
			'$isDeleted': false
		};
		$scope.inputAddress = angular.copy($scope.resetAddress);
		$scope.editingAddress = angular.copy($scope.resetAddress);
		$scope.$addressRef = {};

		$scope.checkIfReadyToAdd = function() {		
			if($scope.inputAddress.street1 === '') {
				$scope.addMoreReady = false;
				return;
			}
			if($scope.inputAddress.postal === '') {
				$scope.addMoreReady = false;
				return;
			}
			$scope.addMoreReady = true;
		};

		$scope.addAddress = function() {
			$scope.addresses = AddressService.add($scope.inputAddress);
			$scope.inputAddress = angular.copy($scope.resetAddress);
			$scope.checkIfReadyToAdd();
		};

		$scope.removeAddress = function(address) {
			$scope.addresses = AddressService.remove(address);
		};

		$scope.editAddress = function(address) {
			$scope.editingAddress = angular.copy(address);
			$scope.$addressRef = address;
			$('#editingAddressModal').modal();
		}

		$scope.updateAddress = function() {
			$scope.addresses = AddressService.update($scope.$addressRef, $scope.editingAddress);
			
			$('#editingAddressModal').modal('hide');
			$scope.editingAddress = angular.copy($scope.resetAddress);
		};
	}]);
})();