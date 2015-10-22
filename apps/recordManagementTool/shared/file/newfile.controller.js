(function() {
	'use strict';
	
	angular.module('atUI').controller('NewFileController', [
		'$scope',
		'APIService',
		'$log',
		'FileModelService',
		'FileService',
		'FilesStoreService',
		'AlertMessageService',
		'ARCFieldsService',
		'FieldGroupingService',
		function($scope, APIService, $log, FileModelService, FileService, FilesStoreService, AlertMessageService, ARCFieldsService, FieldGroupingService) {

			// ## Setting "this" reference
			var ref = this;

			// ## Controller Private Properties
			this.HEADER_SEGMENT_NAME = 'ARC';
			this.filesStore = FilesStoreService.filesStore;
			this.cache = {};
			this.structures = [
				{
					'model': 'uif',
					'dependentOn': 'platform',
					'select_model': 'uifs'
				},
				{
					'model': 'uif_type',
					'dependentOn': 'uif',
					'select_model': 'uif_types'
				},
				{
					'model': 'uif_subtype',
					'dependentOn': 'uif_type',
					'select_model': 'uif_subtypes'
				}
			];

			$scope.name = '';
			$scope.created_by = 'Alan Tirado'; // @ToDo: Must change this to a service
			// SELECT MODELS: {
			$scope.platforms = [];
			$scope.uifs = [];
			$scope.uif_types = [];
			$scope.uif_substypes = [];
			// }
			
			// DATA MODELS: { 
			$scope.platform = null;
			$scope.uif = null;
			$scope.uif_type = null;
			$scope.uif_subtype = null;
			// }
			$scope.hash = null;
			$scope.header_fields = [];
			$scope.arc = FileModelService.model;
			$scope.arc_validation = {};
			$scope.arc_groups = [];
			$scope.arc_service = ARCFieldsService;

			for(var i in this.structures) {
				var dependentOn = ref.structures[i]['dependentOn'];
				$scope.$watch(dependentOn, function(newValue, oldValue) {
					var this_structure = ref.getStructure(this.exp);
					var url = this_structure['select_model']+'/';
					if(newValue !== null)
						url = url+newValue.id;

					ref.changeSelectModels(this_structure['dependentOn'], this_structure['select_model'], this_structure['model'], url, function(data) {
						$scope[this_structure['select_model']] = data['data'];
						ref.cache[this_structure['select_model']][$scope[this_structure['dependentOn']]['id']] = data['data'];
					});
				});
			}

			$scope.$watch('uif_type', function(newValue, oldValue) {
				if(newValue !== oldValue) {
					if(newValue !== null) {
						ref.createARCForm();
					} else {
						ref.removeARCForm();
					}
				}
			});

			$scope.$on('new-file-discarded', function(e) {
				$scope.uif_subtype = null;
			});
			$scope.$on('new-file-created', function(e) {
				$scope.createEmptyFile();
			});
			$scope.$on('new-file-started', function(e) {
				$log.log('New file started!');
				ref.fillScope('platforms', function(data) {
					$scope.platforms = data['data'];
				});
			});

			// ## PUBLIC METHODS
			$scope.createNewFile = function() {
				var createdOn = moment().format();
				FileService.create({
					'meta': {
						'name': $scope.name,
						'created_by': $scope.created_by,
						'created_on': createdOn,
						'updated_on': createdOn
					},
					'isDeleted': false,
					'records': {}
				});
				$scope.name = '';
				$scope.$emit('new-file-created');
			};

			/**
			 * Puts an "empty" file in the IDB Store then
			 * changes the workspace current panel to "file-editor"
			 * that holds the form for the new record
			 */
			$scope.createEmptyFile = function() {
				if(ref.idbIsReady) {
					var file = FileService.get();
					file.hash = $scope.hash;
					ref.filesStore.put(file, function(id) {
						FileService.closeModal();
						$scope.$apply(function() {
							ref.getSavedFiles(function() {
								$scope.currentPanel = 'file-editor';
							});
						});
					});
				}
			};

			$scope.discardNewFile = function() {
				$scope.name = '';
				FileService.closeModal();
				$scope.$emit('new-file-discarded');
			};

			$scope.getFieldType = function(field) {
				switch(field.class_type) {
					case 'DATE':
					case 'TIME':
					case 'STRING':
						return 'text';
					case 'LONG':
					case 'INTEGER':
						return 'number';
					default:
						return 'text';
				}
			};

			// ## PRIVATE METHODS
			
			this.removeARCForm = function() {
				$scope.arc_groups = [];
			};
			
			/**
			 * Changes the SELECT MODEL based on a depeneded MODEL,
			 * caches if needed.
			 * @param  {STRING} 	dependentTo  	MODEL that this method depends on
			 * @param  {STRING} 	select_model 	SELECT MODEL that must be filled
			 * @param  {STRING} 	model        	MODEL for SELECT MODEL
			 * @param  {STRING} 	url          	URL to fetch data for SELECT MODEL
			 * @param  {CALLBACK} 	success_cb   	Callback function for successfull fetch of SELECT MODEL data
			 * @return {BOOLEAN}              		Returns false if depended on MODEL is NULL
			 */
			this.changeSelectModels = function(dependentTo, select_model, model, url, success_cb) {
				var ref = this;
				if($scope[dependentTo] === null) {
					$scope[select_model] = [];
					$scope[model] = null;
					return false;
				}

				if(!angular.isDefined(ref.cache[select_model])) {
					ref.cache[select_model] = {};
				}

				if(!angular.isDefined(ref.cache[select_model][$scope[dependentTo]['id']])) {
					ref.fillScope(url, success_cb);
				} else {
					$scope[select_model] = ref.cache[select_model][$scope[dependentTo]['id']];
				}
			};

			/**
			 * Does the heavy work of calling the backend API
			 * @param  {STRING} url        		URL to fetch data for SELECT MODEL
			 * @param  {CALLBACK} success_cb 	Callback function for successfull fetch of SELECT MODEL data
			 */
			this.fillScope = function(url, success_cb) {
				var ref = this;

				APIService.get(url)
					.success(function(data) {
						success_cb(data);
					})
					.error(function(data, status) {
						AlertMessageService.showError('Oh no!', 'Unable to get data! ['+status+']');
					});
			};

			/**
			 * Getter method for individual structure in {this.structure}
			 * @param  {STRING} dependentOn Key "dependentOn" in structure
			 * @return {OBJECT}             Object structure
			 */
			this.getStructure = function(dependentOn) {
				for(var i in this.structures) {
					if(this.structures[i]['dependentOn'] === dependentOn)
						return this.structures[i];
				}
			};

			this.getSegmentFields = function(id, cb) {
				APIService.get('uif/'+$scope.uif.id+'/uif_type/'+$scope.uif_type.id+'/uif_subtype/'+$scope.uif_subtype.id+'/segment/'+id+'/fields')
					.success(function(data) {
						cb(data.data);
					})
					.error(function(data, status) {
						AlertMessageService.showError('Oh no!', 'Unable to get segment fields! ['+status+']');
					});
			};

			// ############################################################



			// ########
			// Steps: [
			// 	0: "Get ARC Header Segment",
			// 	1: "Get ARC Header Segment's fields",
			// 	2: "Get ARC Header Segment's fields' validation rules",
			// 	3: "Use field name to find similarities and group them",
			// 	4: "Use field/validation to create input fields in HTML (using directives)"
			// ]
			// 
			this.createARCForm = function() {
				ref.getARCHeaderSegment(function(header_segment) {
					// Setting "mock" subtype
					// // Needed for ::getSegmentFields()
					$scope.uif_subtype = {'id': 1};
					
					ref.getSegmentFields(header_segment.id, function(header_fields) {
						// Resetting "mock" subtype
						$scope.uif_subtype = null;
						$scope.header_fields = header_fields;
						
						ref.setARCModel(header_fields, function() {
							ref.getARCHeaderValidationRules(function(header_rules) {
								$scope.arc_validation = header_rules.data;
							});
						});
					});
				});
			};

			this.getARCHeaderSegment = function(cb) {
				APIService.get('uif/'+$scope.uif.id+'/uif_type/'+$scope.uif_type.id+'/uif_subtype/1/arc_segment')
					.success(function(segment) {
						cb(segment);
					})
					.error(function(data, status) {
						AlertMessageService.showError('Oh no!', 'Unable to get segments! ['+status+']');
					});
			};

			this.setARCModel = function(header_fields, cb) {
				var fields = [];
				for(var i in header_fields) {
					$scope.arc[header_fields[i].name] = null;
					fields.push(header_fields[i].name);
				}
				$scope.arc_groups = FieldGroupingService.group(fields);

				cb();
			};

			this.getARCHeaderValidationRules = function(cb) {
				APIService.get('uif/'+$scope.uif.id+'/uif_type/'+$scope.uif_type.id+'/uif_subtype/1/segment/arc_segment/validation_rules')
					.success(function(segment) {
						cb(segment);
					})
					.error(function(data, status) {
						AlertMessageService.showError('Oh no!', 'Unable to get segments! ['+status+']');
					});
			};
			
			this.setARCDefaultValues = function() {
				for(var i in $scope.header_fields) {
					if(ARCFieldsService.hasDefaultFieldValue($scope.header_fields[i])) {
						$scope.arc[$scope.header_fields[i].name] = ARCFieldsService.getDefaultFieldValue($scope.header_fields[i]);
					} else {
						$scope.arc[$scope.header_fields[i].name] = '';
					}
				}
			};
		}
	]);
	
	angular.module('atUI').filter('groupNameFilter', function() {
		return function(name) {
			if(name === '_other') {
				return 'Other';
			}
            return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
	});
})();