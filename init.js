// ############################################
// ES6 Collections Pollyfills
(function(e){function f(a,c){function b(a){if(!this||this.constructor!==b)return new b(a);this._keys=[];this._values=[];this._itp=[];this.objectOnly=c;a&&v.call(this,a)}c||w(a,"size",{get:x});a.constructor=b;b.prototype=a;return b}function v(a){this.add?a.forEach(this.add,this):a.forEach(function(a){this.set(a[0],a[1])},this)}function d(a){this.has(a)&&(this._keys.splice(b,1),this._values.splice(b,1),this._itp.forEach(function(a){b<a[0]&&a[0]--}));return-1<b}function m(a){return this.has(a)?this._values[b]:
void 0}function n(a,c){if(this.objectOnly&&c!==Object(c))throw new TypeError("Invalid value used as weak collection key");if(c!=c||0===c)for(b=a.length;b--&&!y(a[b],c););else b=a.indexOf(c);return-1<b}function p(a){return n.call(this,this._values,a)}function q(a){return n.call(this,this._keys,a)}function r(a,c){this.has(a)?this._values[b]=c:this._values[this._keys.push(a)-1]=c;return this}function t(a){this.has(a)||this._values.push(a);return this}function h(){this._values.length=0}function z(){return k(this._itp,
this._keys)}function l(){return k(this._itp,this._values)}function A(){return k(this._itp,this._keys,this._values)}function B(){return k(this._itp,this._values,this._values)}function k(a,c,b){var g=[0],e=!1;a.push(g);return{next:function(){var f,d=g[0];!e&&d<c.length?(f=b?[c[d],b[d]]:c[d],g[0]++):(e=!0,a.splice(a.indexOf(g),1));return{done:e,value:f}}}}function x(){return this._values.length}function u(a,c){for(var b=this.entries();;){var d=b.next();if(d.done)break;a.call(c,d.value[1],d.value[0],
this)}}var b,w=Object.defineProperty,y=function(a,b){return isNaN(a)?isNaN(b):a===b};"undefined"==typeof WeakMap&&(e.WeakMap=f({"delete":d,clear:h,get:m,has:q,set:r},!0));"undefined"!=typeof Map&&(new Map).values().next||(e.Map=f({"delete":d,has:q,get:m,set:r,keys:z,values:l,entries:A,forEach:u,clear:h}));"undefined"!=typeof Set&&(new Set).values().next||(e.Set=f({has:p,add:t,"delete":d,clear:h,keys:l,values:l,entries:B,forEach:u}));"undefined"==typeof WeakSet&&(e.WeakSet=f({"delete":d,add:t,clear:h,
has:p},!0))})("undefined"!=typeof exports&&"undefined"!=typeof global?global:window);

// ############################################
// Array.indexOf Pollyfill for IE <7
(function() {
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /*, from*/) {
			var len = this.length >>> 0;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
					 ? Math.ceil(from)
					 : Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
				if (from in this &&
						this[from] === elt)
					return from;
			}
			return -1;
		};
	}
	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, ''); 
		}
	}
})();

class Observer {
	constructor() {
		this._events = new Map();
	}
	
	register(subject) {
		this._events.set(subject, []);
	}
	
	watch(subject, action) {
		this._events.get(subject).push(action);
	}
	
	notify(subject, oldValue, newValue) {
		for(let action of this._events.get(subject)) {
			action.apply(null, [oldValue, newValue]);
		}
	}
}

class BaseDiff {
	constructor() {
		if(typeof this._initDiff !== 'function') {
			throw new TypeError('Method _initDiff must be implemented');
		}
		
		this._init();
	}
	
	_init() {
		this._panels = {};
		this._panelCount = 0;
		this._dataCount = 0;
		this._order = 0;
	}
	
	addPanel(id) {
		this._panelCount++;
		this._panels[id] = {
			'data': [],
			'onComplete': null,
			'order': this._setOrder()
		};
	}
	
	_setOrder() {
		var o = this._order;
		this._order++;
		return o;
	}
	
	onComplete(id, completeCb) {
		this._panels[id].onComplete = completeCb;
	}
	
	onDestroy() {
		this._init();
	}
	
	setData(deploymentID, data) {
		this._dataCount++;
		this._panels[deploymentID].data = data;
		if(this._panelCount < 2) {
			return;
		}
		if(this._panelCount === this._dataCount) {
			this._panelCount = 0;
			this._dataCount = 0;
			this._initDiff();
		}
	}
	
	_complete(newP) {
		for(let panel in newP) {
			this._panels[panel].onComplete(newP[panel]);
		}
	}
}

// ############################################
// AngularJS INIT
(function() {
	var core = angular.module('atCore', ['RealProgress', 'angular-jwt', 'LocalStorageModule']);
	var api = angular.module('atAPI', []);

	var loginApp = angular.module('atUILogin', [
		'ngAnimate',
		'ngRoute',
		'atAPI',
		'atCore'
	]);

	var app = angular.module('atUI', [
		'xeditable', 
		'ngAnimate', 
		'ngTagsInput', 
		'ngRoute', 
		'ui.knob',  
		'angularMoment', 
		'cfp.hotkeys', 
		'ngCookies',
		'ngFx',
		'atAPI',
		'atCore',
		'ngSanitize',
		'ngDropzone',
		'chart.js'
	]);

	app.run(['editableOptions',
		function(editableOptions) {
			editableOptions.theme = 'bs3';
		}
	]);

	app.config(['$routeProvider', 'localStorageServiceProvider',
		function($routeProvider, localStorageServiceProvider) {
			$routeProvider
				.otherwise({
					'redirectTo': '/home/dashboard'
				});

			localStorageServiceProvider.setPrefix('atUI');
			localStorageServiceProvider.setStorageCookie(0);
		}
	]);
	
	loginApp.config(['localStorageServiceProvider',
        function(localStorageServiceProvider) {
			localStorageServiceProvider.setPrefix('atUI');
			localStorageServiceProvider.setStorageCookie(0);
		}
	]);

	app.service('$locationEx', ['$location', '$route', '$rootScope', 
		function($location, $route, $rootScope) {
			$location.skipReload = function () {
				var lastRoute = $route.current;
				var un = $rootScope.$on('$locationChangeSuccess', function () {
					$route.current = lastRoute;
					un();
				});
				return $location;
			};
			return $location;
		}
	]);
	
	app.config(['$httpProvider', 'jwtInterceptorProvider',
        function($httpProvider, jwtInterceptorProvider) {
            jwtInterceptorProvider.tokenGetter = ['localStorageService', 'config',
                function(localStorageService, config) {
                    if(config.url.substr(config.url.length - 5) == '.html') {
                        return null;
                    }
                    var token = localStorageService.get('token');
                    return token;
                }
            ];
    
            $httpProvider.interceptors.push('jwtInterceptor');
        }
    ]);

})();

// #############################################
// Jquery ready();
$(function() {

	// Init the Bootstrap PopOver plugin
	$('.addons').popover({
		'trigger': 'hover'
	});

	// Init the Bootstrap Tooltip
	$('.tooltipTrigger').tooltip({});
});