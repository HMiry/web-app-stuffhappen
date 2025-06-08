import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import db from '../db/database.mjs';

/** USERS **/
// get all users
export const listUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

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

// get user by username
export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// add a new user
export const addUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users(username, email, password_hash, avatar_url, role) VALUES (?,?,?,?,?)';
    db.run(sql, [user.username, user.email, user.password_hash, user.avatar_url, user.role || 'user'], function(err) {
      if (err)
        reject(err);
      else 
        resolve(this.lastID);
    });
  });
}

// update user
export const updateUser = (userId, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET username = ?, email = ?, avatar_url = ?, updated_at = ? WHERE id = ?';
    db.run(sql, [user.username, user.email, user.avatar_url, new Date().toISOString(), userId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// delete user
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [userId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// authenticate user (simplified)
export const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.username, email: row.email};
        
        crypto.scrypt(password, row.salt, 16, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password_hash, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

// check if username exists
export const usernameExists = (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
};

// check if email exists
export const emailExists = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
};

// get user with profile
export const getUserWithProfile = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.*, p.bio, p.total_games, p.total_wins, p.total_points, p.ranking
                 FROM users u
                 LEFT JOIN user_profiles p ON u.id = p.user_id
                 WHERE u.id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve({error: 'User not found'});
      } else {
        resolve({
          user: {
            id: row.id,
            username: row.username,
            email: row.email,
            avatar_url: row.avatar_url,
            role: row.role,
            created_at: row.created_at
          },
          profile: {
            bio: row.bio,
            total_games: row.total_games || 0,
            total_wins: row.total_wins || 0,
            total_points: row.total_points || 0,
            ranking: row.ranking || 0
          }
        });
      }
    });
  });
} 