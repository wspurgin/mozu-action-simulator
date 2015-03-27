# Mozu Extension Test Simulator

<span style="color:red">
## This package is currently a prerelease.
This contains pre-release code. It may have behaviors or rely on features that don't work in Mozu production environments. Use with caution!
</span>

Test fixtures, harnesses, and assertions for Mozu Extensions.

Use these tools in your unit tests. It is unopinionated about your test framework, and is known to work well with [Nodeunit](https://github.com/caolan/nodeunit) and [Mocha](http://mochajs.org/) at least.

## Features

### Simulator

#### `simulate(actionName, customFunction, contextObject, callbackFunction)`
All arguments are required.
##### Arguments
 - `actionName`: *(string)* The name of the action the custom function will override. This currently doesn't change anything, but the simulator may modify its environment in the future.
 - `customFunction`: *(function)* The custom function to run inside the simulator.
 - `contextObject`: *(object)* A configuration for the context object provided to the `customFunction` at runtime. This normally has `get` and `exec` properties with business objects and accessor functions on them.
 - `callbackFunction`: *(function)* A function to be called when the `customFunction` calls its `callback` to complete its run. Right now this will just be passed in as the callback, but in the future it may be transformed. In your unit test, this should be the asynchronous resolver function, e.g. `test.done()`.

Mozu Custom Functions are implemented in server-side JavaScript, as functions which receive a context and a callback:

```js
/*
 * api.commerce.order.getShippingRates
 */
module.exports = function(context, callback) {
    // examine and/or modify context
    
    // then continue
    callback();
}
```

Use the Simulator to test this environment on your local development machine.

```js
var simulate = require('mozuxd-simulator').simulate;
var fixtures = require('mozuxd-simulator').fixtures;
var action = require('../dist/app')['api.commerce.order.beforeAddItem'];

describe('My Mozu Extension', function() {
    describe('The order.beforeAddItem custom function', function() {
        it('runs successfully and calls the doSomething context function', function(done) {
            var called = false;
            var context = {
              get: {
                order: fixtures.get('api.commerce.order')
              },
              exec: {
                doSomething: function() {
                  called = true;
                  test.equal(arguments.length, 2, "Expected doSomething function to receive 2 parameters.");
                  // other assertions
                }
              }
            };

            var callback = function() {
                assert.ok(called, "doSomething called");
                assert.ok(true, "callback called");
                done();
            }

            assert.doesNotThrow(simulate('api.commerce.order.beforeAddItem', action.customFunction, context, callback));
        });
    });
});
```

You can configure the context that your custom function receives wth fixtures and stubs of `exec` accessor functions that you can fill with more assertions.

### Fixtures

#### `fixtures.get(type)`
All arguments are required.
##### Arguments
 - `type`: *(string)* The business object type to provide. The available types are currently:
    - `api.commerce.cart`: An in-progress [Cart](http://developer.mozu.com/resources/1.14/cart).
    - `api.commerce.order`: A completed [Order](http://developer.mozu.com/resources/1.14/order). 

The simulator includes example objects for the Mozu business objects that your custom function would access at the `context.get` object. As in the example above, you can populate that context object before you pass it to the `simulate` function by using the `fixtures` collection:

```js
var fixtures = require('mozuxd-simulator').fixtures;
var context = {
  get: {
    order: fixtures.get('api.commerce.order')
  }
};
```

In production, these objects will have many possible values and configurations that may affect the behavior of your custom function. The samples in `fixtures` are meant to serve as a starting point. A new sample object is cloned every time you call `fixtures.get`, so simply modify it as you would any plain JS object.

```js
var fixtures = require('mozuxd-simulator').fixtures;
var simpleCart = fixtures.get('api.commerce.cart');
simpleCart.couponCodes = ["SAMPLE_COUPON"];
simpleCart.discountTotal = 10;
simpleCart.discountedTotal = simpleCart.discountedTotal - 10;
// now use it in your context!
```

### Assertions

The simulator also contains an assertion library, for use in your unit tests.

##### `var assert require('mozuxd-simulator').assert;`

Currently, this library has all the same methods as the [Node.js `assert` module](https://nodejs.org/api/assert.html). In the future, it may include special convenience assertions for common Mozu Extension cases.

