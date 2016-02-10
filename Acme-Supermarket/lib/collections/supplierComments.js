var SchemaSupplierComments;

this.SupplierComments = new Meteor.Collection('suppliercomments');

SchemaSupplierComments = new SimpleSchema({
  supplierId: {
    type: String
  },
  userId: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  title: {
    type: String
  },
  description: {
    type: String,
    optional: true,
    max: 1000
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
      if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
      if (this.isUpdate) {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date;
    }
  }
});


Meteor.startup(function() {
  SchemaSupplierComments.i18n("schemas.suppliercomments");
  SupplierComments.attachSchema(SchemaSupplierComments);
  
});