(function() {
	angular.module('atUI').directive('segmentField', [
		'$compile',
		'ValidationService',
		'AlertMessageService',
		'LookupService',
		function(
			$compile,
			ValidationService,
			AlertMessageService,
			LookupService) {
		
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				
				var ref = this;
				
				this.camelcaseToCapWords = function(name) {
					return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				};
				
				this.createSelectLookupField = function(_field) {
					LookupService.get(_field.lookup_group, function(data) {
						scope.$parent.$parent[_field.lookup_group] = data.data;
						scope.$parent.$parent.arc[_field.name] = null;
						
						var rule = ValidationService.getValidationRulesFor(_field, scope.$parent.$parent[attrs.sfValidation]);
						
						var is_required = '';
						var is_required_rule = null;
						if(rule !== false) {
							// Because this is a lookup field
							// we assume that the only validation
							// that is relevant is if it is mandatory
							
							for(var i in rule.rules) {
								if(rule.rules[i].operator === 'exists' && rule.rules[i].not_indicator === true) {
									is_required = ' ng-required="true"';
									is_required_rule = rule.rules[i];
									break;
								}
							}
						}
						
						var $form_group = $('<div id="field-group-'+_field.name+'" class="form-group"></div>');
						ref.injectInvalidDetection(_field);
						$form_group.append(
							$('<label for="'+_field.name+'">'+ref.camelcaseToCapWords(_field.name)+'</label>')
						);
						
						var $select_html = $('<select class="form-control field-type-'+_field.class_type.toLowerCase()+'" ng-model="'+attrs.sfModel+'.'+_field.name+'" ng-options="val.name for val in '+_field.lookup_group+' | orderBy:\'name\'" id="'+_field.name+'"'+is_required+'></select>').append(
							$('<option value="">- Choose One -</option>')
						);
						$form_group.append($select_html);
						
						var select = $compile($form_group)(scope.$parent.$parent);
						
						element.append(select);
						if(is_required !== '') {
							$('<span class="help-block" style="display: none;">'+is_required_rule.metric_description.replace('<fieldName>', '')+'</span>').insertAfter(
								$('#'+_field.name)
							);
						}
					});
				};
				
				this.createInputField = function(_field) {
					var $form_group = $('<div id="field-group-'+_field.name+'" class="form-group"></dvi>');
					this.injectInvalidDetection(_field);
					$form_group.append(
						$('<label for="'+_field.name+'">'+ref.camelcaseToCapWords(_field.name)+'</label>')
					);
					
					var $input_html = $('<input type="text" placeholder="'+_field.description+'" ng-model="'+attrs.sfModel+'.'+_field.name+'" class="form-control field-type-'+_field.class_type.toLowerCase()+'" id="'+_field.name+'">');
					$form_group.append($input_html);
					
					var input = $compile($form_group)(scope.$parent.$parent);
					
					element.append(input);
					
					//console.log(attrs.sfValidation, scope.$parent.$parent);
					var rule = ValidationService.getValidationRulesFor(_field, scope.$parent.$parent[attrs.sfValidation]);
					
					//console.log(rule);
				};
				
				this.injectInvalidDetection = function(_field) {
					scope.$parent.$parent.$watch('arc.'+_field.name, function(oldValue, newValue, scope) {
						if(oldValue !== newValue) {
							var name = this.exp.split('.')[1];
							var $f = $('#'+name);
							if(
								$f.hasClass('ng-dirty') &&
								$f.hasClass('ng-invalid')
							) {
								$f.closest('.form-group').addClass('has-error');
								$f.siblings('.help-block').slideDown();
							} else {
								$f.closest('.form-group').removeClass('has-error');
								$f.siblings('.help-block').slideUp();
							}
						}
					});
				};
				 
				//console.log(scope, attrs);
				
				var field = null;
				for(var i in scope.$parent.$parent[attrs.sfDefinitions]) {
					if(scope.field === scope.$parent.$parent[attrs.sfDefinitions][i].name) {
						field = scope.$parent.$parent[attrs.sfDefinitions][i];
						break;
					}
				}
				
				if(field === null) {
					AlertMessageService.showError('Fatal Error!', 'Unable to create field requested.');
					return;
				}
				
				if(field.lookup_group.length > 0) {
					this.createSelectLookupField(field);
				} else {
					this.createInputField(field);
				}

			}
		}

	}]);
})();