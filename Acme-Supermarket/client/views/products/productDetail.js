Template.productDetail.helpers({
  productDetail: function() {
  	var code = FlowRouter.getParam("code");
    return Products.find({code:parseInt(code)});
  },
  comments: function() {
    var code = FlowRouter.getParam("code");
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
  },
  userEmail: function () {
    var useremail = Meteor.users.find({_id:this.userId});
    return this.userId;
  }
});

var commentsHooks = {
  before: {
    insert: function(doc) {
      if(Meteor.userId()){
        doc.userId = Meteor.userId();
        doc.codePro = parseInt(FlowRouter.getParam("code"));
        return doc;
      }
    }
  }
}

AutoForm.addHooks('insertComments', commentsHooks);



Template.productFormDetail.events({

    'click .idAddCart': function(){
        if(Meteor.userId()){
          toastr.success("Objeto añadido", "Objeto añadido");
        }else{
          toastr.error("Debes registrarte para comprar el objeto", "Objeto no añadido");
        }
    },
    'click .idRatingProduct': function(event, template){
        if(Meteor.userId()){
          var rating = template.$('#inputRating').rateit('value');
          Ratings.insert({userId:Meteor.userId(),proId:this._id._str,rating:parseFloat(rating)});
          
          toastr.success("votacion realizada", "");
        }else{
          toastr.error("Debes registrarte para votar el objeto", "Objeto no añadido");
        }
    }
  
});

Template.productFormDetail.rendered = function () {
  this.$('.rateit').rateit();
}
