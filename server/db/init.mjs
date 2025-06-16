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
        salt VARCHAR(32) NOT NULL,
        name VARCHAR(100),
        university VARCHAR(100),
        major VARCHAR(100),
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
        theme_key VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(20),
        background_image VARCHAR(255),
        category VARCHAR(50),
        difficulty_level INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        requires_login BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }

    // Cards table for disaster cards
        db.exec(`
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        bad_luck_severity DECIMAL(5,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id)
      )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }

    // Game sessions table
          db.exec(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        theme_id INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        total_rounds INTEGER DEFAULT 6,
        current_round INTEGER DEFAULT 1,
        current_round_start_time DATETIME,
        cards_won INTEGER DEFAULT 0,
        wrong_guesses INTEGER DEFAULT 0,
        max_wrong_guesses INTEGER DEFAULT 3,
        final_score INTEGER DEFAULT 0,
        time_started DATETIME DEFAULT CURRENT_TIMESTAMP,
        time_finished DATETIME,
        game_result VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (theme_id) REFERENCES themes(id)
      )
          `, (err) => {
            if (err) {
              reject(err);
              return;
            }

    // Game rounds table for detailed round tracking
            db.exec(`
      CREATE TABLE IF NOT EXISTS game_rounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_session_id INTEGER NOT NULL,
        round_number INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        user_choice_position INTEGER,
        correct_position INTEGER NOT NULL,
        is_correct BOOLEAN DEFAULT 0,
        time_taken INTEGER,
        points_earned INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_session_id) REFERENCES game_sessions(id),
        FOREIGN KEY (card_id) REFERENCES cards(id)
      )
              `, (err) => {
                if (err) {
                  reject(err);
                  return;
                }

                  console.log('✅ Database initialized successfully!');
                  console.log('📋 Created tables: users, themes, cards, game_sessions, game_rounds');
                  resolve();
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