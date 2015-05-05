function HttpRespnose(parentContext) {
    this.parentContext = parentContext;
    this.header = {};
    this.status = 200;
    this.message = 'OK';
    this.length = null;
    this.type = 'object';
    this.get = function(key) {
        return key;
    };
    this.set = function(field, val) {
        if (arguments.length === 2) {
            if (Array.isArray(val)) {
                val = val.map(String).join(', ');
            } else {
                val = String(val);
            }
            this.header[field]= val;
        } else {
            for (var key in field) {
                this.set(key, field[key]);
            }
        }

    };
    this.redirect= function( url){
    	this.set('location', url);
    };
    this.end  = function (){
    	this.parentContext.callback();
    };


}

Object.defineProperty( HttpRespnose.prototype, 'body',{
	get:function(){ return this._body;},
	set:function (val){
		this._body = val;
		this.status= 200;
		if ( typeof(val)==='object'  ){
			this.set('Content-Type','application/json; charset=utf-8');
		}
	},
	configurable:true

});
function HttpRequest(parentContext) {
    this.parentContext = parentContext;
    this.params = {};
    this.headers = {};
    this.method = 'GET';
    this.url = 'http://mozu.com/api/foo/';
    this.path = 'api/foo/';
    this.cookies = {};
    this.query = {};
    this.href = this.url;
    this.secure = true;
    this.ip = '127.0.0.1';
    this.ips = [this.ip];
    this.body = null;
}

function HttpContext(ctx, callback) {
    this.get = ctx.get || {};
    this.exec = ctx.exec || {};
    this.response = new HttpRespnose(this);
    this.request = new HttpRequest(this);
    this.callback = callback;
}
HttpContext.create = function(ctx, callback) {
    return new HttpContext(ctx, callback);
};

module.exports = HttpContext;