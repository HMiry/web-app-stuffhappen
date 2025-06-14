/**
 * DB access module
 */

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Open database connection
const db = new sqlite3.Database(join(__dirname, 'stuffhappens.db'), (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('📦 Connected to the SQLite database: stuffhappens.db');
      
      // Enable foreign keys
        db.exec('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('❌ Error enabling foreign keys:', err.message);
    }
        });
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('📦 Database connection closed.');
    }
        process.exit(0);
    });
});

export default db; 