var when = require('when');

function getOrders(client, number) {
  return client.commerce().order().getOrders({
    pageSize: number || 1
  });
}

function pickFirst(collection) {
  return collection.items[0];
}

function getFirstOrder(client) {
  return getOrders(client).then(pickFirst);
}

function addAnonShopperClaims(client) {
  return client.commerce().customer().customerAuthTicket().createAnonymousShopperAuthTicket().then(function(ticket) {
    client.context['user-claims'] = ticket.accessToken;
    return client;
  });
}

function createCartFromOrder(shopperClient, order) {
  var opts = {
    scope: 'NONE'
  };
  var client = shopperClient.commerce().cart();
  return client.getOrCreateCart(null, opts).then(function(cart) {
    cart.items = order.items;
    return client.updateCart(cart, opts);
  });
}

function getExampleCart(client) {
  return when.join(
   addAnonShopperClaims(client),
   getFirstOrder(client)
  ).spread(createCartFromOrder);
}


module.exports = {
  'api.commerce.order': getFirstOrder,
  'api.commerce.cart': getExampleCart
};