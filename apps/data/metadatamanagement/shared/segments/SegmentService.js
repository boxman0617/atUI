(function() {
	var app = angular.module('atUI');

	app.service('SegmentService', ['APIService', 'PlatformService',
		function(APIService, PlatformService) {
			var _fieldFields = [
				'createUserID',
				'length',
				'createDate',
				'name',
				'codeTableName',
				'dataTypeName',
				'updateUserID',
				'updateDate',
				'description',
				'primaryKey',
				'segmentName'
			];

			var _preProccessSegment = function(segment) {
				var s = angular.copy(segment);
				if(!s.hasOwnProperty('platformID')) {
					s.platformID = PlatformService.current.id;
				}
				s.version = parseFloat(s.version) * 100;
				
				s.createDate = new Date(s.created.on);
				s.createUserID = s.created.by.userID;

				s.updateDate = new Date(s.updated.on);
				s.updateUserID = s.updated.by.userID;

				if(s.locked.is) {
					s.lockedDate = new Date(s.locked.on);
					s.lockedUserID = s.locked.by.userID;
				} else {
					s.lockedDate = null;
					s.lockedUserID = null;
				}

				if(s.checked_out.is) {
					s.checkedOutDate = new Date(s.checked_out.on);
					s.checkedOutUserID = s.checked_out.by.userID;
				} else {
					s.checkedOutDate = null;
					s.checkedOutUserID = null;
				}

				delete s['created'];
				delete s['updated'];
				delete s['checked_out'];
				delete s['locked'];
				delete s['versions'];
				delete s['has_many_versions'];

				var now = new Date();
				for(var i in s.fields) {
					if(s.fields[i].name === null || s.fields[i].name === '') {
						s.fields.splice(i, 1);
						continue;
					}
					s.fields[i].primaryKey = {
						'segmentID': -1,
						'fieldNumber': s.fields[i].fieldNumber
					};
					if(s.hasOwnProperty('id')) {
						s.fields[i].primaryKey.segmentID = s.id;
					}
					
					s.fields[i].segmentName = s.name;
					s.fields[i].createDate = now;
					s.fields[i].updateDate = now;
					s.fields[i].createUserID = s.createUserID;
					s.fields[i].updateUserID = s.createUserID;

					angular.forEach(s.fields[i], function(value, key) {
						var _found = false;
						for(_i in _fieldFields) {
							if(key === _fieldFields[_i]) {
								_found = true;
								break;
							}
						}
						if(!_found) {
							delete this[key];
						}
					}, s.fields[i]);
				}
				var fields = s.fields;
				delete s['fields'];
				s.listFields = fields;

				return s;
			};

			this.create = function(segment) {
				var s = _preProccessSegment(segment);
				return APIService.put('segment/new', s);
			};

			this.update = function(segment) {
				var s = _preProccessSegment(segment);
				return APIService.post('segment/update', s);
			};

			this.lock = function(data) {
				return APIService.post('segment/lock', data);
			};

			this.check = function(direction, data) {
				return APIService.post('segment/check/'+direction, data);
			}

			this.getVersions = function(name, cb) {
				APIService.get('segment/versions/'+name+'/p/'+PlatformService.current.id)
					.success(function(versions) {
						cb.apply(null, [versions]);
					});
			};

			this.checkUniqueName = function(name, cb) {
				APIService.get('segment/is/unique/'+name+'/p/'+PlatformService.current.id)
					.success(function(is) {
						cb.apply(null, [is]);
					});
			};
			
			this.deleteSegment = function(segment, cb) {
				APIService.delete('segment/'+segment.id).success(function() {
					cb.apply(null, []);
				});
			};
			
			this.checkForDelete = function(segment, cb) {
				APIService.get('segment/check/delete/'+segment.id).success(function(data) {
					cb.apply(null, [data]);
				});
			};
		}
	]);
})();