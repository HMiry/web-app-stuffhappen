/* Data Access Object (DAO) module for accessing Cards */
/* Following qa-server pattern */

import sqlite3 from 'sqlite3';
import db from '../db/database.mjs';

/** CARDS **/
// get all cards
export const listCards = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cards ORDER BY bad_luck_index ASC';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        resolve(rows);
      }
    });
  });
}

// get a card given its id
export const getCard = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cards WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({error: "Card not available, check the inserted id."});
      } else {
        resolve(row);
      }
    });
  });
}

// get random cards
export const getRandomCards = (excludeIds = [], count = 3) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM cards';
    let params = [];

    if (excludeIds.length > 0) {
      const placeholders = excludeIds.map(() => '?').join(',');
      sql += ` WHERE id NOT IN (${placeholders})`;
      params = excludeIds;
    }

    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(count);

    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// get cards by bad luck index range
export const getCardsByIndexRange = (minIndex, maxIndex) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cards WHERE bad_luck_index >= ? AND bad_luck_index <= ? ORDER BY bad_luck_index ASC';
    db.all(sql, [minIndex, maxIndex], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// get total count of cards
export const getCardCount = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as total FROM cards';
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.total : 0);
      }
    });
  });
}

// find cards with similar bad luck index
export const getSimilarCards = (targetIndex, tolerance = 5) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cards WHERE bad_luck_index >= ? AND bad_luck_index <= ? ORDER BY bad_luck_index ASC';
    db.all(sql, [targetIndex - tolerance, targetIndex + tolerance], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// add a new card
export const addCard = (card) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO cards(name, description, image_url, bad_luck_index) VALUES (?,?,?,?)';
    db.run(sql, [card.name, card.description, card.image_url, card.bad_luck_index], function(err) {
      if (err)
        reject(err);
      else 
        resolve(this.lastID);
    });
  });
}

// update card
export const updateCard = (cardId, card) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE cards SET name = ?, description = ?, image_url = ?, bad_luck_index = ? WHERE id = ?';
    db.run(sql, [card.name, card.description, card.image_url, card.bad_luck_index, cardId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
}

// delete card
export const deleteCard = (cardId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM cards WHERE id = ?';
    db.run(sql, [cardId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
} 