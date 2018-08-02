Feature: Transfer money between wallets
     Scenario Outline: Transfer Money - Positive use cases
        Given UserA have wallet balance of <amountA> and UserB have a wallet balance of <amountB>
        When  UserA transfer <transferAmount> to UserB
        Then  UserA wallet should have <balanceA> and UserB should have <balanceB> after tranfer
        
        Examples:
        | amountA | amountB | transferAmount| balanceA | balanceB | 
        | 100.50  | 150.00  | 20.00         | 80.50    | 170.00   |
        |  20.00  |  20.00  | 10.00         | 30.00    |  10.00   |


      # Assuming User Wallet Max Balance is 200.00
      Scenario Outline: Transfer Money - Negative use cases 
        Given UserA have wallet balance of <amountA> and UserB have a wallet balance of <amountB>
        When  UserA transfer <transferAmount> to UserB
        Then  App should show "<error>"
        
        Examples:
        | amountA | amountB | transferAmount| error                        | 
        | 100.50  | 150.00  | 150.00        | Insuffient Balance           |
        | 100.00  | 180.00  |  50.00        | Max Balance reached          |