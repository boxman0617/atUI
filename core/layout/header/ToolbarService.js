(function() {
	
	class ToolbarService extends Observer {
		constructor() {
			super();
			this.register('change');
			this.tools = [];
		}
		
		getTools() {
			return this.tools;
		}
		
		_itExists(toolID) {
			for(let i in this.tools) {
				if(toolID === this.tools[i].id) {
					return i;
				}
			}
			return false;
		}
		
		add(tool) {
			let _old = angular.copy(this.tools);
			let i = this._itExists(tool.id);
			if(i !== false) {
				this.tools[i].display = true;
				this.notify('change', _old, this.tools);
				return;
			}
			tool.display = true;
			this.tools.push(tool);
			this.notify('change', _old, this.tools);
		}
		
		remove(toolID) {
			for(let i in this.tools) {
				if(this.tools[i].id === toolID) {
					let _old = this.tools;
					this.tools[i].display = false;
					this.notify('change', _old, this.tools);
					return;
				}
			}
		}
	}
	
	angular.module('atUI').service('ToolbarService', [ToolbarService]);
})();