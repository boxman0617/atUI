(function() {
	var app = angular.module('atCore');
	
	class PlatformService {
		constructor(APIService, localStorageService) {
			this.APIService = APIService;
			this.localStorageService = localStorageService;
			
			this.currentPlatform = this.localStorageService.get('lastPlatform');
			this.platforms = [];
			this.cbs = [];
			this.apis = {
				'CLEAN_CREATE': 'platform',
				'DELETE': 'platform/',
				'CLONE_OFF': 'platform/clone/'
			};
		}
		
		get current() {
			return this.currentPlatform;
		}
		
		set current(platform) {
			var changed = false;
			if(this.currentPlatform !== null) {
				changed = true;
			}
			this.currentPlatform = platform;
			this.localStorageService.set('lastPlatform', this.currentPlatform);
			if(changed) {
				for(let cb of this.cbs) {
					cb.apply(null, []);
				}
			}
		}
		
		cleanCreate(deployment, cb) {
			this.APIService.put(this.apis.CLEAN_CREATE, deployment).success(function() {
				cb.apply(null, []);
			});
		}
		
		cloneBasedOnThis(newDeployment, basedOff, cb) {
			this.APIService.put(this.apis.CLONE_OFF+basedOff.id, newDeployment).success(function() {
				cb.apply(null, []);
			});
		}
		
		deletePlatform(deployment, cb) {
			this.APIService.delete(this.apis.DELETE+deployment.id).success(function() {
				cb.apply(null, []);
			});
		}
		
		onChange(cb) {
			this.cbs.push(cb);
		}
		
		getPlatforms() {
			return this.platforms;
		}
		
		fetchPlatforms(cb) {
			var self = this;
			this.APIService.get('platform/all').success(function(platforms) {
				let changed = false;
				if(!angular.equals(platforms, self.platforms)) {
					changed = true;
				}
				self.platforms = platforms;
				let currentFound = false;
				for(let p of self.platforms) {
					if(angular.equals(p, self.currentPlatform)) {
						currentFound = true;
						break;
					}
				}
				if(self.currentPlatform === null || currentFound === false) {
					self.current = self.platforms[0];
				}
				if(changed) {
					for(let cb of self.cbs) {
						cb.apply(null, []);
					}
				}
				cb.apply(null, []);
			});
		}
	}
	
	app.service('PlatformService', ['APIService', 'localStorageService', PlatformService]);
})();