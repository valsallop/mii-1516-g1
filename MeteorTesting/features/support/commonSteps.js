(function() {
  'use strict';
  module.exports = function() {



    this.Given(/^I have visited Google$/, function () {
      // Write the automation code here
      browser.url('http://google.com');
    });

    this.When(/^I search for "([^"]*)"$/, function (searchTerm) {
      browser.setValue('input[name="q"]', searchTerm);
      browser.keys(['Enter']);
    });

    this.Then(/^I see "([^"]*)"$/, function (link) {
      browser.waitForExist('a=' + link);
    });

    this.Given(/^I have visited the product with code "([^"]*)"$/, function (code) {
    // Write the automation code here
      browser.url('http://localhost:3000/product/'+code);
    });

    this.Then(/^I see "([^"]*)" is "([^"]*)"$/, function (arg1, value) {
      browser.waitForExist('<h3>'+value+'</h3>');
    });


    
  };
})();