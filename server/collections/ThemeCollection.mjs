import db from '../db/database.mjs';

// Get all themes
export const listThemes = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, theme_key, name, description, icon, color, background_image, 
             category, difficulty_level, is_active, requires_login, created_at
      FROM themes 
      ORDER BY id ASC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get active themes only
export const listActiveThemes = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, theme_key, name, description, icon, color, background_image, 
             category, difficulty_level, is_active, requires_login, created_at
      FROM themes 
      WHERE is_active = 1
      ORDER BY id ASC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get theme by ID
export const getTheme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, theme_key, name, description, icon, color, background_image, 
             category, difficulty_level, is_active, requires_login, created_at
      FROM themes 
      WHERE id = ?
    `;
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve({ error: `Theme with id ${id} not found.` });
      }
    });
  });
};

// Get theme by key
export const getThemeByKey = (themeKey) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, theme_key, name, description, icon, color, background_image, 
             category, difficulty_level, is_active, requires_login, created_at
      FROM themes 
      WHERE theme_key = ?
    `;
    
    db.get(sql, [themeKey], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve({ error: `Theme with key ${themeKey} not found.` });
      }
    });
  });
};

// Get cards for a theme
export const getThemeCards = (themeId, limit = null) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT id, theme_id, title, description, image_url, bad_luck_severity, created_at
      FROM cards 
      WHERE theme_id = ?
      ORDER BY bad_luck_severity ASC
    `;
    
    if (limit) {
      sql += ` LIMIT ?`;
    }
    
    const params = limit ? [themeId, limit] : [themeId];
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get random cards for a theme (for game)
export const getRandomThemeCards = (themeId, count = 6) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, theme_id, title, description, image_url, bad_luck_severity, created_at
      FROM cards 
      WHERE theme_id = ?
      ORDER BY RANDOM()
      LIMIT ?
    `;
    
    db.all(sql, [themeId, count], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Add new theme
export const addTheme = (theme) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO themes (theme_key, name, description, icon, color, background_image, category, difficulty_level, is_active, requires_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      theme.theme_key, theme.name, theme.description, theme.icon, theme.color,
      theme.background_image, theme.category, theme.difficulty_level, theme.is_active, theme.requires_login
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

// Update theme
export const updateTheme = (id, theme) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE themes SET 
        name = ?, description = ?, icon = ?, color = ?, background_image = ?,
        category = ?, difficulty_level = ?, is_active = ?, requires_login = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(sql, [
      theme.name, theme.description, theme.icon, theme.color, theme.background_image,
      theme.category, theme.difficulty_level, theme.is_active, theme.requires_login, id
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

// Delete theme
export const deleteTheme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM themes WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

// Get theme statistics
export const getThemeStats = (themeId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        t.name as theme_name,
        COUNT(DISTINCT c.id) as total_cards,
        COUNT(DISTINCT gs.id) as total_games_played,
        COUNT(DISTINCT CASE WHEN gs.game_result = 'won' THEN gs.id END) as games_won,
        AVG(gs.final_score) as average_score,
        MAX(gs.final_score) as highest_score
      FROM themes t
      LEFT JOIN cards c ON t.id = c.theme_id
      LEFT JOIN game_sessions gs ON t.id = gs.theme_id
      WHERE t.id = ?
      GROUP BY t.id
    `;
    
    db.get(sql, [themeId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve({ error: `Theme statistics for id ${themeId} not found.` });
      }
    });
  });
}; 