(function() {
	var ts = new Date().getTime();
	var map;

	var getParameter = function(param) {
			var reg = new RegExp('[&,?]' + param + '=([^\\&]*)', 'i');
			var value = reg.exec(location.search);
			return value ? value[1] : '';
	};

	// 核心库不是每次都修改就手动改版本号
	var v = {
		"zepto": "1.2.0",
		'vue': '2.6.10'
	}

	try {
		// 已经由basket管理缓存了
		ts = _app.ts;
		// 开发环境下固定
		if(_app.env == "DEV") {
			ts = "dev";
		}
		
		var debug = getParameter("DEBUG");
		if(debug) {
			ts = "debug";
			map = {
				"*": {
					"js": "src/js",
					"modules": "src/modules"
				}
			}
		}
	} catch(e) {}
	requirejs.config({
		waitSeconds: 0,
		// iloan自带构建时间戳
		// 已经由basket管理缓存了
		urlArgs: function(moduleName) {
			// 核心库不是每次都修改就手动改版本号
			if(v[moduleName]) {
				return "_v=" + v[moduleName];
			} else {
				return "_v=" + ts;
			}
		},
		baseUrl: "",
		paths: {
			// zepto
			C: 'js/common/common',
			zepto: 'libs/zepto.min',
			//vue
			vue: 'libs/vue.min',
      vueHelper: "modules/vuehelper",
			// plugins
			swiper: 'lib/swiper.min',
			echarts: 'lib/echarts.min'
		},
		map: map,
		shim: {
			'touch': {
				deps: ['zepto']
			},
			'swipe': {
				exports: 'Swipe'
			}
		}
	});

var original_loader = requirejs.load;
    var storagePrefix = 'annie_front_';
    var lcStoragePrefix = 'annie-front-omm-';
    var defaultExpiration = 5000;
    var canLoadStore = true;

	/**
	 *  请求js
	 *  @param {String} obj.url   请求的js的地址
	 *  @param {Number} obj.timeout  请求的js的超时时间
	 *  @param {Function} cb 回调
	 *      		arguments {
	 *          		{Boolean} result  请求是否成功
	 *					{String} data.content 请求的js的数据
	 *					{String} data.type  请求的js的类型
	 *      		}
	 */
	var fetch = function(opt, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open( 'GET', opt.url );

		xhr.onreadystatechange = function() {
			if ( xhr.readyState === 4 ) {
				if ( ( xhr.status === 200 ) ||
						( ( xhr.status === 0 ) && xhr.responseText ) ) {
					cb( true, {
						content: xhr.responseText,
						type: xhr.getResponseHeader('content-type')
					} );
				} else {
					cb( false, xhr.statusText );
				}
			}
		};

		setTimeout( function () {
			if( xhr.readyState < 4 ) {
				xhr.abort();
			}
		}, opt.timeout || 5000 );

		xhr.send();
	};

	/**
	 *  写入localstorge
	 *  @param {String} key   保存的key值
	 *  @param {Object} storeObj  保存的对象
	 *  return {Boolean} Result 保存成功失败
	 */
    var addLocalStorage = function(key, storeObj) {
        try {
            localStorage.setItem(storagePrefix + key, JSON.stringify(storeObj));
            return true;
        } catch (e) {
        	console.error(e);
			canLoadStore = false;
			return false;
        }
    };

	/**
	 *  包装写入对象
	 *  @param {String} obj.type   保存的js的类型
	 *  @param {Number} obj.expire   保存的js超时时间 默认5000小时
	 *  return {Object} 包装后的对象
	 */
	var wrapStoreData = function( obj, data ) {
		var now = +new Date();
		obj.unique = obj.unique;
		obj.data = data.content;
		obj.originalType = data.type;
		obj.type = obj.type || data.type;
		obj.stamp = now;
		obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );

		return obj;
	};

	/**
	 *  缓存是否可用
	 *  @param {Object} source   保存的key值
	 *  return {Boolean} Result 是否不可用
	 */
	var isCacheValid = function(source, obj) {
		return !source ||
			obj.unique !== source.unique || 
			source.expire - +new Date() < 0;
	};

	/**
	 *  获取localstorge里的数据
	 *  @param {String} key   保存的key值
	 *  return {Object|Boolean} 返回保存数据,或false
	 */
	var getData = function(key) {
		var item = localStorage.getItem( storagePrefix + key );
		try	{
			return JSON.parse( item || 'false' );
		} catch( e ) {
			return false;
		}
	};

	/**
	 *  保存数据
	 *  @param {String} obj.key  保存localstorge的key值
	 *  @param {String} obj.expire  保存数据的超时时间
	 *  @param {String} obj.url   请求的js的地址
	 *  @param {String} obj.unique   请求的js的唯一标志
	 *  @param {String} obj.type  请求的js的类型
	 *  @param {String} obj.timeout  请求的js的超时时间
	 *  @param {Function} cb 回调
	 *      		arguments {
	 *          		{Boolean} result  请求是否成功
	 *					{Object} data  js数据
	 *      		}
	 */
	var saveData = function(obj, cb) {
		var source, promise, shouldFetch;

		if ( !obj.url ) {
			cb(false);
			return;
		}

		obj.key =  ( obj.key || obj.url );
		source = getData( obj.key );
                
		shouldFetch = isCacheValid(source, obj);

		if(shouldFetch) {
			fetch({
				url: obj.url,
				timeout: obj.timeout
			}, function(result, data) {
				if (result) {
					data = wrapStoreData({type: obj.type, expire: obj.expire, unique: obj.unique}, data);
					addLocalStorage(obj.key, data);
				}
				cb(result, data);
			})
		} else {
			source.type = obj.type || source.originalType;
			cb(true, source);
		}
	}

	requirejs.load = function (context, moduleName, url) {
        try{
             var config = requirejs.s.contexts._.config || {};
            if (v[moduleName] && canLoadStore) {
                saveData({
                	key: moduleName,
                	url: url,
                	unique: v[moduleName]
                }, function(result, data) {
                	if (result) {
                		original_loader(context, moduleName, url, data.data);
                		context.completeLoad(moduleName);
                	} else {
                		original_loader(context, moduleName, url);
                	}
                });
            } else {
                original_loader(context, moduleName, url);
            }
        }catch(e){
            context.onError(e);
        }
    };
})();
