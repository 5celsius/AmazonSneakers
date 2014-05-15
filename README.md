AmazonSneakers
==============

Module to Query Amazon's Product Advertising API for Shoes

Usage
=====

You can either use a single text query:

```javascript
var sneakers = require('./lib/AmznReq/AmazonQuery');
sneakers.shoeRequest("Nike Jordans", function(err, result) {
    console.log('Look at all my pretty shoes!!! ' + shoes);
});
```

Or, you can supply an options object:
```javascript
var sneakers = require('./lib/AmznReq/AmazonQuery');
var options  = { brand : 'Nike', page : 1, gender : 'male'};
sneakers.shoeRequest("Jordans", options, function(err, result) {
    console.log('Look at all my pretty shoes!!! ' + shoes);
});
```


