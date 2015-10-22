(function() {
	angular.module('atUI').directive('showErrors', function() {
		return {
			'restrict': 'A',
			'link': function(scope, element) {
				var toggleSuccess = function() {
					var inputNgEl = getInputNG();
					element.toggleClass('has-error', inputNgEl.hasClass('ng-invalid') && inputNgEl.hasClass('ng-dirty'));
					if(inputNgEl.val() === '' || inputNgEl.val() === null) {
						element.removeClass('has-success');
					}
				};

				var toggleError = function() {
					var inputNgEl = getInputNG();
					element.toggleClass('has-error', inputNgEl.hasClass('ng-invalid'));
				};

				var getInputNG = function() {
					var inputEl = element[0].querySelector('.form-control');
					var inputNgEl = angular.element(inputEl);
					return inputNgEl;
				};

				var toggleAll = function() {
					var inputNgEl = getInputNG();
					element.toggleClass('has-success', inputNgEl.hasClass('ng-valid') && inputNgEl.hasClass('ng-dirty'));
					if(inputNgEl.attr('required') === undefined) {
						toggleSuccess();
					} else {
						toggleError();
					}
				};
				
				var inputNgEl = getInputNG();
				inputNgEl.bind('blur', function() {
					toggleAll();
				});
			}
		};
	});
})();