/*"use strict";
describe("Backend - Nominal - CRUD", function () {
  var uId = "";
  it("Create product, comment and admin",function(){
    Meteor.call('clearDB');
    Meteor.call('createAdmin');
    uId = Accounts.createUser({email: "admin@admin.com",password: "admin"});
    Meteor.call('createObj',uId);
  });

	it("check create a product", function () {
    var result = {code: 25};
    spyOn(Products, 'findOne').and.returnValue(result);
    
    expect(ProductsServices.getProduct(25)).toBe(result);
  });

  it("check create a comment", function () {
    var result = {codePro:25};
    spyOn(Comments, 'findOne').and.returnValue(result);
    
    expect(CommentsServices.getComment(25)).toBe(result);
  });
  it("check create a shopping cart", function () {
    var result = {userId:uId};
    spyOn(ShoppingCarts, 'findOne').and.returnValue(result);
    expect(ShoppingCartsServices.getShoppingCart(uId)).toBe(result);
  });
  it("check create a user", function () {
    var result = {userId:uId};
    spyOn(Meteor.users, 'findOne').and.returnValue(result);
    expect(UsersServices.getUser(uId)).toBe(result);
  });
  
  //Update collections
  it("Update product, comment and shoppingcart",function(){
    Meteor.call('updateObj',uId);
  });
  it("check update product", function () {

    spyOn(Products, 'update');
    ProductsServices.setProduct(25);
    expect(Products.update.calls.argsFor(0)).toEqual([{code:25},{$set:
    {name : "Test update",cost : 5,description : "Test update",image : "",code : 25,rating : 2.5,availability : 1}}]);
  
  });

  it("check update comment", function () {

    spyOn(Comments, 'update');
    CommentsServices.setComment(25);
    expect(Comments.update.calls.argsFor(0)).toEqual([{codePro:25},{$set:
    {userEmail: 'admin@admin.com',title: "Test update comment",description:"Update comment"}}]);
  
  });

  it("check update shoppingcart", function () {
    spyOn(ShoppingCarts, 'update');
    ShoppingCartsServices.setShoppingCart(uId);
    expect(ShoppingCarts.update.calls.argsFor(0)).toEqual([{userId:uId}, {
      $set: { items: [{"productCode" : 25,"amount" : 1}], active:false, deliveryDate: new Date(), paymentDate: new Date()}}]);
  });

  it("check update user", function () {
    spyOn(Meteor.users, 'update');
    UsersServices.setUser(uId);
    expect(Meteor.users.update.calls.argsFor(0)).toEqual([{_id:uId},{$set:
     {name: 'Sergio',surname: 'Trigos',address: { name: 'Reina Mercedes', number: '45', postalCode: '41012' }}}]);
  });

  //remove collections
  it("Delete product, comment and shoppingcart",function(){
    Meteor.call('removeObj',uId);
  });

  it("check delete product", function () {
    var cursor = {
        count: function () {
          return 0;
        }
      };
      spyOn(Products, 'find').and.returnValue(cursor);
      expect(ProductsServices.productsExist(25)).toBe(false);
  });

  it("check delete comment", function () {

    var cursor = {
        count: function () {
          return 0;
        }
      };
      spyOn(Comments, 'find').and.returnValue(cursor);
      expect(CommentsServices.commentsExist(25)).toBe(false);
  });

  it("check delete shoppingcart", function () {
    var cursor = {
        count: function () {
          return 0;
        }
      };
      spyOn(ShoppingCarts, 'find').and.returnValue(cursor);
      expect(ShoppingCartsServices.shoppingCartsExist(uId)).toBe(false);
  });

  it("check delete user", function () {
    var cursor = {
        count: function () {
          return 0;
        }
      };
      spyOn(Meteor.users, 'find').and.returnValue(cursor);
      expect(UsersServices.usersExist(uId)).toBe(false);
  });
});*/