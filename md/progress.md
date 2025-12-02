+--------------------------------------------------------------------------+
|                                                                          |
|     + - - - - - +                                                        |
|     |           |          --------------                                | 
|     |           |          | Matching them|                              |this the character position and the speech bubble 
      |           |          --------------                                |
|     | Character |                                                        |
|     |           |                                                        |
|     | Placeholder|                                                       |
|     + - - - - - +                                                        |  
|                                                                          |              
|                                                                          |
|                                                                          |  <-- we do not want  Column headers
|                                                                          |
|                                                                          |
|   STATE: Initial (Nothing Selected)                                      |
|   ---------------------------------                                      |
|                                                                          |
|   [   Apple   ]                      [    Perro    ]                     |
|   [    Dog    ]                      [   Manzana   ]                     |  <-- Definitions are shuffled
|   [    Cat    ]                      [    Gato     ]                     |
|                                                                          |
|                                                                          |
|   STATE: "Apple" is Selected                                             |
|   ----------------------------                                           |
|                                                                          |
|  <<   Apple   >>                     [    Perro    ]                     |  <-- Selected term turns green/blue
|   [    Dog    ]                      [   Manzana   ]                     |
|   [    Cat    ]                      [    Gato     ]                     |
|                                                                          |
|                                                                          |
|   STATE: Correct Match ("Apple" + "Manzana")                             |
|   ----------------------------------------------                           |
|                                                                          |
|  {-   Apple   -}                     [    Perro    ]                     |  <-- Matched pairs are grayed out
|   [    Dog    ]                      {-   Manzana   -}                    |      and disabled.
|   [    Cat    ]                      [    Gato     ]                     |
|                                                                          |
|                                                                          |
|   STATE: Incorrect Match ("Dog" + "Gato")                                |
|   -----------------------------------------------                          |
|                                                                          |
|  {-   Apple   -}                     [    Perro    ]                     |
|  !!    Dog    !!                     {-   Manzana   -}                    |  <-- Incorrect pair shakes and turns RED
|   [    Cat    ]                      !!    Gato     !!                    |      for a moment, then resets.
|                                                                          |
+--------------------------------------------------------------------------+



+--------------------------------------------------------------------------+
|                                                                          |
|                         Fill in the blank                              |  <-- h3 title, text-white, bold
|                                                                          |
|                                                                          |
|                                                          |
|                                                          |
|                                                          |  <-- Centered placeholder
|                                                          |
|                                                           |
|                                                          |
|                                                                          |
|                                                                          |
|   STATE: Before Answering                                                |
|   -------------------------                                              |
|                                                                          |
|        +--------------------------------------------------------+        |
|        |  Turn on   [    ...   ]   the television                |        |  <-- Sentence box with placeholder
|        +--------------------------------------------------------+        |
|                                                                          |
|                                                                          |
|                      [  Turn on  ]   [   Open    ]                     |
|                      [   Close   ]   [  Turn off ]                     |  <-- All buttons are dark gray
|                                                                          |
|                                                                          |
|   STATE: After Selecting "Turn off"                                      |
|   -----------------------------------                                      |
|                                                                          |
|        +--------------------------------------------------------+        |
|        |  Turn on   [ Turn off ]   the television                 |        |  <-- Sentence box with selected answer
|        +--------------------------------------------------------+        |
|                                                                          |
|                                                                          |
|                      [  Turn on  ]   [   Open    ]                     |
|                      [   Close   ]  << Turn off >>                     |  <-- Selected button is BLUE
|                                                                          |
+--------------------------------------------------------------------------+