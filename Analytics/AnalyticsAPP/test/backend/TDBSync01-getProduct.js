var request = require('supertest');
var should = require('should');
var assert = require('assert');
var fs = require("fs");

describe('Get all products from WebApp REST API.', function () {
	it('should get a JSON containing all of products', function (){
		request('http://localhost:3000/collectionapi')
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
				assert(res.body[i].name.match('[A-Za-z_]+') != null);
				assert(res.body[i].cost > 0);
			}
			fs.writeFile( "response.json", JSON.stringify( {products: res.body}, null, 4 ), "utf8", function(err) {
				if(err) {
					return console.log(err);
 			   }
					console.log("The file was saved!");
			});
		});
	});
});
