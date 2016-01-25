var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get all products from DB.', function () {
	it('should get a JSON containing all of products', function (){
		// Insert a contact
		request('http://localhost:4242/api')
		.get('/products')
		.send()
		.end(function(err,res){
			res.status.should.be.equal(200);
			for (var i = 0; i < res.body.length; i++) {
				res.body[i].should.have.property('_id');
				res.body[i].should.have.property('name');
				res.body[i].should.have.property('cost');
				res.body[i].should.have.property('description');
				res.body[i].should.have.property('code');
				res.body[i].should.have.property('availability');
				res.body[i].should.have.property('image');
				res.body[i].should.have.property('modified');
				assert(res.body[i].name.match('[A-Za-z_]+') != null);
				assert(res.body[i].cost > 0);
			}
			assert(res.body.length == 322);
			assert(true);
		});
	});
});
