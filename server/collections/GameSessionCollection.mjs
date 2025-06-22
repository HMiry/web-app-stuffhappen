import db from '../db/database.mjs';

// Create new game session 
export const createGameSession = (userId, themeId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO game_sessions 
      (user_id, theme_id, status, total_rounds, current_round, cards_won, wrong_guesses, max_wrong_guesses, final_score, time_started)
      VALUES (?, ?, 'active', 6, 1, 0, 0, 3, 0, CURRENT_TIMESTAMP)
    `;
    
    db.run(sql, [userId, themeId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

// Get game session by ID 
export const getGameSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT gs.*, t.name as theme_name, t.theme_key, t.color as theme_color
      FROM game_sessions gs
      JOIN themes t ON gs.theme_id = t.id
      WHERE gs.id = ?
    `;
    
    db.get(sql, [sessionId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve({ error: `Game session with id ${sessionId} not found.` });
      }
    });
  });
};

// Get active game session for user 
export const getActiveGameSession = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT gs.*, t.name as theme_name, t.theme_key, t.color as theme_color
      FROM game_sessions gs
      JOIN themes t ON gs.theme_id = t.id
      WHERE gs.user_id = ? AND gs.status = 'active'
      ORDER BY gs.time_started DESC
      LIMIT 1
    `;
    
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Update game session 
export const updateGameSession = (sessionId, updates) => {
  return new Promise((resolve, reject) => {
    const allowedFields = ['current_round', 'current_round_start_time', 'cards_won', 'wrong_guesses', 'final_score', 'status', 'game_result', 'time_finished'];
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      reject(new Error('No valid fields to update'));
      return;
    }
    
    values.push(sessionId);
    const sql = `UPDATE game_sessions SET ${updateFields.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

// Add game round 
export const addGameRound = (sessionId, roundData) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO game_rounds 
      (game_session_id, round_number, card_id, user_choice_position, correct_position, is_correct, time_taken, points_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      sessionId, 
      roundData.round_number, 
      roundData.card_id, 
      roundData.user_choice_position, 
      roundData.correct_position, 
      roundData.is_correct, 
      roundData.time_taken, 
      roundData.points_earned
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

// Get game rounds for a session 
export const getGameRounds = (sessionId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT gr.*, c.title as card_title, c.bad_luck_severity, c.image_url as card_image_url
      FROM game_rounds gr
      JOIN cards c ON gr.card_id = c.id
      WHERE gr.game_session_id = ?
      ORDER BY gr.round_number ASC
    `;
    
    db.all(sql, [sessionId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get user's game history 
export const getUserGameHistory = (userId, limit = 10) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT gs.*, t.name as theme_name, t.theme_key, t.color as theme_color,
             COUNT(gr.id) as total_rounds_played
      FROM game_sessions gs
      JOIN themes t ON gs.theme_id = t.id
      LEFT JOIN game_rounds gr ON gs.id = gr.game_session_id
      WHERE gs.user_id = ? AND (
        gs.status = 'completed' OR 
        gs.cards_won >= 3 OR 
        gs.wrong_guesses >= 3 OR
        gs.game_result IS NOT NULL
      )
      GROUP BY gs.id
      ORDER BY gs.time_started DESC
      LIMIT ?
    `;
    
    db.all(sql, [userId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get detailed game history with rounds 
export const getDetailedGameHistory = (userId, gameId) => {
  return new Promise((resolve, reject) => {
    const sessionSql = `
      SELECT gs.*, t.name as theme_name, t.theme_key, t.color as theme_color
      FROM game_sessions gs
      JOIN themes t ON gs.theme_id = t.id
      WHERE gs.id = ? AND gs.user_id = ?
    `;
    
    db.get(sessionSql, [gameId, userId], (err, session) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!session) {
        resolve({ error: `Game session not found or doesn't belong to user.` });
        return;
      }
      
      const roundsSql = `
        SELECT gr.*, c.title as disaster, c.bad_luck_severity, c.image_url
        FROM game_rounds gr
        JOIN cards c ON gr.card_id = c.id
        WHERE gr.game_session_id = ?
        ORDER BY gr.round_number ASC
      `;
      
      db.all(roundsSql, [gameId], (err, rounds) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            ...session,
            rounds: rounds.map(round => ({
              round: round.round_number,
              disaster: round.disaster,
              result: round.is_correct ? 'correct' : 'incorrect',
              time_taken: round.time_taken,
              points_earned: round.points_earned,
              image_url: round.image_url,
              bad_luck_severity: round.bad_luck_severity,
              card_id: round.card_id
            }))
          });
        }
      });
    });
  });
};

// Clear user's game history (both rounds and sessions)
export const clearUserGameHistory = (userId) => {
  return new Promise((resolve, reject) => {
    // First delete all game rounds for this user's sessions
    const deleteRoundsSQL = `
      DELETE FROM game_rounds 
      WHERE game_session_id IN (
        SELECT id FROM game_sessions WHERE user_id = ?
      )
    `;
    
    db.run(deleteRoundsSQL, [userId], function(err) {
      if (err) {
        reject(err);
        return;
      }
      
      const deletedRounds = this.changes;
      
      // Then delete all game sessions for this user
      const deleteSessionsSQL = 'DELETE FROM game_sessions WHERE user_id = ?';
      
      db.run(deleteSessionsSQL, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            deleted_rounds: deletedRounds,
            deleted_sessions: this.changes
          });
        }
      });
    });
  });
};
