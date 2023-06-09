// author: drburnett
// date: 2023-05-01
// github: https://github.com/bryku/Orichalcum-1
let o = function(type, attr, text){
	if(arguments.length < 3){
		text = attr || '';
		attr = {};
	}
	let e = document.createElement(type);
	for(let p in attr){
		if(o.plugins[p]){
			e = o.plugins[p](e,attr[p])
		}else{
			e[p] = attr[p]
		}
	}
	if(typeof text == 'string'){
		e.append(document.createTextNode(text))
	}else if(Array.isArray(text)){
		e.append(...text)
	}else{
		e.append(text)
	}
	return e
}
o.version = '1.0.0';
o.plugins = {
	class: (e,v)=>{
		e.className = v;
		return e
	},
	styles: (e,v)=>{
		for(let s in v){
			e.style[s] = v[s]
		}
		return e
	}
};
