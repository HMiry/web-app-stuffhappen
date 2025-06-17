OPTIONS /api/sessions 204 0.152 ms - 0
  | POST /api/sessions 201 74.075 ms - 176
  we use these 2 for login when log in happen this is shown 
  

  and when we logout we show 
    | OPTIONS /api/sessions/current 204 0.273 ms - 0
    | DELETE /api/sessions/current 200 9.414 ms - -


when i choose select theme i use 
GET /api/themes/all 304 3.127 ms - -


and when the game start 
we have these 
OPTIONS /api/game-sessions 204 0.353 ms - 0
stuffhappens-server  | POST /api/game-sessions 201 23.649 ms - 1023
stuffhappens-server  | GET /api/game-sessions/active 200 1.519 ms - 344
stuffhappens-server  | GET /api/game-sessions/7 200 3.090 ms - 344
stuffhappens-server  | GET /api/game-sessions/7/rounds 200 1.590 ms - 907
stuffhappens-server  | [NEXT-CARD] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | GET /api/game-sessions/7/next-card 200 4.829 ms - 180


 GET /health 200 0.487 ms - 54
stuffhappens-server  | OPTIONS /api/game-sessions/7/rounds 204 0.188 ms - 0
stuffhappens-server  | [ROUNDS] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | POST /api/game-sessions/7/rounds 201 18.301 ms - 557
stuffhappens-server  | OPTIONS /api/game-sessions/7/rounds 204 0.387 ms - 0
stuffhappens-server  | [NEXT-CARD] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | [ROUNDS] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | GET /api/game-sessions/7/next-card 200 14.517 ms - 170

 POST /api/game-sessions/7/rounds 201 23.964 ms - 557
stuffhappens-server  | [NEXT-CARD] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | GET /api/game-sessions/7/next-card 200 16.018 ms - 169
stuffhappens-server  | GET /health 200 0.641 ms - 54
stuffhappens-server  | OPTIONS /api/game-sessions/7/rounds 204 0.300 ms - 0
stuffhappens-server  | [ROUNDS] SessionId: 7, Authenticated: true, User: 2
stuffhappens-server  | POST /api/game-sessions/7/rounds 201 15.892 ms - 540
stuffhappens-server  | GET /health 200 1.488 ms - 54