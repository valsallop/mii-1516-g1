var addProductHooks = {
  before: {
    insert: function(doc) {
      if(Meteor.userId()){
        doc.supplierId = Meteor.userId();
        return doc;
      }
    }
  }
}

AutoForm.addHooks('insertProductForm', addProductHooks);