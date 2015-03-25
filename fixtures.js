var types = require('./type-fixtures.json');
module.exports = {
  get: function(type) {
    return JSON.parse(JSON.stringify(types[type]));
  }
}