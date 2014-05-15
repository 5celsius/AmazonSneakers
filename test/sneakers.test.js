var
ENV 						= require('./../.env'),
AmazonSneakers 	= require('./../lib/AmazonSneakers'),
AmazonRequest 	= AmazonSneakers(ENV['AWS_KEY'], ENV['AWS_PASS'], ENV['AWS_ASSOC_KEY']);

describe('Making a request to Amazon', function () {
	it('should return a list of shoes', function (done) {
		AmazonRequest.query('Nike', { brand : 'Brooks', page : 1, gender : 'male'}, function(err, res){						
			console.log(res);
			done(err, res);			
		});		
	});
});