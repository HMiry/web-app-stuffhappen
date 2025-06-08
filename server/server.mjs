import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {check, validationResult} from 'express-validator';
import {listUsers, getUser, addUser, authenticateUser, getUserWithProfile, updateUser, deleteUser} from './collections/UserCollection.mjs';
import {listGames, getGame, addGame, updateGameStatus, getGamesByCreator, joinGame, getGamePlayers} from './collections/GameCollection.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// Import database
import database from './db/database.mjs';
import initDatabase from './db/init.mjs';

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
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
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

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
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
    const result = await getUserWithProfile(request.params.id);
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

// POST /api/users/register
app.post('/api/users/register', [
  check('username').notEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newUser = req.body;

  try {
    const id = await addUser(newUser);
    res.status(201).location(id).end();
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the user.'});
  }
});

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
    res.status(200).end();
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
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });

export default app; 