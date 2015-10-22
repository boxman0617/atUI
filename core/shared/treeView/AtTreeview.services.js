(function() {
	var app = angular.module('atUI');
	app.factory('ObjectToNodeService', ['$log', 'APIService', 'AlertMessageService', function($log, APIService, AlertMessageService) {
		var service = {};
		var _parentNode = null;

		var convert = function(data) {
			switch(_parentNode.child_type) {
				case 'gbif':
					return convertGbif(data);
				case 'gbif_type':
					return convertGbifType(data);
				case 'gbif_subtype':
					return convertGbifSubtype(data);
				case 'segment':
					return convertSegment(data);
				case 'mixed':
					return convertMixed(data);
			}
		};

		var convertGbif = function(gbif) {
			return {
				'node_type': 'parent',
				'type': _parentNode.child_type,
				'name': gbif.name,
				'data': gbif,
				'child_call': 'platform/'+_parentNode.data.id+'/gbif/'+gbif.id+'/gbif_types',
				'children': [],
				'child_type': 'gbif_type',
				'context_menu': [
					{
						'name': 'New GBIF Type',
						'icon': 'fa-gbif_type',
						'action': 'newGbifType',
						'context': gbif,
						'disabled': false
					},
					{
						'name': 'Delete',
						'icon': 'fa-trash',
						'action': 'deleteGbifType',
						'context': gbif,
						'disabled': true
					}
				]
			};
		};

		var convertGbifType = function(gbif_type) {
			return {
				'node_type': 'parent',
				'type': _parentNode.child_type,
				'name': gbif_type.name,
				'data': gbif_type,
				'child_call': 'platform/'+_parentNode.data.platform_id+'/gbif/'+_parentNode.data.id+'/gbif_type/'+gbif_type.id+'/gbif_subtypes',
				'children': [],
				'child_type': 'gbif_subtype',
				'context_menu': [

				]
			};
		};

		var convertGbifSubtype = function(gbif_subtype) {
			return {
				'node_type': 'parent',
				'type': _parentNode.child_type,
				'name': gbif_subtype.name,
				'data': gbif_subtype,
				'child_call': _parentNode.child_call.substring(0, _parentNode.child_call.length - 1)+'/'+gbif_subtype.id+'/segment/topparent',
				'children': [],
				'child_type': 'segment',
				'context_menu': [

				]
			};
		};

		var convertSegment = function(segment) {
			var parent_child_call = _parentNode.child_call;
			var ex = parent_child_call.split('/');
			ex = ex.splice(0, ex.length-2);
			ex = ex.join('/');

			return {
				'node_type': 'parent',
				'type': _parentNode.child_type,
				'name': segment.name,
				'data': segment,
				'child_call': ex+'/parent_segment/'+segment.id+'/segments_and_fields',
				'children': [],
				'child_type': 'mixed',
				'context_menu': [

				]
			};
		};

		var convertMixed = function(mixed) {
			var parent_child_call = _parentNode.child_call;
			var ex = parent_child_call.split('/');
			ex = ex.splice(0, ex.length-2);
			ex = ex.join('/');

			var r = {
				'node_type': 'parent',
				'type': '',
				'name': mixed.name,
				'data': mixed,
				'child_call': ex+'/parent_segment/'+mixed.id+'/segments_and_fields',
				'children': [],
				'child_type': 'mixed',
				'context_menu': [

				]
			};

			if(Object.keys(mixed).length > 5) { // Field
				r.type = 'field';
				r.node_type = 'sterile';
			} else { // segment
				r.type = 'segment';
			}

			return r;
		};

		service.setParentNode = function(parent) {
			_parentNode = parent;
		};

		service.getChildren = function(cb, errorCb) {
			if(_parentNode === null) {
				$log.error('No parent node set!');
				return null;
			}

			APIService.get(_parentNode.child_call)
			.success(function(data) {
				var converted = [];
				for(var i in data) {
					converted.push(convert(data[i]));
				}
				_parentNode.children = converted;
				cb();
			})
			.error(function(status) {
				errorCb();
				AlertMessageService.showError('Oh no!', 'Unable to get child nodes.');
			});
		};

		return service;
	}]);
})();