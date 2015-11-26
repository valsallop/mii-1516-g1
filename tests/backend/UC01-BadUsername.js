var request = require('supertest');
var should = require('should');
var assert = require('assert');


describe('Login with bad username', function () {
	it('should get a 200', function (){
		request ('http://localhost:5000')
      .post( "/api/authenticate" )
      .send( {"name":"testsdvsv","password":""} )
      .end(function(err,res){
			res.status.should.be.equal(200);
			res.body.success.should.be.equal(false);
			res.body.message.should.be.equal('Authentication failed. User not found.');
		});
	});
	
});