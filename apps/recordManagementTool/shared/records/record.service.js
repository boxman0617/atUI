(function() {
	angular.module('atUI').service('RecordService', [function() {
		
		this.modal_id = '#newRecordModal';

		var record = {};

		this.create = function(newRecord) {
			record = newRecord;
		};

		this.get = function() {
			return record;
		};

		this.clear = function() {
			record = {};
		};

		this.openModal = function() {
			var $m = $(this.modal_id);
			$m.on('shown.bs.modal', function(e) {
				$(this).find('#record_name').focus();
			});
			$m.modal();
		};

		this.closeModal = function() {
			$(this.modal_id).modal('hide');
		};

	}]);
})();