import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import db from '../db/database.mjs';

/** USERS **/

// get a user given its id 
export const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({error: "User not available, check the inserted id."});
      } else {
        resolve(row);
      }
    });
  });
}

// update user - removed unused fields: university, major, avatar_url
export const updateUser = (userId, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET username = ?, email = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [
      user.username, 
      user.email, 
      user.name || null,
      userId
    ], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// authenticate user (simplified) 
export const authenticateUser = async (username, password) => {
  return new Promise(async (resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], async (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({ error: 'USER_NOT_FOUND', message: 'User not found' });
      }
      else {
        try {
        const user = {id: row.id, username: row.username, email: row.email, name: row.name};
        
          // Compare password with bcrypt
          const isValid = await bcrypt.compare(password, row.password_hash);
          if (!isValid) {
            resolve({ error: 'WRONG_PASSWORD', message: 'Incorrect password' });
          } else {
            resolve(user);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

 