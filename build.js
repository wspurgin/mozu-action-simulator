var fs = require('fs');
var when = require('when');
var assert = require('assert');
var client = require('mozu-node-sdk').client();
var typeGetters = require('./type-getters');
var typeJson = require('./type-fixtures.json');

assert(client.context.tenant && client.context.site, "Please provide a mozu.config.json file that specifies a tenant and site.");

console.log('Downloading fixture objects from tenant ' + client.context.tenant);
when.all(Object.keys(typeGetters).map(function(type) {
  console.log(' Requesting ' + type);
  return typeGetters[type](client).then(function(result) {
    typeJson[type] = result;
    console.log(' >> ' + type + " downloaded!!");
  })
})).then(function() {
  fs.writeFileSync('./type-fixtures.json', JSON.stringify(typeJson, null, 2), 'utf8');
}).done();