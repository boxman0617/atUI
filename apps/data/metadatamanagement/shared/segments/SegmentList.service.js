(function() {
	angular.module('atUI').service('SegmentListService', ['APIService', 'AlertMessageService', 'UserService', 'SyncService', 'PlatformService',
		function(APIService, AlertMessageService, UserService, SyncService, PlatformService) {

			var _list = [];
			var _listeners = [];

			this.data = {
				'_cache': [],
				'selectedByID': null
			};

			var _postProcessSegment = function(data, cb) {
				var segment = angular.copy(data[0]);
				delete segment['checkedOutDate'];
				delete segment['checkedOutUserID'];
				delete segment['lockedDate'];
				delete segment['lockedUserID'];
				delete segment['createDate'];
				delete segment['createUserID'];
				delete segment['updateDate'];
				delete segment['updateUserID'];
				delete segment['parent'];
				delete segment['children'];
				segment.fields = data[3];
				segment.version = (parseInt(segment.version) / 100).toString();
				segment.created = {
					'on': moment(new Date(data[0].createDate)).format('MM/DD/YYYY'),
					'by': data[0].createUserID
				};
				segment.updated = {
					'on': moment(new Date(data[0].updateDate)).format('MM/DD/YYYY'),
					'by': data[0].updateUserID
				};
				segment.locked = {
					'is': (data[0].lockedDate === null) ? false : true,
					'on': moment(new Date(data[0].lockedDate)).format('MM/DD/YYYY'),
					'by': data[0].lockedUserID
				};
				segment.checked_out = {
					'is': (data[0].checkedOutDate === null) ? false : true,
					'on': moment(new Date(data[0].checkedOutDate)).format('MM/DD/YYYY'),
					'by': data[0].checkedOutUserID
				};

				var _key = 'segmentUsers';
				SyncService.addKey(_key);
				SyncService.addTo(_key, 'createdBy');
				SyncService.addTo(_key, 'updatedBy');
				SyncService.addTo(_key, 'checkedOutBy');
				SyncService.addTo(_key, 'lockedBy');
				SyncService.onComplete(_key, function() {
					cb.apply(null, [segment]);
				});

				UserService.getUser(segment.created.by, function(user) {
					segment.created.by = user;
					SyncService.syncComplete(_key, 'createdBy');
				});
				UserService.getUser(segment.updated.by, function(user) {
					segment.updated.by = user;
					SyncService.syncComplete(_key, 'updatedBy');
				});
				if(segment.checked_out.by !== null) {
					UserService.getUser(segment.checked_out.by, function(user) {
						segment.checked_out.by = user;
						SyncService.syncComplete(_key, 'checkedOutBy');
					});
				} else {
					SyncService.syncComplete(_key, 'checkedOutBy');
				}
				if(segment.locked.by !== null) {
					UserService.getUser(segment.locked.by, function(user) {
						segment.locked.by = user;
						SyncService.syncComplete(_key, 'lockedBy');
					});
				} else {
					SyncService.syncComplete(_key, 'lockedBy');
				}
			};

			this.fetchLatestSegment = function(name, cb, loading) {
				loading = typeof loading !== 'undefined' ?  loading : true;
				name = name.split(' - ')[0];
				APIService.get('segment/latest/'+name+'/p/'+PlatformService.current.id, {'raw': true, 'loadingScreen': loading})
					.success(function(data) {
						_postProcessSegment(data, function(segment) {
							cb.apply(null, [segment]);
						});
					}).error(function(err, status) {
						AlertMessageService.showError('Unable to fetch segment! ['+status+']');
					});
			};

			this.fetchByID = function(id, cb) {
				APIService.get('segment/'+id, {'raw': true})
					.success(function(data) {
						_postProcessSegment(data, function(segment) {
							cb.apply(null, [segment]);
						});
					}).error(function(err, status) {
						AlertMessageService.showError('Unable to fetch segment! ['+status+']');
					});
			};

			this.fetchByNameAndVersion = function(name, version, cb, loading) {
				loading = typeof loading !== 'undefined' ?  loading : true;
				APIService.get('segment/name/'+name+'/version/'+version+'/p/'+PlatformService.current.id, {'raw': true, 'loadingScreen': loading})
					.success(function(data) {
						_postProcessSegment(data, function(segment) {
							cb.apply(null, [segment]);
						});
					}).error(function(err, status) {
						AlertMessageService.showError('Unable to fetch segment! ['+status+']');
					});
			};

			this.fetch = function(by, cb) {
				var call = 'segment/';
				for(var name in by) {
					call += name + '/' + by[name] + '/';
				}
				APIService.get(call.substring(0, call.length - 1), {
					'loadingScreen': false
				})
				.success(function(data) {
					cb(data);
				})
				.error(function(err) {
					AlertMessageService.showError('Unable to fetch segment! ['+err+']');
				});
			};

			this.getListForLayout = function(cb) {
				APIService.get('layout/segments/all/'+PlatformService.current.id)
				.success(function(data) {
					cb.apply(null, [data]);
				})
				.error(function(err) {
					AlertMessageService.showError('Unable to fetch segment list! ['+err+']');
				});
			};

			this.getList = function(cb) {
				APIService.get('segment/all/'+PlatformService.current.id)
				.success(function(data) {
					cb.apply(null, [data]);
				})
				.error(function(err) {
					AlertMessageService.showError('Unable to fetch segment list! ['+err+']');
				});
			};

			this.refresh = function(cb) {
				cb = cb || null;

				this.getList(function(list) {
					_list = list.map(function(l) {
						return {
							'name': l,
							'show_in_list': true,
							'isSelected': false
						};
					});
					if(cb !== null)
						cb.apply(null, [_list]);

					_runOnUpdate();
				});
			};

			var _runOnUpdate = function() {
				angular.forEach(_listeners, function(cb) {
					cb.apply(null, [_list]);
				});
			};

			this.onUpdate = function(cb) {
				_listeners.push(cb);
			};

			this.getSelected = function() {
				var r = _list.filter(function(item) {
					return item.isSelected
				});
				
				if(r.length > 0) {
					return r[0];
				}
				return {};
			};

			this.select = function(segment) {
				if(segment === false) {
					_list = _list.map(function(item) {
						item.isSelected = false;
						return item;
					});
				} else {
					_list.forEach(function(l) {
						var _name = this.name;
						if(_name.indexOf(' - ') === -1) {
							_name = this.name + ' - ' + this.shortDescription;
						}

						if(l.name === _name) {
							l.isSelected = true;
						} else {
							l.isSelected = false;
						}
					}, segment);
				}
			};
		}
	]);
})();