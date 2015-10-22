(function() {
	angular.module('atUI').controller('OLDRecordManagementController', [
	'$scope', '$http', '$log', 'AlertMessageService', 'localStorageService', 'UserService', 'FileService', 'FilesService', 'UndoService', 'FilesStoreService', 'hotkeys', 'StoreService',
		function($scope, $http, $log, AlertMessageService, localStorageService, UserService, FileService, FilesService, UndoService, FilesStoreService, hotkeys, StoreService) {

		// ## Setting "this" reference
		var ref = this;

		// ## Controller Private Properties
		this.filesStore = FilesStoreService.filesStore;
			
		// ## Settup hotkeys
		hotkeys.add({
			'combo': 'alt+n',
			'description': 'Creates new file',
			'callback': function() {
				$scope.startNewFileProcess();
			}
		});

		$scope.filesClearActionDisabled = true;
		$scope.files = [];
		$scope.currentPanel = 'saved-files';

		StoreService.leftOffHere();

		$scope.$watch(function() {
			return FilesService.getAll();
		}, function(newValue, oldValue) {
			if(newValue.length > 0) {
				$scope.filesClearActionDisabled = false;
			}

			$scope.files = FilesService.getAll();
		});

		$scope.$watch(function() {
			return FilesStoreService.idbIsReady;
		}, function(newValue, oldValue) {
			if(newValue === true) {
				ref.getSavedFiles();
			}
		});

		// ## PUBLIC METHODS
		
		/**
		 * Opens up the "New File" modal using FileService
		 */
		$scope.startNewFileProcess = function() {
			$scope.$broadcast('new-file-started');
			FileService.openModal();
		};

		/**
		 * Determines if there is any files to show on the table
		 * by calculating the length of the {$scope.files} array
		 * and checking the isDeleted flag of the file
		 * @return {BOOLEAN} True if there is, false if not
		 */
		$scope.isThereAnyFilesToShow = function() {
			var tmpFiles = FilesService.getAll();
			if(tmpFiles.length === 0)
				return false;

			var c = 0;
			for(var i in tmpFiles) {
				if(tmpFiles[i].isDeleted)
					c = c + 1;
			}

			if(c === tmpFiles.length) {
				return false;
			}
			return true;
		};

		/**
		 * Sets the isDeleted flag on a file
		 * @param  {OBJECT} file File object to be "deleted"
		 */
		$scope.deleteFile = function(file) {
			if(ref.idbIsReady) {
				file.isDeleted = true;
				ref.filesStore.put(file, function() {
					$scope.$apply(function() {
						ref.getSavedFiles();
					});
					
					UndoService.triggerMessage(function() {
						file.isDeleted = false;
						ref.filesStore.put(file, function() {
							$scope.$apply(function() {
								ref.getSavedFiles();
							});
						});
					});
				});
			}
		};

		/**
		 * Clears all files from IDB store
		 */
		$scope.clearAll = function() {
			if(ref.idbIsReady) {
				var ids = [];
				ref.filesStore.getAll(function(files) {
					for(var i in files) {
						if(files[i].isDeleted === false) {
							files[i].isDeleted = true;
							ids.push(files[i].id);
						}
					}
					ref.filesStore.putBatch(files, function() {
						UndoService.triggerMessage(function() {
							ref.filesStore.getAll(function(files) {
								for(var i in files) {
									for(var _id in ids) {
										if(files[i].id === ids)
											files[i].isDeleted = false;
									}
								}
								ref.filesStore.putBatch(files);
							});
						});
						ref.getSavedFiles();
					});
				});
			}
		};

		// ## PRIVATE METHODS
		this.getSavedFiles = function(cb) {
			cb = cb || null;
			this.filesStore.getAll(function(files) {
				FilesService.clearAll();
				$scope.$apply(function() {
					FilesService.set(files);
					if(cb !== null)
						cb();
				})
			});
		};

	}]);
})();