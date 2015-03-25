module.exports = function(actionName, implementation, contextConfig, callback) {
  return function() {
    return implementation.call(null, contextConfig, callback);
  };
}