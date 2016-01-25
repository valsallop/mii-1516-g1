Template.productDetail.helpers({
  productDetail: function() {
  	var code = Router.current().params.code;
    return Products.find({code:parseInt(code)});
  },
  comments: function() {
    var code = Router.current().params.code;
    return Comments.find({codePro:parseInt(code)});
  }
});

Template.productFormDetail.onRendered(function(){
  this.subscribe('AvgRatings', this.data._id._str,this.data._id);
});

Template.productFormDetail.helpers({
  value:function() {
    if (this.rating == null) {
      return 0;
    }else{
      return this.rating;
    };
  }
});


Template.comment.helpers({
  createdAtFormatted: function () {
    return moment(this.createdAt).format('DD/MM/YYYY, HH:MM');
  }
});

var commentsHooks = {
  before: {
    insert: function(doc) {
      if(Meteor.userId()){
        doc.userId = Meteor.userId();
        doc.codePro = parseInt(Router.current().params.code);
		    doc.userEmail = Meteor.users.find({_id:Meteor.userId()}).fetch()[0].emails[0].address;
        return doc;
      }
    }
  }
}

AutoForm.addHooks('insertComments', commentsHooks);

Template.productFormDetail.events({

    'click .idAddCart': function(){
        if(Meteor.userId()){
          var t=TAPi18n.__("toastr_addCart", lang_tag=null);
          Meteor.call('addToCart',Router.current().params.code);
          toastr.success(t);
        }else{
          var t=TAPi18n.__("toastr_anon", lang_tag=null);
          toastr.error(t);
        }
    },
    'click .idRatingProduct': function(event, template){
        if(Meteor.userId()){
          var numVoted = Ratings.find({userId:Meteor.userId(),proId:this._id._str}).count();
          
          if(numVoted==0){
            var obj = ShoppingCarts.find({userId:Meteor.userId(), active:false, items:{$elemMatch: {productCode: this.code}}}).fetch();
            if(obj.length > 0){
              var rating = template.$('#inputRating').rateit('value');
              Ratings.insert({userId:Meteor.userId(),proId:this._id._str,rating:parseFloat(rating)});

              var t=TAPi18n.__("toastr_voted", lang_tag=null);
              toastr.success(t);
            }else{
            var t=TAPi18n.__("toastr_votedBan", lang_tag=null);
            toastr.error(t);
            }
          }else{
            var t=TAPi18n.__("toastr_votedBan", lang_tag=null);
            toastr.error(t);
          }
          
        }else{
          var t=TAPi18n.__("toastr_votedReg", lang_tag=null);
          toastr.error("Debes registrarte para votar el objeto", "Objeto no añadido");
        }
    }
  
});

Template.productFormDetail.rendered = function () {
  this.$('.rateit').rateit();
}
