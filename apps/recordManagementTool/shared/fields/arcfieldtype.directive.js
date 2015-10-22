(function() {
	angular.module('atUI').directive('arcFieldType', ['ARCFieldsService', '$interpolate', 'APIService', '$compile', function(ARCFieldsService, $interpolate, APIService, $compile) {
		return {
			'link': function(scope, element, attrs) {
				var field = ARCFieldsService.getFieldType(scope.$parent.field);

				if(field !== false) {
					if(field.type === 'select') {
						var exp = $interpolate('{{getFieldTypeClass(field)}}');
						var field_class = exp({
							'field': scope.$parent.field,
							'getFieldTypeClass': scope.getFieldTypeClass
						});

						var context = {
							'field': scope.$parent.field
						};

						var exp = $interpolate('{{field.name}}');
						var field_id = exp(context);

						var scope_name = 'field_ajax_'+scope.$parent.field.name;
						if(field.options.type === 'ajax') {
							scope[scope_name] = [];
							APIService.get(field.options.src)
								.success(function(data) {
									scope.$parent.$parent[scope_name] = data.data;
									scope.$parent.$parent.arc[scope.$parent.field.name] = null;
								});
						}
						var tmp_scope = scope.$parent.$parent;
						tmp_scope['field'] = scope.$parent.field;
						element.append($compile($('<select class="form-control '+field_class+'" ng-model="arc.'+field_id+'" ng-options="val.name for val in '+scope_name+' | orderBy:\'name\'" id="'+field_id+'"></select>').append(
							$('<option value="">- Choose One -</option>')
						))(tmp_scope));
					}
				} else {
					var exp = $interpolate('{{getFieldTypeClass(field)}}');
					var field_class = exp({
						'field': scope.$parent.field,
						'getFieldTypeClass': scope.getFieldTypeClass
					});

					var exp = $interpolate('{{getFieldType(field)}}');
					var field_type = exp({
						'field': scope.$parent.field,
						'getFieldType': scope.getFieldType
					});

					var context = {
						'field': scope.$parent.field
					};

					var exp = $interpolate('{{field.name}}');
					var field_id = exp(context);

					var exp = $interpolate('{{field.description}}');
					var field_placeholder = exp(context);

					element.append($compile($('<input type="'+field_type+'" class="form-control '+field_class+'" ng-model="arc.'+field_id+'" id="'+field_id+'" placeholder="'+field_placeholder+'">'))(scope.$parent.$parent));
				}
			}
		}
	}]);
})();