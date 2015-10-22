(function() {
	var app = angular.module('atUI');

	// ## Services
	app.service('RecordLayoutCommonService', ['APIService', 'AlertMessageService', '$log', 'RecordLayoutUtilityService', 'PlatformService',
		function(APIService, AlertMessageService, $log, RecordLayoutUtilityService, PlatformService) {
			var _postProcess = function(layout) {
				var _layout = angular.copy(layout);
				var _init_segments = {
					'arc': _layout.arcid,
					'drc': _layout.drcid,
					'zrc': _layout.zrcid
				};

				delete _layout['createDate'];
				delete _layout['createUserID'];
				delete _layout['updateDate'];
				delete _layout['updateUserID'];
				delete _layout['checkedOutDate'];
				delete _layout['checkedOutUserID'];
				delete _layout['lockedDate'];
				delete _layout['lockedOutUserID'];
				delete _layout['arcid'];
				delete _layout['drcid'];
				delete _layout['zrcid'];
				delete _layout['typeID'];

				_layout.version = (parseInt(layout.version) / 100).toString();
				_layout.created = {
					'on': moment(new Date(layout.createDate)).format('MM/DD/YYYY'),
					'by': layout.createUserID
				};
				_layout.updated = {
					'on': moment(new Date(layout.updateDate)).format('MM/DD/YYYY'),
					'by': layout.updateUserID
				};
				_layout.checked_out = {
					'is': (layout.checkedOutDate === null) ? false : true,
					'on': moment(new Date(layout.checkedOutDate)).format('MM/DD/YYYY'),
					'by': layout.checkedOutUserID
				};
				_layout.locked = {
					'is': (layout.lockedDate === null) ? false : true,
					'on': moment(new Date(layout.lockedDate)).format('MM/DD/YYYY'),
					'by': layout.lockedUserID
				};
				_layout.type = layout.typeID;
				_layout.segments = {};

				return [
					_layout,
					_init_segments
				];
			};
			
			this.deleteLayout = function(layout, cb) {
				APIService.delete('layout/'+layout.id).success(function() {
					cb.apply(null, []);
				});
			};

			this.getTypeByID = function(id, cb) {
				APIService.get('datatype/'+id)
					.success(function(type) {
						cb.apply(null, [type]);
					});
			};

			this.getTypes = function(cb) {
				APIService.get('layout/types')
					.success(function(types) {
						cb.apply(null, [types]);
					})
					.error(function(err) {
						AlertMessageService.showError('Oh no!', 'Unable to fetch types! ['+err+']');
					});
			};

			this.clone = function(layoutID, cb) {
				APIService.put('layout/clone', layoutID)
					.success(function(layout) {
						cb.apply(null, [layout]);
					});
			};

			this.getLayoutVersions = function(typeID, cb) {
				APIService.get('layout/versions/type/'+typeID)
					.success(function(versions) {
						cb.apply(null, [versions]);
					});
			};

			this.getLayoutsByType = function(typeId, cb) {
				APIService.get('layout/type/'+typeId)
					.success(function(data) {
						cb.apply(null, [data]);
					});
			};

			this.addChildrenProp = function(segments) {
				for(var i in segments) {
					var latest = false;
					if(parseInt(i) === parseInt(segments.length - 1)) {
						latest = true;
					}
					segments[i] = {
						'id': segments[i].id,
						'name': segments[i].name,
						'version': segments[i].version,
						'latest': latest,
						'children': []
					};
				}
				return segments;
			};

			this.getLatestLayout = function(type, cb) {
				APIService.get('layout/latest/'+type.id+'/p/'+PlatformService.current.id)
				.success(function(data) {
					cb.apply(null, _postProcess(data));
				})
				.error(function(error, status) {
					console.log(error, status); //@ToDo: Remove this
				});
			};

			var _versionPostProxess = function(name, segs) {
				var all = [];
				for(var i in segs) {
					all.push({
						'id': segs[i].id,
						'version': (parseInt(segs[i].version) / 100).toString(),
						'name': name
					});
				}
				
				return all;
			};

			this.getLayoutSegments = function(layoutID, cb) {
				APIService.get('layout/segments/'+layoutID)
				.success(function(data) {
					var _layout = RecordLayoutUtilityService._initLayout(data);

					cb.apply(null, [_layout]);
				})
				.error(function(error, status) {
					console.log(error, status); //@ToDo: Remove this
				});
			};

			this.getInitSegments = function(cb) {
				var p = {
					'arc': null,
					'drc': null,
					'zrc': null
				};
				var ref = this;

				APIService.get('segment/versions/ARC/p/'+PlatformService.current.id)
					.success(function(arc) {
						p.arc = _versionPostProxess('ARC', arc);
						APIService.get('segment/versions/DRC/p/'+PlatformService.current.id)
							.success(function(drc) {
								p.drc = _versionPostProxess('DRC', drc);
								APIService.get('segment/versions/ZRC/p/'+PlatformService.current.id)
									.success(function(zrc) {
										p.zrc = _versionPostProxess('ZRC', zrc);
										cb.apply(null, [p]);
									})
									.error(function(err, status) {
										ref.initSegmentError('ZRC', status);
									});
							})
							.error(function(err, status) {
								ref.initSegmentError('DRC', status);
							});
					})
					.error(function(err, status) {
						ref.initSegmentError('ARC', status);
					});

				this.initSegmentError = function(name, err) {
					AlertMessageService.showError('Oh no!', 'Unable to fetch '+name+' segments!');
					$log.error('Unable to fetch '+name+' segment due to ['+err+']');
				};
			};

			var _preProcess = function(layout, init_segments) {
				var _layout = angular.copy(layout);
				var _init_segments = angular.copy(init_segments);
				_layout.init_segments = init_segments;
				if(_layout.hasOwnProperty('user')) {
					_layout.updated.by = _layout.user;
					delete _layout['user'];
				}
				delete _layout['lockedUserID'];

				_layout.version = parseFloat(layout.version) * 100;
				_layout.platformID = PlatformService.current.id;

				return _layout;
			};

			this.update = function(layout, init_segments, cb) {
				var _layout = _preProcess(layout, init_segments);
				APIService.post('layout', _layout)
					.success(function(r) {
						cb.apply(null, [r]);
					});
			};

			this.create = function(layout, init_segments, cb) {
				var _layout = _preProcess(layout, init_segments);
				APIService.put('layout', _layout)
					.success(function(r) {
						cb.apply(null, [r]);
					});	
			};
		}
	]);

	app.service('RecordLayoutService', ['APIService', 'AlertMessageService', 'PlatformService',
		function(APIService, AlertMessageService, PlatformService) {
			var _list = [];
			var _listeners = [];

			this.data = {
				'list': []
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

			this.select = function(layout) {
				if(layout === false) {
					_list = _list.map(function(item) {
						item.isSelected = false;
						return item;
					});
				} else {
					_list.forEach(function(l) {
						if(l.typeID === layout.typeID) {
							l.isSelected = true;
						} else {
							l.isSelected = false;
						}
					}, layout);
				}
			};

			this.getList = function(cb) {
				APIService.get('layout/all/'+PlatformService.current.id)
				.success(function(data) {
					cb.apply(null, [data]);
				})
				.error(function(err) {
					AlertMessageService.showError('Unable to fetch layout list! ['+err+']');
				});
			};

			this.refresh = function(cb) {
				cb = cb || null;

				this.getList(function(list) {
					_list = list.map(function(l) {
						return {
							'name': l.name,
							'typeID': l.id,
							'show_in_list': true,
							'isSelected': false
						};
					});
					if(cb !== null)
						cb.apply(null, [_list]);

					_runOnUpdate();
				});
			};
		}
	]);
})();