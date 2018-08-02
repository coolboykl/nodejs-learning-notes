Feature: Create New Wallet
     Scenario Outline: Create a new Wallet - Positive Case
        Given I wants to test on creation of new wallet, I should ensure system reset all user recoerds
        When  I proceed to create Wallet with <email> as my user name, <password> as my password and deposit <amount> as my initial wallet balance
        Then  My wallet is created with <email> as wallet primary userid, and <newbalance> as wallet balance

        Examples:
        | email                         | password      | amount    |  newbalance |
        | "james.khoo@greenpacket.com"  | "abc123"      | 50.50     |    50.10    |
        | "khoo.james@gmail.com"        | "abc123"      | 100.00    |    100.00   |



