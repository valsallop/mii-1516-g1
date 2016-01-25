var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get recommendation by popularity list.', function () {
	it('should get a JSON containing all of products with its popularity rank', function (){
		// Insert a contact
		request('http://localhost:4242/analytics')
		.get('/recommendation')
		.send()
		.end(function(err,res){
			assert(res != null);
			res.status.should.be.equal(200);
			res.body.should.be.instanceof(Array);
			for (var i = 0; i < res.body.length; i++) {
				res.body[i].should.have.property('code_product');
				res.body[i].should.have.property('popularity');
				assert(res.body[i].code_product >= 0);
				assert(0 <= res.body[i].popularity);
				assert(res.body[i].popularity <= 5);
			}
		});
	});
});
