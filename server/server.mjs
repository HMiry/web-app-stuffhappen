import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {check, validationResult} from 'express-validator';
import {listUsers, getUser, authenticateUser, updateUser, deleteUser} from './collections/UserCollection.mjs';
import {listGames, getGame, addGame, updateGameStatus, getGamesByCreator, joinGame, getGamePlayers} from './collections/GameCollection.mjs';
import {listThemes, listActiveThemes, getTheme, getThemeByKey, getThemeCards, getRandomThemeCards, addTheme, updateTheme, deleteTheme, getThemeStats} from './collections/ThemeCollection.mjs';
import {createGameSession, getGameSession, getActiveGameSession, updateGameSession, addGameRound, getGameRounds, getUserGameHistory, getDetailedGameHistory, endGameSession} from './collections/GameSessionCollection.mjs';
import {listCards, getCard, getRandomCards, getCardsByIndexRange, getSimilarCards, getCardCount} from './collections/CardCollection.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// Import database
import db from './db/database.mjs';
import initDatabase from './db/init.mjs';
import seedDatabase from './db/seed.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173', // Vite dev server default port
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await authenticateUser(username, password);
  if(!user || user.error)
    return cb(null, false, user?.message || 'Authentication failed');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

// Helper function to check authentication status with more details
const checkAuth = (req) => {
  return {
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user || null,
    sessionID: req.sessionID || null
  };
}

// Helper function to determine if request is for demo
const isDemoRequest = (sessionId) => {
  return sessionId === 'demo';
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.authenticate('session'));

/* ROUTES */

// GET /api/users
app.get('/api/users', (req, res) => {
  listUsers()
  .then(users => res.json(users))
  .catch(() => res.status(500).end());
});

// GET /api/users/<id>
app.get('/api/users/:id', async (request, response) => {
  try {
    const result = await getUser(request.params.id);
    if(result.error) {
      response.status(404).json(result);
    } else {
      response.json(result);
    }
  }
  catch {
    response.status(500).end();
  }
});

// User registration functionality removed - users should be created manually or through admin tools

// PUT /api/users/<id>
app.put('/api/users/:id', isLoggedIn, [
  check('username').notEmpty(),
  check('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const userToUpdate = req.body;
  const userId = req.params.id;

  try {
    await updateUser(userId, userToUpdate);
    
    // If the user is updating their own profile, refresh the session data
    if (req.user.id == userId) {
      const updatedUser = await getUser(userId);
      if (!updatedUser.error) {
        console.log(`[PROFILE UPDATE] Refreshing session for user ${userId}: ${req.user.name} -> ${updatedUser.name}`);
        
        // Filter out sensitive fields before updating session
        const safeUserData = {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name
        };
        
        // Use Passport's login method to properly update the session
        req.logIn(safeUserData, (err) => {
          if (err) {
            console.error('[PROFILE UPDATE] Login refresh error:', err);
            res.status(503).json({'error': 'Session refresh failed'});
          } else {
            console.log('[PROFILE UPDATE] Session refreshed successfully');
            res.status(200).end();
          }
        });
      } else {
        res.status(200).end();
      }
    } else {
      res.status(200).end();
    }
  } catch {
    res.status(503).json({'error': `Impossible to update user #${req.params.id}.`});
  }
});

// DELETE /api/users/<id>
app.delete('/api/users/:id', isLoggedIn, async (req, res) => {
  const userId = req.params.id;
  
  try {
    const num = await deleteUser(userId);
    if(num === 1) {
      res.status(204).end();
    }
    else
      throw new Error(`Error deleting user #${userId}`);
  } catch(e) {
    res.status(503).json({error: e.message});
  }
});

// GET /api/games
app.get('/api/games', (req, res) => {
  listGames()
  .then(games => res.json(games))
  .catch(() => res.status(500).end());
});

// GET /api/games/<id>
app.get('/api/games/:id', async (request, response) => {
  try {
    const game = await getGame(request.params.id);
    if(game.error) {
      response.status(404).json(game);
    } else {
      response.json(game);
    }
  }
  catch {
    response.status(500).end();
  }
});

// POST /api/games
app.post('/api/games', isLoggedIn, [
  check('name').notEmpty(),
  check('theme_id').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newGame = req.body;
  newGame.creator_id = req.user.id;

  try {
    const id = await addGame(newGame);
    res.status(201).location(id).end();
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the game.'});
  }
});

// PUT /api/games/<id>/status
app.put('/api/games/:id/status', isLoggedIn, [
  check('status').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const gameId = req.params.id;
  const status = req.body.status;

  try {
    const num = await updateGameStatus(gameId, status);
    if(num === 1) {
      res.status(200).end();
    }
    else
      throw new Error(`Error updating game #${gameId}`);
  } catch(e) {
    res.status(503).json({error: e.message});
  }
});

// POST /api/games/<id>/join
app.post('/api/games/:id/join', isLoggedIn, async (req, res) => {
  const gameId = req.params.id;
  const playerId = req.user.id;

  try {
    const id = await joinGame(gameId, playerId);
    res.status(201).location(id).end();
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to join the game.'});
  }
});

// GET /api/games/<id>/players
app.get('/api/games/:id/players', async (req, res) => {
  try {
    const players = await getGamePlayers(req.params.id);
    res.json(players);
  } catch {
    res.status(500).end();
  }
});

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ error: info || 'Authentication failed' });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Login session error' });
      }
      return res.status(201).json({
        user: req.user,
        sessionId: req.sessionID,
        authenticated: true,
        message: 'Login successful'
      });
    });
  })(req, res, next);
});

// GET /api/sessions/current - Check current authentication status
app.get('/api/sessions/current', function(req, res) {
  const authStatus = checkAuth(req);
  if (authStatus.isAuthenticated) {
    res.json({
      authenticated: true,
      user: authStatus.user,
      sessionId: authStatus.sessionID
    });
  } else {
    res.json({
      authenticated: false,
      user: null,
      sessionId: null,
      demo_available: true,
      demo_theme: 'travel'
    });
  }
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/* THEME ROUTES */

// GET /api/themes
app.get('/api/themes', async (req, res) => {
  try {
    const themes = await listActiveThemes();
    res.json(themes);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching themes'});
  }
});

// GET /api/themes/all
app.get('/api/themes/all', async (req, res) => {
  try {
    const themes = await listThemes();
    res.json(themes);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching themes'});
  }
});

// GET /api/themes/:key
app.get('/api/themes/:key', async (req, res) => {
  try {
    const theme = await getThemeByKey(req.params.key);
    if(theme.error) {
      res.status(404).json(theme);
    } else {
      res.json(theme);
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching theme'});
  }
});

// GET /api/themes/:id/cards
app.get('/api/themes/:id/cards', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const cards = await getThemeCards(req.params.id, limit);
    res.json(cards);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching theme cards'});
  }
});

// GET /api/themes/:id/cards/random
app.get('/api/themes/:id/cards/random', async (req, res) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 6;
    const cards = await getRandomThemeCards(req.params.id, count);
    res.json(cards);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching random theme cards'});
  }
});

/* CARD ROUTES */

// GET /api/cards/random
app.get('/api/cards/random', async (req, res) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 3;
    const excludeIds = req.query.exclude ? req.query.exclude.split(',').map(id => parseInt(id)) : [];
    const cards = await getRandomCards(excludeIds, count);
    res.json(cards);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching random cards'});
  }
});

// GET /api/cards/:id
app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await getCard(req.params.id);
    if(card.error) {
      res.status(404).json(card);
    } else {
      res.json(card);
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching card'});
  }
});

// GET /api/cards/range
app.get('/api/cards/range', async (req, res) => {
  try {
    const min = req.query.min ? parseFloat(req.query.min) : 0;
    const max = req.query.max ? parseFloat(req.query.max) : 100;
    const cards = await getCardsByIndexRange(min, max);
    res.json(cards);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching cards by range'});
  }
});

// GET /api/cards/similar
app.get('/api/cards/similar', async (req, res) => {
  try {
    const severity = req.query.severity ? parseFloat(req.query.severity) : 50;
    const tolerance = req.query.tolerance ? parseFloat(req.query.tolerance) : 5;
    const cards = await getSimilarCards(severity, tolerance);
    res.json(cards);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching similar cards'});
  }
});

// GET /api/cards/count
app.get('/api/cards/count', async (req, res) => {
  try {
    const count = await getCardCount();
    res.json({total: count});
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching card count'});
  }
});

/* GAME SESSION ROUTES */

// POST /api/game-sessions
app.post('/api/game-sessions', async (req, res) => {
  try {
    const { theme_key } = req.body;
    
    if (!theme_key) {
      return res.status(400).json({error: 'Theme key is required'});
    }

    // Get theme by key
    const theme = await getThemeByKey(theme_key);
    if (theme.error) {
      return res.status(404).json({error: 'Theme not found'});
    }

    // Check if theme requires login
    if (theme.requires_login && !req.isAuthenticated()) {
      return res.status(401).json({
        error: 'This theme requires login. Only Travel & Adventure theme is available for demo play.',
        allowed_demo_themes: ['travel']
      });
    }

    // Create game session for both logged-in and anonymous users
    const userId = req.isAuthenticated() ? req.user.id : null;
    const sessionId = await createGameSession(userId, theme.id);
    
    // For anonymous users, only allow travel theme
    if (!req.isAuthenticated() && theme_key !== 'travel') {
      return res.status(403).json({
        error: 'Anonymous users can only play Travel & Adventure theme as demo.',
        allowed_theme: 'travel'
      });
    }
    
    // Get 3 random starting cards and sort by severity (low to high)
    const randomCards = await getRandomThemeCards(theme.id, 3);
    const startingCards = randomCards.sort((a, b) => a.bad_luck_severity - b.bad_luck_severity);
    
    // Store starting hand cards as round 0 entries
    for (let i = 0; i < startingCards.length; i++) {
      const roundData = {
        round_number: 0, // Round 0 = starting hand
        card_id: startingCards[i].id,
        user_choice_position: i + 1, // Position in starting hand (1, 2, 3)
        correct_position: i + 1, // Same as choice for starting hand
        is_correct: true, // Starting hand cards are always "correct"
        time_taken: 0,
        points_earned: 0 // No points for starting hand
      };
      await addGameRound(sessionId, roundData);
    }
    
    const isDemo = !req.isAuthenticated();
    
    res.status(201).json({
      session_id: sessionId,
      theme: theme,
      cards: startingCards,
      demo: isDemo,
      max_rounds: isDemo ? 1 : 6,
      starting_hand: true,
      message: isDemo 
        ? "Demo game: 1 round only. Log in to play full games!"
        : "Game started! These 3 cards are your starting hand, ordered by severity."
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error creating game session'});
  }
});



// GET /api/game-sessions/active
app.get('/api/game-sessions/active', isLoggedIn, async (req, res) => {
  try {
    const session = await getActiveGameSession(req.user.id);
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({error: 'No active game session found'});
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching active game session'});
  }
});

// GET /api/game-sessions/:id
app.get('/api/game-sessions/:id', async (req, res) => {
  try {
    const session = await getGameSession(req.params.id);
    if(session.error) {
      res.status(404).json(session);
    } else {
      // For security: only allow access to own sessions for logged-in users
      // Demo sessions (user_id = null) can be accessed by anyone
      if (session.user_id !== null && (!req.isAuthenticated() || req.user.id !== session.user_id)) {
        return res.status(403).json({error: 'Access denied: not your session'});
      }
      
      res.json(session);
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching game session'});
  }
});

// GET /api/game-sessions/:id/rounds - Get all rounds for a game session
app.get('/api/game-sessions/:id/rounds', async (req, res) => {
  try {
    const session = await getGameSession(req.params.id);
    if(session.error) {
      return res.status(404).json(session);
    }
    
    // For security: only allow access to own sessions for logged-in users
    // Demo sessions (user_id = null) can be accessed by anyone
    if (session.user_id !== null && (!req.isAuthenticated() || req.user.id !== session.user_id)) {
      return res.status(403).json({error: 'Access denied: not your session'});
    }
    
    // Get all rounds for this session
    const rounds = await getGameRounds(req.params.id);
    res.json(rounds);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching game rounds'});
  }
});

// GET /api/game-sessions/:id/next-card - Get consistent card for current round
app.get('/api/game-sessions/:id/next-card', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const authStatus = checkAuth(req);
    
    console.log(`[NEXT-CARD] SessionId: ${sessionId}, Authenticated: ${authStatus.isAuthenticated}, User: ${authStatus.user?.id || 'none'}`);
    
    const session = await getGameSession(sessionId);
    if(session.error) {
      return res.status(404).json(session);
    }
    
    // Get all existing rounds
    const existingRounds = await getGameRounds(sessionId);
    const usedCardIds = existingRounds.map(r => r.card_id);
    
    // Get all theme cards and sort them consistently
    const allThemeCards = await getThemeCards(session.theme_id);
    const availableCards = allThemeCards.filter(card => !usedCardIds.includes(card.id))
                                        .sort((a, b) => a.id - b.id); // Sort by ID for consistency
    
    if (availableCards.length === 0) {
      return res.status(400).json({error: 'No more cards available for this theme'});
    }
    
    // Use deterministic selection based on session ID and current round
    // This ensures the same card is always returned for the same round
    const seedValue = parseInt(sessionId) + (session.current_round * 1000);
    const cardIndex = seedValue % availableCards.length;
    const nextCard = availableCards[cardIndex];
    
    // Update round start time if this is a new round
    if (!session.current_round_start_time) {
      await updateGameSession(sessionId, {
        current_round_start_time: new Date().toISOString()
      });
    }
    
    // Calculate remaining time for persistent timer
    let remainingTime = 30; // Default 30 seconds
    if (session.current_round_start_time) {
      const startTime = new Date(session.current_round_start_time);
      const now = new Date();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      remainingTime = Math.max(0, 30 - elapsedSeconds);
    }
    
    // Return card without revealing severity + timer info
    res.json({
      id: nextCard.id,
      title: nextCard.title,
      description: nextCard.description,
      image_url: nextCard.image_url,
      theme_id: nextCard.theme_id,
      demo: session.user_id === null, // Mark as demo if no user
      remaining_time: remainingTime, // Add persistent timer
      round_number: session.current_round
      // Note: bad_luck_severity is NOT included - that's revealed after guess
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error getting next card'});
  }
});

// PUT /api/game-sessions/:id
app.put('/api/game-sessions/:id', isLoggedIn, async (req, res) => {
  try {
    const changes = await updateGameSession(req.params.id, req.body);
    if (changes === 0) {
      res.status(404).json({error: 'Game session not found'});
    } else {
      res.json({message: 'Game session updated successfully'});
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error updating game session'});
  }
});

// POST /api/game-sessions/:id/rounds
app.post('/api/game-sessions/:id/rounds', [
  check('round_number').isNumeric(),
  check('card_id').isNumeric(),
  check('user_choice_position').isNumeric(),
  check('time_taken').optional().isNumeric(),
  check('starting_cards').optional().isArray() // For demo mode
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  try {
    const sessionId = req.params.id;
    const authStatus = checkAuth(req);
    const { round_number, card_id, user_choice_position, time_taken } = req.body;
    
    console.log(`[ROUNDS] SessionId: ${sessionId}, Authenticated: ${authStatus.isAuthenticated}, User: ${authStatus.user?.id || 'none'}`);
    
    // Get the game session
    const session = await getGameSession(sessionId);
    if (session.error) {
      return res.status(404).json({error: 'Game session not found'});
    }
    
    // For anonymous users (demo), enforce 1-round limitation
    if (!authStatus.isAuthenticated) {
      const existingRounds = await getGameRounds(sessionId);
      const gameplayRounds = existingRounds.filter(r => r.round_number > 0);
      
      if (gameplayRounds.length >= 1) {
        return res.status(403).json({
          error: 'Demo users can only play 1 round. Log in to play full games!',
          demo: true,
          rounds_played: gameplayRounds.length
        });
      }
         }
    
    // Check if game is already completed
    if (session.status === 'completed') {
      return res.status(400).json({
        error: 'Game session is already completed',
        game_result: session.game_result,
        final_score: session.final_score
      });
    }
    
    // Check if game should have ended but wasn't marked completed (safety check)
    if (session.wrong_guesses >= 3) {
      return res.status(400).json({
        error: 'Game session should have ended due to 3 wrong guesses',
        wrong_guesses: session.wrong_guesses
      });
    }
    
    if (session.cards_won >= 3) {
      return res.status(400).json({
        error: 'Game session should have ended due to winning (3 won cards + 3 starting = 6 total)',
        cards_won: session.cards_won
      });
    }
    
    // Get the new card being placed
    const newCard = await getCard(card_id);
    if (newCard.error) {
      return res.status(404).json({error: 'Card not found'});
    }
    
    // Check for timeout penalty (over 30 seconds = automatic wrong)
    const timeoutPenalty = (time_taken || 0) > 30;
    
        // Get current player cards (starting hand + already won)
    const existingRounds = await getGameRounds(sessionId);
    
    // Get starting hand cards (round_number = 0)
    const startingCards = existingRounds.filter(r => r.round_number === 0);
    
    // Get won cards from actual gameplay rounds (round_number > 0 and is_correct)
    const wonCards = existingRounds.filter(r => r.round_number > 0 && r.is_correct);
    
    // Combine starting cards and won cards, sorted by severity
    const allPlayerCards = [...startingCards, ...wonCards].sort((a, b) => a.bad_luck_severity - b.bad_luck_severity);
    
    // Calculate correct position based on severity
    let correctPosition = 1;
    for (let i = 0; i < allPlayerCards.length; i++) {
      if (newCard.bad_luck_severity > allPlayerCards[i].bad_luck_severity) {
        correctPosition = i + 2; // Position after this card
      }
    }
    
    // Apply timeout penalty: if over 30 seconds, mark as incorrect regardless of guess
    const isCorrect = timeoutPenalty ? false : (user_choice_position === correctPosition);
    const pointsEarned = isCorrect ? Math.max(100 - (time_taken || 0), 10) : 0;
    
    // Save the round
    const roundData = {
      round_number,
      card_id,
      user_choice_position,
      correct_position: correctPosition,
      is_correct: isCorrect,
      time_taken: time_taken || 0,
      points_earned: pointsEarned
    };
    
    const roundId = await addGameRound(sessionId, roundData);
    
    // Update game session
    const updates = {
      current_round: round_number + 1,
      current_round_start_time: null, // Reset timer for next round
      cards_won: isCorrect ? session.cards_won + 1 : session.cards_won,
      wrong_guesses: isCorrect ? session.wrong_guesses : session.wrong_guesses + 1,
      final_score: session.final_score + pointsEarned
    };
    
    await updateGameSession(sessionId, updates);
    
    // Check game end conditions
    let gameStatus = 'continue';
    const isDemo = session.user_id === null;
    
    if (updates.cards_won >= 3) {  // Win with 3 won cards (+ 3 starting = 6 total)
      gameStatus = 'won';
      // Update database to mark game as completed
      await updateGameSession(sessionId, {
        status: 'completed',
        game_result: 'won',
        time_finished: new Date().toISOString()
      });
    } else if (updates.wrong_guesses >= 3) {
      gameStatus = 'lost';
      // Update database to mark game as completed
      await updateGameSession(sessionId, {
        status: 'completed',
        game_result: 'lost',
        time_finished: new Date().toISOString()
      });
    } else if (isDemo) {
      // Demo users: end game after 1 round regardless of outcome
      gameStatus = isCorrect ? 'demo_success' : 'demo_failed';
      await updateGameSession(sessionId, {
        status: 'completed',
        game_result: gameStatus,
        time_finished: new Date().toISOString()
      });
    }
    
    // Prepare response with timeout info
    const response = {
      round_id: roundId,
      is_correct: isCorrect,
      correct_position: correctPosition,
      points_earned: pointsEarned,
      card_revealed: newCard,
      game_status: gameStatus,
      session_updates: updates,
      demo: isDemo
    };
    
    // Add demo-specific messaging
    if (isDemo) {
      response.message = isCorrect 
        ? `Correct! The card belonged in position ${correctPosition}. Log in to play full games!`
        : `Wrong! The card belonged in position ${correctPosition}, not ${user_choice_position}. Log in to play full games!`;
    }
    
    // Add timeout penalty information if applicable
    if (timeoutPenalty) {
      response.timeout_penalty = true;
      response.message = isDemo 
        ? `Time's up! Answers over 30 seconds are considered incorrect. The card belonged in position ${correctPosition}. Log in to play full games!`
        : "Time's up! Answers over 30 seconds are considered incorrect.";
      response.time_limit_exceeded = time_taken;
    }
    
    res.status(201).json(response);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error processing game round'});
  }
});

// POST /api/game-sessions/:id/end
app.post('/api/game-sessions/:id/end', isLoggedIn, [
  check('game_result').isIn(['won', 'lost'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  try {
    await endGameSession(req.params.id, req.body.game_result);

    res.json({message: 'Game session ended successfully'});
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error ending game session'});
  }
});

/* USER PROFILE & HISTORY ROUTES */



// GET /api/users/:id/history
app.get('/api/users/:id/history', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const history = await getUserGameHistory(req.params.id, limit);
    res.json(history);
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching user history'});
  }
});

// GET /api/users/:id/history/:gameId
app.get('/api/users/:id/history/:gameId', async (req, res) => {
  try {
    const detailed = await getDetailedGameHistory(req.params.id, req.params.gameId);
    if(detailed.error) {
      res.status(404).json(detailed);
    } else {
      res.json(detailed);
    }
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching detailed game history'});
  }
});

// DELETE /api/users/:id/history - Clear user's game history
app.delete('/api/users/:id/history', isLoggedIn, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Verify user can only delete their own history
    if (req.user.id !== userId) {
      return res.status(403).json({error: 'You can only delete your own game history'});
    }

    // Delete game rounds for this user's sessions
    await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM game_rounds 
        WHERE game_session_id IN (
          SELECT id FROM game_sessions WHERE user_id = ?
        )
      `;
      db.run(sql, [userId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    // Delete game sessions for this user
    const deletedSessions = await new Promise((resolve, reject) => {
      const sql = 'DELETE FROM game_sessions WHERE user_id = ?';
      db.run(sql, [userId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    res.json({ 
      message: 'Game history cleared successfully',
      deleted_sessions: deletedSessions,
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error clearing game history'});
  }
});

// remember to delete these 
// TODO: Delete the test routes below:
// - DELETE /api/admin/reset-games
// - DELETE /api/admin/reset-all  
// - GET /api/admin/status
// These are only for testing and should be removed before production




/* ADMIN/TESTING ROUTES */

// DELETE /api/admin/reset-games - Clear all game sessions and rounds
app.delete('/api/admin/reset-games', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM game_rounds', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM game_sessions', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM sqlite_sequence WHERE name IN ("game_sessions", "game_rounds")', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    res.json({ 
      message: 'All game sessions and rounds cleared. Users and themes preserved.',
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error resetting game data'});
  }
});

// DELETE /api/admin/reset-all - Nuclear option: clear everything except themes/cards
app.delete('/api/admin/reset-all', async (req, res) => {
  try {
    const tables = ['game_rounds', 'game_sessions', 'users'];
    
    for (const table of tables) {
      await new Promise((resolve, reject) => {
        const sql = table === 'users' ? 'DELETE FROM users WHERE id > 0' : `DELETE FROM ${table}`;
        db.run(sql, function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });
    }
    
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM sqlite_sequence WHERE name IN ("users", "game_sessions", "game_rounds")', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    res.json({ 
      message: 'All user data and games cleared. Themes and cards preserved.',
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error resetting all data'});
  }
});

// DELETE /api/admin/reset-cards - Fix duplicate cards
app.delete('/api/admin/reset-cards', async (req, res) => {
  try {
    // Clear all cards first
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM cards', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    // Reset cards sequence
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM sqlite_sequence WHERE name = "cards"', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    // Re-seed only cards
    await seedDatabase();
    
    res.json({ 
      message: 'Cards reset to correct amounts (50 University + 50 Love = 100 total).',
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error resetting cards'});
  }
});

// GET /api/admin/status - Check current database status
app.get('/api/admin/status', async (req, res) => {
  try {
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const sessionCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM game_sessions', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const roundCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM game_rounds', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const themeCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM themes', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const cardCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM cards', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const activeSessions = await new Promise((resolve, reject) => {
      db.all('SELECT id, user_id, theme_id, status, current_round, cards_won, wrong_guesses FROM game_sessions WHERE status = "active" ORDER BY id', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({
      database_status: {
        users: userCount.count,
        game_sessions: sessionCount.count,
        game_rounds: roundCount.count,
        themes: themeCount.count,
        cards: cardCount.count
      },
      active_sessions: activeSessions,
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(500).json({error: 'Error fetching admin status'});
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    // Remove automatic seeding - cards should only be seeded once manually
    // await seedDatabase(); 
    console.log('🎮 Database ready!');
    
    app.listen(port, () => { 
      console.log(`🚀 API server started at http://localhost:${port}`); 
      console.log('📋 Available endpoints:');
      console.log('  - GET /api/themes - Get all active themes');
      console.log('  - POST /api/game-sessions - Start a new game');
      console.log('  - GET /api/users/:id/history - Get user game history');

      console.log('  - POST /api/sessions - Login');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 