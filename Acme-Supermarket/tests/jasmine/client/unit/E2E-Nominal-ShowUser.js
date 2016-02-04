/*(function () {
    "use strict";
    describe("CRUD Admin Products", function () {
        // mock
        Meteor.user = function() { return {} };
 
        it("should be created by admins with name and capacity", function () {
            spyOn(Products, "insert").and.returnValue(1);
            spyOn(Roles, "userIsInRole").and.returnValue(true);
            
            Meteor.call('createProduct', 555,'Test admin',2.5,'test creacion producto','http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8MTAxMDh8aW1hZ2UvcG5nfGhiNS9oZGEvODgxODI3MzQ4NDgzMC5wbmd8Yjc2NWVjY2MxNmM4MTkzYjkyMjM0MDE1ZWU2MjQ3OTdkNmY0ZDcxYWQ0MTc5NTk4NDE2MzJkZDZhMTc0NzQ5Yw.png',2.5, 1);
            
            expect(Products.insert).toHaveBeenCalledWith({code:555,name:'Test admin',cost:2.5,description:'test creacion producto',image:'http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8MTAxMDh8aW1hZ2UvcG5nfGhiNS9oZGEvODgxODI3MzQ4NDgzMC5wbmd8Yjc2NWVjY2MxNmM4MTkzYjkyMjM0MDE1ZWU2MjQ3OTdkNmY0ZDcxYWQ0MTc5NTk4NDE2MzJkZDZhMTc0NzQ5Yw.png',rating:2.5, availability:1});
            expect(Roles.userIsInRole).toHaveBeenCalledWith({}, "admin");
        });
 
        it("should not be created by non-admins", function () {
            spyOn(Roles, "userIsInRole").and.returnValue(false);
            spyOn(Products, "insert");
 
            expect(Meteor.call('createProduct')).toThrow();
            expect(Products.insert).not.toHaveBeenCalled();
        });
 
        it("should be able to update its name and cost by admins", function () {
            spyOn(Roles, "userIsInRole").and.returnValue(true);
            spyOn(Products, "update");
 
            Meteor.call('updateProduct',1, "Product 1", 20);
 
            expect(Products.update).toHaveBeenCalledWith(1, {$set: { name: "Product 1", capacity: 20 }});
            expect(Roles.userIsInRole).toHaveBeenCalledWith({}, "admin");
        });
 
        it("should not be updated by non-admins", function () {
            spyOn(Roles, "userIsInRole").and.returnValue(false);
            spyOn(Products, "update");
 
            expect(Meteor.call('createProduct')).toThrow();
            expect(Products.update).not.toHaveBeenCalled();
            expect(Roles.userIsInRole).toHaveBeenCalledWith({}, "admin");
        });
 
        it("should be possible to delete product by admins", function () {
            spyOn(Roles, "userIsInRole").and.returnValue(true);
            spyOn(Products, "remove");
 
            Meteor.call('removeProduct',"1");
 
            expect(Products.remove).toHaveBeenCalledWith("1");
            expect(Roles.userIsInRole).toHaveBeenCalledWith({}, "admin");
        });
 
        it("should not be possible to delete product by non-admins", function () {
            spyOn(Roles, "userIsInRole").and.returnValue(false);
            spyOn(Products, "remove");
 
            expect(Meteor.call('removeProduct')).toThrow();
            expect(Products.remove).not.toHaveBeenCalled();
        });
 
    });
})();*/