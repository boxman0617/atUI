(function() {
	angular.module('atUI').service('ARCFieldsService', [function() {

		this.hiddenFields = {
			'fileCreationDate': true,
			'fileCreationTime': true,
			'fileName': true,
			'numberOfInputFiles': true,
			'fileSequenceNumber': true
		};
		this.defaultValues = {
			'fileCreationDate': 'getCurrentDate',
			'fileCreationTime': 'getCurrentTime',
			'numberOfInputFiles': function(field) {
				return 1;
			}
		};
		this.fieldTypes = {
			'currencyCode': {
				'type': 'select',
				'options': {
					'type': 'ajax',
					'src': 'currency_codes'
				}
			},
			'languageCode': {
				'type': 'select',
				'options': {
					'type': 'ajax',
					'src': 'language_codes'
				}
			}
		};
		
		this.showField = function(field) {
			if(angular.isDefined(this.hiddenFields[field.name])) {
				return false;
			}
			return true;
		};

		this.hasDefaultFieldValue = function(field) {
			if(angular.isDefined(this.defaultValues[field.name])) {
				return true;
			}
			return false;
		};

		this.getDefaultFieldValue = function(field) {
			if(typeof this.defaultValues[field.name] === 'function') {
				return this.defaultValues[field.name](field);
			}
			if(angular.isDefined(this[this.defaultValues[field.name]])) {
				return this[this.defaultValues[field.name]](field);
			}
		};

		this.getCurrentTime = function(field) {
			return moment().format('HH:MM:ss');
		};

		this.getCurrentDate = function(field) {
			return moment().format('YYYYMMDD');
		};

		this.dataSuppierInfo = function(fields) {
			var dataSuppierInfo = [];
			for(var i in fields) {
				if(fields[i].name.indexOf('dataSupplier') > -1) {
					dataSuppierInfo.push(fields[i]);
				}
			}

			return dataSuppierInfo;
		};

		this.textLocalSettingInfo = function(fields) {
			var settings = [];
			for(var i in fields) {
				if(fields[i].name.indexOf('Code') > -1) {
					settings.push(fields[i]);
				}
			}

			return settings;
		};

		this.programInfo = function(fields) {
			var info = [];
			for(var i in fields) {
				if(fields[i].name.indexOf('program') > -1) {
					info.push(fields[i]);
				}
			}

			return info;
		};

		this.softwareInfo = function(fields) {
			var info = [];
			for(var i in fields) {
				if(fields[i].name.indexOf('software') > -1) {
					info.push(fields[i]);
				}
			}

			return info;
		};

		this.getFieldType = function(field) {
			if(angular.isDefined(this.fieldTypes[field.name])) {
				return this.fieldTypes[field.name];
			}

			return false;
		};

	}]);
})();