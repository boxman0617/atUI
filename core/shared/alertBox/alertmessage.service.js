angular.module('atCore').factory('AlertMessageService', function() {
	return {
		'scope': {
			'title': '',
			'message': '',
			'buttons': [],
			'type': null
		},
		'showError': function(title, message) {
			this.scope.type = 'error';
			this.scope.title = title;
			this.scope.message = message;
			this.scope.buttons = [];

			$('#alertBox').modal();
		},
		'showQuestion': function(title, message, buttons) {
			this.scope.type = 'question';
			this.scope.title = title;
			this.scope.message = message;

			this.scope.buttons = buttons;

			$('#alertBox').modal();
		}
	};
});