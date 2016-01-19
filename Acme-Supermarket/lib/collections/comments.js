var SchemaComments;

this.Comments = new Meteor.Collection('comments');

SchemaComments = new SimpleSchema({
  codePro: {
    type: Number
  },
  userId: {
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
  SchemaComments.i18n("schemas.comments");
  Comments.attachSchema(SchemaComments);
});