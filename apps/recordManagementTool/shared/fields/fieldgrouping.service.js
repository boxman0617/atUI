(function() {
	angular.module('atUI').service('FieldGroupingService', [function() {
		
		/**
		 * Groups field names based on their similarities
		 * @param {array} fields Original field names
		 * @type {array}
		 * @return {array}
		 */
		this.group = function(/* Array */ fields) {

			var groups = {};

			fields.sort();

			var alpha = {};
			for(var i in fields) {
				var firstLetter = fields[i].charAt(0);
				if(!alpha.hasOwnProperty(firstLetter))
					alpha[firstLetter] = [];

				alpha[firstLetter].push(fields[i]);
			}

			for(var letter in alpha) {

				var cont = true, i = 0, c = 0, end_count = 0, count = 0;
				var b = [];
				for(var aa in alpha[letter]) {
					end_count = end_count + alpha[letter][aa].length;
					b.push([]);
				}

				while(cont) {
					if(alpha[letter].length === 1) {
						break;
					}

					var next = i + 1;

					if(next in alpha[letter]) {

						if(alpha[letter][i].charAt(c) !== '') {
							count += 1;
						}
						
						if(
							(alpha[letter][i].charAt(c) !== '' && alpha[letter][next].charAt(c) !== '') &&
							alpha[letter][i].charAt(c) === alpha[letter][next].charAt(c)
						) {
							if(!(c in b[i]))
								b[i].push('1');
							if(!(c in b[next]))
								b[next].push('1');
						} else {
							if(!(c in b[i]))
								b[i].push('0');
							if(!(c in b[next]))
								b[next].push('0');
						}
						
						i++;
					} else {
						if(alpha[letter][i].charAt(c) !== '') {
							count += 1;
						}
						i = 0; c++;
					}


					if(count >= end_count) {
						cont = false;
					}
				}

				for(var _i in b) {
					if(b[_i].length > 0)
					{
						var mask = b[_i].join('').split('10', 1)[0].length;
						var group_name = alpha[letter][_i].substring(0, mask+1);
						if(!groups.hasOwnProperty(group_name)) {
							groups[group_name] = [];
						}

						groups[group_name].push(alpha[letter][_i]);
					} else {
						if(!groups.hasOwnProperty('_other')) {
							groups['_other'] = [];
						}

						groups['_other'].push(alpha[letter][_i]);
					}
				}
				
				var sorted_groups = [];
				for(var name in groups) {
					sorted_groups.push([name, groups[name]]);
				}
				sorted_groups.sort(function(a, b) {
					if(a[0] === '_other' || b[0] === '_other')
						return 1;
					if(a[0] < b[0])
						return -1;
					if(a[0] > b[0])
						return 1;
						
					return 0;
				});
			}
			
			return sorted_groups;

		};

	}]);
})();