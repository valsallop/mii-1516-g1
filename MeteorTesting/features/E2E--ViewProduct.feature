Feature: View product

  @watch
  Scenario: View product
    Given I have visited the product with code "3"
    Then I see "Price" is "2.25"