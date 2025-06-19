/* Data Access Object (DAO) module for accessing Cards */
/* Following qa-server pattern */

import sqlite3 from 'sqlite3';
import db from '../db/database.mjs';

/** CARDS **/



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

