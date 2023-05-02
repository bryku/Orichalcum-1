// author: drburnett
// date: 2023-05-01
// github: https://github.com/bryku/Orichalcum-1
let o = function(eType, eAttr, eText){
	// Sorting Vars
	let type = eType;
	let attr = arguments.length == 3 ? eAttr : {};
	let text = arguments.length == 2 ? eAttr : eText || '';
	// Element
	let e = document.createElement(type);
		e.innerText = typeof text != 'object' ? text : '';
	// Attr & Events
	for (let prop in attr) {
		// Classes - attr.class
		if(prop == 'class'){
			e.className += attr.class
		}
		// Styles - attr.styles
		else if(prop == 'styles'){
			for(let style in attr.styles){
				e.style[style] = attr.styles[style]
			}
		}
		// Plugins - attr.____  (o.plugins.____)
		else if(o.plugins[prop]){
			e = o.plugins[prop](e, attr[prop])
		}
		// Properties - attr.____ (element.____)
		else{
			e[prop] = attr[prop]
		}
	}
	// Child
	if (typeof text == 'object' && Array.isArray(text)) {
		e.append(...text)
	} else if (typeof text == 'object' && text.nodeName) {
		e.append(text)
	}
	return e
}
o.version = '1.0.0';
o.plugins = {
	form: (e, v)=>{
		e.addEventListener('submit',(event)=>{
			event.preventDefault();
			let data = {};
			let form = new FormData(event.target);
			for (const [key, value] of form) {
				data[key] = value
			}
			v(event, e, data)
		});
		return e
	},
	fetch: (e, v)=>{
		if(!v.options){v.options = {method: 'GET'}}
		if(!v.options.credentials){v.options.credentials = 'include'}
		if(!v.type){v.type = 'json'}
		v.element = e;
		v.next = [];
		o.fetch(v);
		return e
	},
	href: (e, v)=>{
		e.href = v;
		if(v.indexOf('://') == -1){
			e.addEventListener('click',(event)=>{
				event.preventDefault();
				o.route(event.target.closest('a').getAttribute('href'))
			})
		}
		return e
	}
};

// Fetch
o.fetchCallback = function(callback, element, data = false){
	if(callback){
		let children = callback(element, data);
		if(children){
			children = Array.isArray(children) ? children : [children];
			element.innerHTML = '';
			element.append(...children);
		}
	}
}
o.fetchCacheMax = 9;
o.fetchCache = [];
o.fetchCheck = function(values){
	let cache = this.fetchCache.find((v)=>{return v.url == values.url});
	if(cache){
		return new Promise((res, rej)=>{
			if(cache.completed){
				res(v)
			}else{
				cache.next.push(values)
				rej("processing")
			}
		})
	}else{
		o.fetchCache.push(values);
		if(o.fetchCache.length > o.fetchCacheMax){
			o.fetchCache.shift()
		}
		return fetch(values.url, values.options)
			.then((res)=>{
				if(res.status !== 200){throw new Error("Connection Error")}
				if(values.type == 'json'){return res.json()}
				else{return res.text()}
			})
	}
}
o.fetch = function(values){
	o.fetchCallback(values.start, values.element);
	o.fetchCheck(values)
		.then((data)=>{
			o.fetchCallback(values.complete, values.element, data);
			o.fetchCache = o.fetchCache.map((v)=>{
				if(v.url == values.url){
					v.completed = true;
					v.data = data;
				}
				return v
			});
			if(values.next.length > 0){
				let nextFetch = values.next.shift();
					nextFetch.next = values.next;
				o.fetch(nextFetch)
			}
		})
		.catch((err)=>{
			if(err.message != 'processing'){
				o.fetchCallback(values.error, values.element)
			}
		})
		.finally(()=>{
			o.fetchCallback(values.finally, values.element)
		})
}
// Router
o.route = function(url = '/', body, element = o.routeElement){
	let urlArr = url.split('?');
	let r = {
		url: o.routeUrl = url,
		element: element,
		title:(title)=>{		
			document.title = title;
			history.replaceState(history.state, title, location.pathname+location.search);
		},
		parameters: {},
		get: {},
		redirect: o.route,
		body: body,
	};
	for(let route in o.routes){
		let uDir = urlArr[0].split('/');
		let rDir = route.split('/');
		// Find Matching Route
		let match = rDir.every((_,i)=>{
			if(uDir[i] == rDir[i]){// Match
				return true
			}else if(uDir[i] && rDir[i] == '*'){// Wild Card
				return true	
			}else if(uDir[i] && rDir[i].startsWith(':')){// URL Parameter
				r.parameters[rDir[i].slice(1)] = uDir[i];
				return true
			}
			return false
		});
		if(match){
			// Get Parameters
			if(urlArr[1]){
				r.get = urlArr[1].split('?').reduce((o,v,i)=>{
					let index = v.indexOf('=');
					if(index > -1){
						o[v.slice(0,index)] = v.slice(index + 1)
					}
					return o
				},{})
			}
			// Add URL State
			history.pushState(history.state, document.title, url);
			// Running Router Callback
			let elements = o.routes[route](r);
				elements = Array.isArray(elements) ? elements : [elements];
			// Rendering Router Callback
			r.element.innerHTML = '';
			r.element.append(...elements);
			return true
		}else if(o.routes['error']){
			o.routes['error'](r)
		}
	}
}
o.router = function(element, routes, interval = 100){
	o.routes = routes;
	o.routeElement = element;
	o.routeUrl = '';
	o.routeInterval = setInterval(()=>{
	    // Originally I used popstate
	    // However, it changed the behavior of the back/foward button (chrome & edge).
	    // Using setInterval() keeps the original behavior. 
	    if(o.routeUrl != location.pathname + location.search){
	        o.route(location.pathname + location.search);
	    }
    },interval)
}
