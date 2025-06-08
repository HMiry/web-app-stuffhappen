import db from './database.mjs';

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🚀 Initializing database tables...');

    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        reject(err);
        return;
      }

    // Themes table
      db.exec(`
      CREATE TABLE IF NOT EXISTS themes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        difficulty_level INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }

    // Games table
        db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme_id INTEGER NOT NULL,
        creator_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        max_players INTEGER DEFAULT 4,
        current_players INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'waiting',
        start_time DATETIME,
        end_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id),
        FOREIGN KEY (creator_id) REFERENCES users(id)
      )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }

    // Game participants table
          db.exec(`
      CREATE TABLE IF NOT EXISTS game_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        score INTEGER DEFAULT 0,
        rank INTEGER,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(game_id, user_id)
      )
          `, (err) => {
            if (err) {
              reject(err);
              return;
            }

    // User profiles table
            db.exec(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        bio TEXT,
        total_games INTEGER DEFAULT 0,
        total_wins INTEGER DEFAULT 0,
        total_points INTEGER DEFAULT 0,
        ranking INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
            `, (err) => {
              if (err) {
                reject(err);
                return;
              }

    // Leaderboard table
              db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme_id INTEGER,
        points INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        games_won INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (theme_id) REFERENCES themes(id),
        UNIQUE(user_id, theme_id)
      )
              `, (err) => {
                if (err) {
                  reject(err);
                } else {
    console.log('✅ Database initialized successfully!');
    console.log('📋 Created tables: users, themes, games, game_participants, user_profiles, leaderboard');
                  resolve();
  }
              });
            });
          });
        });
      });
    });
  });
};

// Run initialization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!');
      db.close(() => {
      process.exit(0);
      });
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      db.close(() => {
      process.exit(1);
      });
    });
}

export default initDatabase; 