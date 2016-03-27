SyncedCron.add({
    name: 'Automatic APriori rules ',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 2 hours');
    },
    job: function() {
      console.log("Test");
      return Meteor.call('mainApriori');
    }
});
SyncedCron.start();