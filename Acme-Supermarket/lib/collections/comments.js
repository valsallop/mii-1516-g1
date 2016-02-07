var SchemaComments;

this.Comments = new Meteor.Collection('comments');

SchemaComments = new SimpleSchema({
  codePro: {
    type: Number
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
CommentsServices = {
  getComment: function (code) {
    return Comments.findOne(code);
  },
  setComment: function (code){
    Comments.update({codePro:code},{$set:
      {
        userEmail: 'admin@admin.com',
        title: "Test update comment",
        description:"Update comment"
      }}
      );
  },
  commentsExist: function (code) {
    return Comments.find({codePro:code}).count() != 0;
  }
};

Meteor.startup(function() {
  SchemaComments.i18n("schemas.comments");
  Comments.attachSchema(SchemaComments);
});