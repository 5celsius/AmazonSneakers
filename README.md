AmazonSneakers
==============

Module to Query Amazon's Product Advertising API for Shoes


Usage
-----

###Single Text Queries

You can either use a single text query:


```javascript
var AmazonRequest = require('AmazonSneakers')(ENV['AWS_KEY'], ENV['AWS_PASS']);

AmazonRequest.query('Nike', function(err, results){
	console.log('Lots of Nike Shoes ' + results);
});
```

Parameters
-----

###Brand
```javascript
AmazonRequest.query('flywire', { brand: 'nike' }, function(err, results){
	console.log('Hot FlyWire Shoes: ' + results);
});
```
###Gender
```javascript
AmazonRequest.query('jordans', { gender: 'mens' }, function(err, results){
	console.log('Manly Jordans ' + results);
});
```

###Page
```javascript
AmazonRequest.query('reebok', { page: 2 }, function(err, results){
	console.log("Will there really be 2 pages of Reebok? Lets find out: " + results);
});
```
