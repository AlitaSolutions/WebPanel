let routes = [] ;
let routeObjs = [];
function print (path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
        let route = `${layer.method.toUpperCase()} /${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
        if (routes.includes(route)){
            return;
        }
        routeObjs.push({method :layer.method.toUpperCase() , route: path.concat(split(layer.regexp)).filter(Boolean).join('/')});
        routes.push(route);
    }
}

function split (thing) {
    if (typeof thing === 'string') {
        return thing.split('/')
    } else if (thing.fast_slash) {
        return ''
    } else {
        var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>'
    }
}

module.exports = function (app) {
    app._router.stack.forEach(print.bind(null, []));
    console.table(routeObjs);
}