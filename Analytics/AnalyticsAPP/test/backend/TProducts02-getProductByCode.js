var request = require('supertest');
var should = require('should');
var assert = require('assert');

var PROD_CODE = 1;

describe('Get all products from DB.', function () {
	it('should get a JSON containing all of products', function (){
		// Insert a contact
		request('http://localhost:4242/api')
		.get('/products'+ '/' + PROD_CODE)
		.send()
		.end(function(err,res){
			res.status.should.be.equal(200);
			res.body.should.have.property('_id');
			res.body.should.have.property('name');
			res.body.should.have.property('cost');
			res.body.should.have.property('description');
			res.body.should.have.property('code');
			res.body.should.have.property('availability');
			res.body.should.have.property('image');
			res.body.should.have.property('modified');
			assert(res.body.name == "NIVEA acondicionador de cuerpo bajo la ducha piel seca bote 400 ml");
			assert(res.body.cost == 4.99);
			assert(res.body.description == "");
			assert(res.body.code == PROD_CODE);
			assert(res.body.availability == true);
			assert(res.body.image == "http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8MTAxMDh8aW1hZ2UvcG5nfGhiNS9oZGEvODgxODI3MzQ4NDgzMC5wbmd8Yjc2NWVjY2MxNmM4MTkzYjkyMjM0MDE1ZWU2MjQ3OTdkNmY0ZDcxYWQ0MTc5NTk4NDE2MzJkZDZhMTc0NzQ5Yw.png");

		});
	});
});
