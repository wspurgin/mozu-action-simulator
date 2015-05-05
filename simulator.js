var HttpContext = require('./httpContext');

function transformContextConfig(cfg, callback) {
    var newCfg = {
        get: {},
        exec: {}
    };

    Object.keys(cfg.get).forEach(function(key) {
        if (typeof cfg.get[key] === "function") {
            newCfg.get[key] = cfg.get[key];
        } else {
            newCfg.get[key] = function() {
                return cfg.get[key];
            };
        }
    });

    Object.keys(cfg.exec).forEach(function(key) {
        newCfg.exec[key] = cfg.exec[key];
    });

    
    switch (cfg.type) {
        case 'mozu.actions.context.api.filter':
        case 'mozu.actions.context.storefront.filter':
        case 'mozu.actions.context.http':
            return HttpContext.create(cfg, callback);
        default:
            return newCfg;
    }

}

module.exports = function(actionName, implementation, contextConfig, callback) {
    return function() {
        return implementation.call(null, transformContextConfig(contextConfig, callback), callback);
    };
};
