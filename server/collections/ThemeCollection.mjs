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
