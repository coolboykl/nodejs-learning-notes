Feature: Create New Wallet
     Scenario Outline: Scenario Outline name: Create a new Wallet - Positive Case
        Given I wants to use Kiple Wallet
        When  I wants proceed to create Wallet with <email> as my user name, <password> as my password and <amount> as my wallet balance
        Then  My wallet is created with <email> as wallet primary userid, and <amount> as wallet balance
        
        Examples:
        | email                         | password      | amount    |
        | "james.khoo@greenpacket.com"  | "abc123"      | 50        |
        | "khoo.james@gmail.com"        | "abc123"      | 100       |



