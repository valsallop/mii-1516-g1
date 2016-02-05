"use strict";
describe("Backend - Nominal - Product ", function () {

  beforeEach(function(){
    Meteor.call('clearDB', function(){
         Meteor.call('loadFixtures');
     });
  });

	it("create a product", function () {
    spyOn(Meteor, "user").and.returnValue({});
    spyOn(Roles, "userIsInRole").and.returnValue(true);
    spyOn(Products, 'insert');

    Meteor.call('createProduct');

    expect(Products.insert).toHaveBeenCalled();
    expect(Roles.userIsInRole).toHaveBeenCalled();
  });
  it("read products", function () {
    spyOn(Products, 'find');
    Products.find();
    expect(Products.find).toHaveBeenCalled();
  });
  it("update a product", function () {
    spyOn(Meteor, "user").and.returnValue({});
    spyOn(Roles, "userIsInRole").and.returnValue(true);
    spyOn(Products, 'update');
     
    Meteor.call('updateProduct');

    expect(Products.update).toHaveBeenCalled();
    expect(Roles.userIsInRole).toHaveBeenCalled();
  });
  it("delete a product", function () {
    spyOn(Meteor, "user").and.returnValue({});
    spyOn(Roles, "userIsInRole").and.returnValue(true);
    spyOn(Products, 'remove');
    
    Meteor.call('removeProduct');

    expect(Products.remove).toHaveBeenCalled();
    expect(Roles.userIsInRole).toHaveBeenCalled();
  });

});