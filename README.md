### Orichalcum

Orichalcum is a Frontend Framework inspired by [Mithril](https://mithril.js.org/) and [Express](https://expressjs.com/), but with a micro twist... Our approach is to remove HTML from the development process and reduce memory and processing. 
&nbsp;

### Pros and Cons

Orichalcum takes a simple approach to rendering, instead of using a virutal dom or shadow dom we render directly to the document. The **plus side** is that we don't have to expend additional processing on observers or rerendering, but the **downside** is that we don't support data binding like Mithril.
&nbsp;

* Pros
    * Reduces Processing
    * Smaller File Size
* Cons
    * No Data Binding

### Size

Orichalcum comes 720b-4.4kb uncompressed depending on the plugins you need.  

* orichalcum-min.js - 720bytes
* orichalcum-plugins-router.min.js - 1.6kb
* orichalcum-plugins-fetch.min.js - 1.6kb
* orichalcum-plugins-form.min.js - 1.6kb
* orichalcum-bundle.min.js - 4.4kb (includes: min, router, fetch, form)

### Examples - Rendering to Dom

* File Example: /examples/1
* Live Example: https://replit.com/@bryku/orichalcum-example-1#index.html

```
document.body.append(
    o('h3','Hello World')
)
</script>
</body>
</html>
```

### Examples - Multiple Children

* File Example: /examples/2
* Live Example: https://replit.com/@bryku/orichalcum-example-2#index.html

```
document.body.append(
    o('div',[
        o('h3','Hello World'),
        o('p','Pizza is life!')
    ])
)
```

### Examples - Css (class, style, style)

* File Example: /examples/3
* Live Example: https://replit.com/@bryku/orichalcum-example-3#index.html

```
document.body.append(
    o('div',[
        o('h3',{class: 'text-red'},'Hello World 1'),
        o('h3',{style: 'color: green'},'Hello World 2'),
        o('h3',{styles: {color: 'blue'}},'Hello World 1'),
    ])
)
```

### Examples - Events

* File Example: /examples/4
* Live Example: https://replit.com/@bryku/orichalcum-example-4#index.html

```
document.body.append(
    o('div',[
        o('button',{onclick: (event)=>{
            console.log('You clicked me!', event)
        }},'Click Me'),
    ])
)
```

### Examples - Router

* File Example: /examples/5
* Live Example: https://replit.com/@bryku/orichalcum-example-5#index.html

```
o.router(document.body,{
    '/about': ()=>{
        return [
            o('h1','About Page'),
            o('ul',[
                o('li', o('a',{href: '/'},'Home')),
                o('li', o('a',{href: '/about'},'About')),					
            ])
        ]
    },
    '/': ()=>{
        return [
            o('h1','Home Page'),
            o('ul',[
                o('li', o('a',{href: '/'},'Home')),
                o('li', o('a',{href: '/about'},'About')),					
            ])
        ]
    },
})
```

### Examples - Reusing Components

* File Example: /examples/6
* Live Example: https://replit.com/@bryku/orichalcum-example-6#index.html

```
let nav = function(){
    return o('ul',[
        o('li', o('a',{href: '/'},'Home')),
        o('li', o('a',{href: '/about'},'About')),					
    ])
}

o.router(document.body,{
    '/about': ()=>{
        return [
            o('h1','About Page'),
            nav(),
        ]
    },
    '/': ()=>{
        return [
            o('h1','Home Page'),
            nav()
        ]
    },
})
```

### Examples - Url & Get Parameters

* File Example: /examples/7
* Live Example: https://replit.com/@bryku/orichalcum-example-7#index.html

```
let nav = function(){
    return o('ul',[
        o('li', o('a',{href: '/'},'Home')),
        o('li', o('a',{href: '/?id=test'},'Home Test')),
        o('li', o('a',{href: '/users/bryku'},'Bryku')),
    ])
}

o.router(document.body,{
    '/users/:user': (req)=>{
        return [
            o('h1','User Page: '+req.parameters.user),
            nav(),
        ]
    },
    '/': (req)=>{
        return [
            o('h1','Home Page: '+ (req.get.id || '')),
            nav()
        ]
    },
})
```
