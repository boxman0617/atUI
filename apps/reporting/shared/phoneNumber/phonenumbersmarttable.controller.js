(function() {
	angular.module('atUI').controller('PhoneNumberSmartTable', [
		'$scope', 
		'$filter', 
		'PhoneNumberService', 
		function($scope, $filter, PhoneNumberService) {
			
			$scope.phoneNumberTypes = [
				{'value': 'Home'},
				{'value': 'Mobile'},
				{'value': 'Office'}
			];

			$scope.phoneNumbers = PhoneNumberService;

			$scope.showPhoneNumberType = function(phoneNumber) {
				var selected = [];
				if(phoneNumber.type) {
					selected = $filter('filter')($scope.phoneNumberTypes, {'value': phoneNumber.type});
				}

				return selected.length ? selected[0].value : 'Not Set';
			};

			$scope.removePhoneNumber = function(i) {
				$scope.phoneNumbers.data.splice(i, 1);
			};

			$scope.addPhoneNumber = function() {
				$scope.inserted = {
					'id': $scope.phoneNumbers.data.length + 1,
					'number': '',
					'type': $scope.phoneNumberTypes[0].value,
			    };
			    $scope.phoneNumbers.data.push($scope.inserted);
			};

			$scope.addIfFirst = function() {
				if($scope.phoneNumbers.data.length === 0) {
					$scope.addPhoneNumber();
				}
			};
		}
	]);
})();