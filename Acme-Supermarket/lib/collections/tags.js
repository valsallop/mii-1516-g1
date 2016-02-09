Tags = new Meteor.Collection('tags');
tagSchema=new SimpleSchema({
  tag: {
    type: String,
    label: "tag",
    unique: true
  }
});
Tags.attachSchema(tagSchema);