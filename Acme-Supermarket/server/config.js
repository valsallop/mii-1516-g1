Meteor.startup(function () {
 process.env.MAIL_URL = 'smtp://meteor@sandboxd8c0ad0d7ac14d22a31dcfdb187acaf9.mailgun.org:meteor@smtp.mailgun.org:587';});

Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  updateProfile: function (doc) {
    console.log("falete2.0");
    console.log(doc);
    Meteor.users.update(Meteor.userId(), {
      $set: { name: doc.name,
              surname: doc.surname,
              address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
              creditCard:{number:doc.creditCard.number,CVV:doc.creditCard.CVV,expMonth:doc.creditCard.expMonth,expYear:doc.creditCard.expYear}
      }   
    });
  }
});