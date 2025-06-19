import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {check, validationResult} from 'express-validator';
// CLEANED UP IMPORTS - Only importing functions that are actually used
import {getUser, authenticateUser, updateUser} from './collections/UserCollection.mjs';
// import {listGames, getGame, addGame, updateGameStatus, getGamesByCreator, joinGame, getGamePlayers} from './collections/GameCollection.mjs'; // COMMENTED OUT - ENTIRE FILE UNUSED
import {listThemes, listActiveThemes, getThemeByKey, getThemeCards, getRandomThemeCards} from './collections/ThemeCollection.mjs';
import {createGameSession, getGameSession, getActiveGameSession, updateGameSession, addGameRound, getGameRounds, getUserGameHistory, getDetailedGameHistory} from './collections/GameSessionCollection.mjs';
import {getCard} from './collections/CardCollection.mjs';
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
  origin: ['http://localhost:5173', 'http://localhost:3001'], // Support both dev and prod
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions));

// Serve static files from React build
app.use(express.static(join(__dirname, '../client/dist')));

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

// No tracking for anonymous users - they just play one round without any data storage

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

    // For anonymous users, only allow travel theme
    if (!req.isAuthenticated() && theme_key !== 'travel') {
      return res.status(403).json({
        error: 'Anonymous users can only play Travel & Adventure theme as demo.',
        allowed_theme: 'travel'
      });
    }

    const isDemo = !req.isAuthenticated();

    if (isDemo) {
      // For anonymous users: NO DATABASE SAVE, just return demo data
      const randomCards = await getRandomThemeCards(theme.id, 3);
      const startingCards = randomCards.sort((a, b) => a.bad_luck_severity - b.bad_luck_severity);
      
      res.status(201).json({
        session_id: 'demo', // Simple demo identifier
        theme: theme,
        cards: startingCards,
        demo: true,
        max_rounds: 1,
        starting_hand: true,
        message: "Demo game: 1 round only. Log in to play full games!"
      });
      return;
    }

    // For logged-in users: create database session
    const userId = req.user.id;
    const sessionId = await createGameSession(userId, theme.id);
    
    // Get 3 random starting cards and sort by severity (low to high)
    const randomCards = await getRandomThemeCards(theme.id, 3);
    const startingCards = randomCards.sort((a, b) => a.bad_luck_severity - b.bad_luck_severity);
    
    // Store starting hand cards as round 0 entries in database
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
    const sessionId = req.params.id;
    
    // Check if it's a demo session
    if (sessionId === 'demo') {
      return res.status(404).json({error: 'Demo sessions do not persist - start a new demo game'});
    }
    
    // Handle database sessions for logged-in users
    const session = await getGameSession(sessionId);
    if(session.error) {
      res.status(404).json(session);
    } else {
      // For security: only allow access to own sessions for logged-in users
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
// GET /api/game-sessions/:id/rounds - Get all rounds for a game session for tracking progress
app.get('/api/game-sessions/:id/rounds', async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Check if it's a demo session
    if (sessionId === 'demo') {
      return res.json([]); // Demo has no persistent rounds
    }
    
    // Handle database sessions for logged-in users
    const session = await getGameSession(sessionId);
    if(session.error) {
      return res.status(404).json(session);
    }
    
    // For security: only allow access to own sessions for logged-in users
    if (session.user_id !== null && (!req.isAuthenticated() || req.user.id !== session.user_id)) {
      return res.status(403).json({error: 'Access denied: not your session'});
    }
    
    // Get all rounds for this session
    const rounds = await getGameRounds(sessionId);
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
    
    // Check if it's a demo session
    if (sessionId === 'demo') {
      if (!authStatus.isAuthenticated) {
        // For demo users, just get a random travel card
        const travelTheme = await getThemeByKey('travel');
        const allTravelCards = await getThemeCards(travelTheme.id);
        const randomCard = allTravelCards[Math.floor(Math.random() * allTravelCards.length)];
        
        return res.json({
          id: randomCard.id,
          title: randomCard.title,
          description: randomCard.description,
          image_url: randomCard.image_url,
          theme_id: randomCard.theme_id,
          demo: true,
          remaining_time: 30,
          round_number: 1
        });
      } else {
        return res.status(403).json({error: 'Logged-in users should not use demo sessions'});
      }
    }

    // Handle database sessions for logged-in users
    const session = await getGameSession(sessionId);
    if(session.error) {
      return res.status(404).json(session);
    }
    
    // Get all existing rounds from database
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
    
    // Check if it's a demo session
    if (sessionId === 'demo') {
      if (!authStatus.isAuthenticated) {
        // For demo users: just calculate result without saving anything
        const newCard = await getCard(card_id);
        if (newCard.error) {
          return res.status(404).json({error: 'Card not found'});
        }
        
        // Simple demo logic: assume 3 starting cards with severities 1, 2, 3
        // User guesses position 1-4 for where the new card should go
        const demoStartingSeverities = [1, 2, 3]; // Fake starting cards
        let correctPosition = 1;
        for (let i = 0; i < demoStartingSeverities.length; i++) {
          if (newCard.bad_luck_severity > demoStartingSeverities[i]) {
            correctPosition = i + 2; // Position after this card
          }
        }
        
        const isCorrect = user_choice_position === correctPosition;
        const pointsEarned = isCorrect ? Math.max(100 - (time_taken || 0), 10) : 0;
        
        return res.status(201).json({
          round_id: 'demo_round',
          is_correct: isCorrect,
          correct_position: correctPosition,
          points_earned: pointsEarned,
          card_revealed: newCard,
          game_status: 'demo_complete',
          demo: true,
          message: isCorrect 
            ? `Correct! The card belonged in position ${correctPosition}. Log in to play full games!`
            : `Wrong! The card belonged in position ${correctPosition}, not ${user_choice_position}. Log in to play full games!`
        });
      } else {
        return res.status(403).json({error: 'Logged-in users should not use demo sessions'});
      }
    }

    // Handle database sessions for logged-in users
    const session = await getGameSession(sessionId);
    if (session.error) {
      return res.status(404).json({error: 'Game session not found'});
    }
    
    const existingRounds = await getGameRounds(sessionId);
    
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
    const startingCards = existingRounds.filter(r => r.round_number === 0);
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
    
    // Save the round data
    const roundData = {
      round_number,
      card_id,
      user_choice_position,
      correct_position: correctPosition,
      is_correct: isCorrect,
      time_taken: time_taken || 0,
      points_earned: pointsEarned
    };
    
    // For logged-in users: save to database
    const roundId = await addGameRound(sessionId, roundData);
    
    // Update database session
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
    // Use the UPDATED values, not the old session values
    const currentCardsWon = isCorrect ? session.cards_won + 1 : session.cards_won;
    const currentWrongGuesses = isCorrect ? session.wrong_guesses : session.wrong_guesses + 1;
    
    if (currentCardsWon >= 3) {  // Win with 3 won cards (+ 3 starting = 6 total)
      gameStatus = 'won';
      // Update database to mark game as completed
      await updateGameSession(sessionId, {
        status: 'completed',
        game_result: 'won',
        time_finished: new Date().toISOString()
      });
    } else if (currentWrongGuesses >= 3) {
      gameStatus = 'lost';
      // Update database to mark game as completed
      await updateGameSession(sessionId, {
        status: 'completed',
        game_result: 'lost',
        time_finished: new Date().toISOString()
      });
    }
    
    // Prepare response with timeout info
    const sessionUpdates = {
      current_round: round_number + 1,
      cards_won: isCorrect ? session.cards_won + 1 : session.cards_won,
      wrong_guesses: isCorrect ? session.wrong_guesses : session.wrong_guesses + 1,
      final_score: session.final_score + pointsEarned
    };
    
    const response = {
      round_id: roundId,
      is_correct: isCorrect,
      correct_position: correctPosition,
      points_earned: pointsEarned,
      card_revealed: newCard,
      game_status: gameStatus,
      session_updates: sessionUpdates,
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Catch-all route for React Router (must be last!)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
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