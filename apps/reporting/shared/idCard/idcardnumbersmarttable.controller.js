(function() {
	angular.module('atUI').controller('IDCardNumberSmartTable', ['$scope', '$filter', 'IDCardNumberService', function($scope, $filter, IDCardNumberService) {
			
		$scope.idCardNumberTypes = [
			{'value': 'driversLicense', 'label': 'Drivers License'},
			{'value': 'passport', 'label': 'Passport'},
			{'value': 'voterID', 'label': 'Voter ID'},
			{'value': 'securityCard', 'label': 'Security Card'}
		];

		$scope.idCardExtraChoices = {
			'driversLicense': [
				{'value': 'NSW', 'label': 'NSW'},
				{'value': 'VIC', 'label': 'VIC'},
				{'value': 'QLD', 'label': 'QLD'},
				{'value': 'WA', 'label': 'WA'},
				{'value': 'SA', 'label': 'SA'},
				{'value': 'TAS', 'label': 'TAS'},
				{'value': 'ACT', 'label': 'ACT'},
				{'value': 'NT', 'label': 'NT'},
				{'value': 'Overseas', 'label': 'Overseas'}
			],
			'passport': [],
			'voterID': [],
			'securityCard': []
		};

		$scope.idCards = IDCardNumberService;

		$scope.idCardNumberTypeChanged = function(idCard) {
			if($scope.idCardExtraChoices[this.$data].length == 0) {
				idCard.extraChoices = [];
				idCard.extra = null;
				idCard.disableExtra = true;
			} else {
				idCard.extraChoices = $scope.idCardExtraChoices[this.$data];
				idCard.extra = $scope.idCardExtraChoices[this.$data][0].value;
				idCard.disableExtra = false;
			}
		};

		$scope.showIDCardNumberType = function(idCard) {
			var selected = [];
			if(idCard.type) {
				selected = $filter('filter')($scope.idCardNumberTypes, {'value': idCard.type});
			}

			return selected.length ? selected[0].label : 'Not Set';
		};

		$scope.showExtraInfo = function(idCard) {
			if($scope.idCardExtraChoices[idCard.type].length === 0) {
				return 'Not Needed'
			} else {
				var selected = [];
				if(idCard.extra) {
					selected = $filter('filter')(idCard.extraChoices, {'value': idCard.extra});
				}
				return selected.length ? selected[0].label : 'Error';
			}
		};

		$scope.removeIDCard = function(i) {
			$scope.idCards.data.splice(i, 1);
		};

		$scope.addIDCard = function() {
			$scope.inserted = {
				'id': $scope.idCards.data.length + 1,
				'number': '',
				'type': $scope.idCardNumberTypes[0].value,
				'extra': $scope.idCardExtraChoices[$scope.idCardNumberTypes[0].value][0].value,
				'extraChoices': $scope.idCardExtraChoices[$scope.idCardNumberTypes[0].value],
				'disableExtra': false
		    };
		    $scope.idCards.data.push($scope.inserted);
		    console.log($scope.idCards);
		};

		$scope.addIfFirst = function() {
			if($scope.idCards.data.length === 0) {
				$scope.addIDCard();
			}
		};

	}]);
})();