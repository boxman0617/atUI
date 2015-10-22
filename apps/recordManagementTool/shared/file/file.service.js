(function() {
	angular.module('atUI').service('FileService', [function() {
		
		this.modal_id = '#newFileModal';

		var file = {};

		this.create = function(newFile) {
			file = newFile;
		};

		this.get = function() {
			return file;
		};

		this.clear = function() {
			file = {};
		};

		this.openModal = function() {
			var $m = $(this.modal_id);
			$m.on('shown.bs.modal', function(e) {
				$(this).find('#modal-platform').focus();
			});
			$m.modal();
		};

		this.closeModal = function() {
			$(this.modal_id).modal('hide');
		};

	}]);
})();