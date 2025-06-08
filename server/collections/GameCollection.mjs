/* Data Access Object (DAO) module for accessing Games */
/* Following qa-server pattern */

import sqlite3 from 'sqlite3';
import db from '../db/database.mjs';

/** GAMES **/
// get all games
export const listGames = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

// get a game given its id
export const getGame = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({error: "Game not available, check the inserted id."});
      } else {
        resolve(row);
      }
    });
  });
}

// add a new game
export const addGame = (game) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games(name, theme_id, creator_id, status) VALUES (?,?,?,?)';
    db.run(sql, [game.name, game.theme_id, game.creator_id, game.status || 'waiting'], function(err) {
      if (err)
        reject(err);
      else 
        resolve(this.lastID);
    });
  });
}

// update game
export const updateGame = (gameId, game) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET name = ?, status = ?, updated_at = ? WHERE id = ?';
    db.run(sql, [game.name, game.status, new Date().toISOString(), gameId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// update game status
export const updateGameStatus = (gameId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET status = ?, updated_at = ? WHERE id = ?';
    db.run(sql, [status, new Date().toISOString(), gameId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// delete game
export const deleteGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM games WHERE id = ?';
    db.run(sql, [gameId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// get games by creator
export const getGamesByCreator = (creatorId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE creator_id = ?';
    db.all(sql, [creatorId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// get games by status
export const getGamesByStatus = (status) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE status = ?';
    db.all(sql, [status], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// get games by theme
export const getGamesByTheme = (themeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE theme_id = ?';
    db.all(sql, [themeId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// join game (add player to game)
export const joinGame = (gameId, playerId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO game_players(game_id, player_id) VALUES (?,?)';
    db.run(sql, [gameId, playerId], function(err) {
      if (err)
        reject(err);
      else 
        resolve(this.lastID);
    });
  });
}

// get players of a game
export const getGamePlayers = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.id, u.username, u.avatar_url, gp.joined_at 
                 FROM game_players gp 
                 JOIN users u ON gp.player_id = u.id 
                 WHERE gp.game_id = ?`;
    db.all(sql, [gameId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
} 
