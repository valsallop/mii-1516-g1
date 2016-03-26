
this.ShoppingCartsRules = new Meteor.Collection('shoppingCartsRules');
Schema = {};
Schema.shoppingCartRulesSchema = new SimpleSchema({
    purchasedProduct: {
        type: [Number]
    },
    recommendedProduct: {
        type: [Number]      
    },
    probabilityRelation: {
        type: Number,
        decimal: true
    },
    ts_process: {
        type : Date,
        optional: true
  }
});

ShoppingCartsRules.attachSchema(Schema.shoppingCartRulesSchema);