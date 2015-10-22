(function() {
	angular.module('atUI').service('FilesStoreService', ['$log', function($log) {

		var ref = this;

		this.firstLoad = true;
		this.idbIsReady = false;
		
		this.filesStore = new IDBStore({
			'dbVersion': 1,
			'storeName': 'savedFiles',
			'keyPath': 'id',
			'autoIncrement': true,
			'onStoreReady': function() {
				$log.info('Files Store is ready!');
				ref.idbIsReady = true;
				ref.firstLoadHousekeeping();
			}
		});

		this.firstLoadHousekeeping = function() {
			if(this.firstLoad) {
				this.firstLoad = false;
				this.filesStore.getAll(function(files) {
					for(var i in files) {
						if(files[i].isDeleted) {
							ref.filesStore.remove(files[i].id, function() {
								$log.info('Removed a deleted file!');
							});
						}
					}
				});
			}
		};

	}]);
})();