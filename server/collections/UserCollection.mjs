import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
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
export const addUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const sql = 'INSERT INTO users(username, email, password_hash, salt, name, university, major, avatar_url, role) VALUES (?,?,?,?,?,?,?,?,?)';
      db.run(sql, [
        user.username, 
        user.email, 
        hashedPassword,
        '', // No separate salt needed with bcrypt
        user.name || null,
        user.university || null,
        user.major || null,
        user.avatar_url || null, 
        user.role || 'user'
      ], function(err) {
        if (err)
          reject(err);
        else 
          resolve(this.lastID);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// update user
export const updateUser = (userId, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET username = ?, email = ?, name = ?, university = ?, major = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [
      user.username, 
      user.email, 
      user.name || null,
      user.university || null,
      user.major || null,
      user.avatar_url || null, 
      userId
    ], function(err) {
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
    const sql = `SELECT u.*, p.bio
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
          id: row.id,
          username: row.username,
          email: row.email,
          name: row.name,
          university: row.university,
          major: row.major,
          avatar_url: row.avatar_url,
          role: row.role,
          created_at: row.created_at,
          profile: {
            bio: row.bio
          }
        });
      }
    });
  });
} 