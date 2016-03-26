SyncedCron.add({
    name: 'Crunch some important numbers for the marketing department',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 2 minutes');
    },
    job: function() {
      console.log("Test");
      return Meteor.call('mainApriori');
    }
});
SyncedCron.start();