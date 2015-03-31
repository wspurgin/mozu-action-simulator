var uniq = require('lodash.uniq');

var aDs = require('mozuxd-metadata').actionDefinitions;

module.exports = uniq(aDs.actions.reduce(function(memo, action) {
  try {
  memo = memo.concat(Object.keys(action.context.get).map(function(name) {
    return action.context.get[name].type;
  }));
} catch(e) {}
return memo;
}, []));