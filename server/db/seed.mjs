import db from './database.mjs';
import bcrypt from 'bcrypt';

const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🌱 Seeding database with initial data...');

    // All themes (active and coming soon) - ordered to ensure consistent IDs
    const themes = [
      {
        id: 1,
        theme_key: 'travel',
        name: 'Travel & Adventure',
        description: 'Trip problems, vacation troubles, and travel disasters',
        icon: 'MapPin',
        color: '#E91E63',
        background_image: '/images/travel.jpg',
        category: 'lifestyle',
        difficulty_level: 2,
        is_active: 1,
        requires_login: 0
      },
      {
        id: 2,
        theme_key: 'work',
        name: 'Work & Career',
        description: 'Office problems, job troubles, and work disasters',
        icon: 'Briefcase',
        color: '#4A90E2',
        background_image: '/images/work.jpg',
        category: 'professional',
        difficulty_level: 1,
        is_active: 1,
        requires_login: 1
      },
      {
        id: 3,
        theme_key: 'family',
        name: 'Family & Home',
        description: 'Family drama, household disasters, and domestic troubles',
        icon: 'Home',
        color: '#808080',
        background_image: '/images/family.jpg',
        category: 'personal',
        difficulty_level: 5,
        is_active: 0,
        requires_login: 1
      },
      {
        id: 4,
        theme_key: 'sports',
        name: 'Sports & Fitness',
        description: 'Athletic failures, gym disasters, and sports mishaps',
        icon: 'Trophy',
        color: '#808080',
        background_image: '/images/sport.jpg',
        category: 'lifestyle',
        difficulty_level: 6,
        is_active: 0,
        requires_login: 1
      },
      {
        id: 5,
        theme_key: 'university',
        name: 'University Life',
        description: 'Academic disasters, campus troubles, and student problems',
        icon: 'GraduationCap',
        color: '#808080',
        background_image: '/images/university.jpg',
        category: 'academic',
        difficulty_level: 7,
        is_active: 0,
        requires_login: 1
      },
      {
        id: 6,
        theme_key: 'love',
        name: 'Love & Dating',
        description: 'Romantic disasters, dating fails, and relationship troubles',
        icon: 'Heart',
        color: '#808080',
        background_image: '/images/loved.jpg',
        category: 'personal',
        difficulty_level: 8,
        is_active: 0,
        requires_login: 1
      }
    ];

    // Default users to seed
    const users = [
      {
        username: 'admin',
        email: 'info@stuffhappens.com',
        password: 'admin123',
        name: 'Admin User'
      },
      {
        username: 'hojjat',
        email: 'hojjat@test.com', 
        password: 'hojjat123',
        name: 'Hojjat'
      },
      {
        username: 'FulvioCorno',
        email: 'fulviocorno@test.com',
        password: 'fulviocorno123',
        name: 'Fulvio Corno'
      },
      {
        username: 'FrancescaRusso',
        email: 'francescarusso@test.com',
        password: 'francescarusso123', 
        name: 'Francesca Russo'
      }
    ];

    // Insert users first
    const insertUsers = () => {
      return new Promise((resolve, reject) => {
        let completed = 0;
        const total = users.length;

        if (total === 0) {
          resolve();
          return;
        }

        users.forEach(async (user, index) => {
          try {
            // Hash password with bcrypt
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            const stmt = db.prepare(`
              INSERT OR IGNORE INTO users 
              (username, email, password_hash, name) 
              VALUES (?, ?, ?, ?)
            `);

            stmt.run([
              user.username, 
              user.email, 
              hashedPassword,
              user.name
            ], function(err) {
              if (err) {
                reject(err);
                return;
              }
              
              completed++;
              if (completed === total) {
                console.log(`✅ Inserted ${total} users`);
                resolve();
              }
            });

            stmt.finalize();
          } catch (error) {
            reject(error);
          }
        });
      });
    };

    // Insert themes second
    const insertThemes = () => {
      return new Promise((resolve, reject) => {
        let completed = 0;
        const total = themes.length;

        if (total === 0) {
          resolve();
          return;
        }

        themes.forEach((theme, index) => {
          const stmt = db.prepare(`
            INSERT OR IGNORE INTO themes 
            (id, theme_key, name, description, icon, color, background_image, category, difficulty_level, is_active, requires_login) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          stmt.run([
            theme.id, theme.theme_key, theme.name, theme.description, theme.icon, theme.color,
            theme.background_image, theme.category, theme.difficulty_level, theme.is_active, theme.requires_login
          ], function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              console.log(`✅ Inserted ${total} themes`);
              resolve();
            }
          });

          stmt.finalize();
        });
      });
    };

    // Work & Career disaster cards (50 cards)
    const workCards = [
      { title: "Accidentally sent personal photo to entire company", severity: 100.0, image: "/work-images/work1.png" },
      { title: "Deleted entire company database by mistake", severity: 97.5, image: "/work-images/work2.png" },
      { title: "Inappropriate relationship with supervisor exposed", severity: 95.0, image: "/work-images/work3.jpeg" },
      { title: "Arrested at work for tax fraud", severity: 92.5, image: "/work-images/work4.png" },
      { title: "Company secrets accidentally sent to competitor", severity: 90.0, image: "/work-images/work5.png" },
      { title: "Stealing from company petty cash discovered", severity: 87.5, image: "/work-images/work6.png" },
      { title: "Threw up on CEO during board meeting", severity: 85.0, image: "/work-images/work7.png" },
      { title: "Drinking alcohol during important presentation", severity: 82.5, image: "/work-images/work8.png" },
      { title: "Adult content discovered on work computer", severity: 80.0, image: "/work-images/work9.jpeg" },
      { title: "Physical fight with supervisor in lobby", severity: 77.5, image: "/work-images/work10.png" },
      { title: "Accidentally started office fire", severity: 75.0, image: "/work-images/work11.jpeg" },
      { title: "Workplace discrimination complaint filed", severity: 72.5, image: "/work-images/work12.jpeg" },
      { title: "Fell down stairs and broke both legs", severity: 70.0, image: "/work-images/work13.png" },
      { title: "Pants fell down during important client meeting", severity: 67.5, image: "/work-images/work14.png" },
      { title: "Food poisoning from company cafeteria lunch", severity: 65.0, image: "/work-images/work15.png" },
      { title: "Elevator trapped you inside for 8 hours", severity: 62.5, image: "/work-images/work16.png" },
      { title: "Locked out of building completely ", severity: 60.0, image: "/work-images/work17.png" },
      { title: "Insulted boss accidentally in group email", severity: 57.5, image: "/work-images/work18.jpeg" },
      { title: "Bathroom stall door jammed during emergency", severity: 55.0, image: "/work-images/work19.jpeg" },
      { title: "Spilled hot coffee on major client", severity: 52.5, image: "/work-images/work20.png" },
      { title: "Resume lies exposed during interview", severity: 50.0, image: "/work-images/work21.png" },
      { title: "Snored loudly during important meeting", severity: 47.5, image: "/work-images/work22.jpeg" },
      { title: "Vomited on desk from stomach flu", severity: 45.0, image: "/work-images/work23.png" },
      { title: "Expensive office equipment broken accidentally", severity: 42.5, image: "/work-images/work24.jpeg" },
      { title: "Lost and missed crucial client presentation", severity: 40.0, image: "/work-images/work25.jpeg" },
      { title: "Forgot to wear pants to work", severity: 37.5, image: "/work-images/work26.png" },
      { title: "Revolving door trapped you embarrassingly", severity: 35.0, image: "/work-images/work27.png" },
      { title: "Angry email sent to boss by mistake", severity: 32.5, image: "/work-images/work28.png" },
      { title: "Nose picking witnessed during video call", severity: 30.0, image: "/work-images/work29.png" },
      { title: "Tripped and fell in front of everyone", severity: 27.5, image: "/work-images/work30.png" },
      { title: "Bad-mouthing boss overheard by colleagues", severity: 25.0, image: "/work-images/work31.png" },
      { title: "Pajamas worn to office accidentally", severity: 22.5, image: "/work-images/work32.jpeg" },
      { title: "Hiccups disrupted entire presentation", severity: 20.0, image: "/work-images/work33.png" },
      { title: "Boss's name completely forgotten at meeting", severity: 17.5, image: "/work-images/work34.png" },
      { title: "Smelly fish lunch offended coworkers", severity: 15.0, image: "/work-images/work35.jpeg" },
      { title: "Called boss 'mom' during conversation", severity: 12.5, image: "/work-images/work36.png" },
      { title: "Paper cut during handshake with client", severity: 10.0, image: "/work-images/work37.png" },
      { title: "Loud sneeze interrupted silent moment", severity: 7.5, image: "/work-images/work38.png" },
      { title: "Pen dropped during job interview", severity: 5.0, image: "/work-images/work39.png" },
      { title: "Personal phone use during work hours", severity: 2.5, image: "/work-images/work40.png" },
      { title: "Email resignation sent accidentally", severity: 100.0, image: "/work-images/work41.png" },
      { title: "Chronic lateness finally addressed", severity: 1.0, image: "/work-images/work42.png" },
      { title: "Important client's name forgotten completely", severity: 3.5, image: "/work-images/work43.png" },
      { title: "Sleeping at desk during work hours", severity: 6.0, image: "/work-images/work44.png" },
      { title: "Two different shoes worn to work", severity: 8.5, image: "/work-images/work45.png" },
      { title: "Office bathroom door stuck for hours", severity: 11.0, image: "/work-images/work46.png" },
      { title: "Lunch spilled on important documents", severity: 13.5, image: "/work-images/work47.png" },
      { title: "Company car used for personal date", severity: 16.0, image: "/work-images/work48.png" },
      { title: "Boss's favorite coffee mug broken", severity: 18.5, image: "/work-images/work49.png" },
      { title: "Personal calls made during work time", severity: 21.0, image: "/work-images/work50.png" }
    ];

    // Travel & Adventure disaster cards (50 cards)
    const travelCards = [
      { title: "Kidnapped by local gang for ransom", severity: 100.0, image: "/images/travel1.png" },
      { title: "Plane crash survivor stranded alone", severity: 97.5, image: "/images/travel2.png" },
      { title: "Wild animal attack during safari", severity: 95.0, image: "/images/travel3.png" },
      { title: "Lost in jungle for three days", severity: 92.5, image: "/images/travel4.png" },
      { title: "Arrested for unknowing drug smuggling", severity: 90.0, image: "/images/travel5.png" },
      { title: "Hotel room fire with you inside", severity: 87.5, image: "/images/travel6.png" },
      { title: "Robbed and beaten by strangers", severity: 85.0, image: "/images/travel7.png" },
      { title: "Fell off cliff during hiking trip", severity: 82.5, image: "/images/travel8.png" },
      { title: "Severe food poisoning nearly fatal", severity: 80.0, image: "/images/travel9.png" },
      { title: "Car accident left you stranded", severity: 77.5, image: "/images/travel10.png" },
      { title: "Lost at sea during boat excursion", severity: 75.0, image: "/images/travel11.png" },
      { title: "Passport and money stolen together", severity: 72.5, image: "/images/travel12.png" },
      { title: "Earthquake struck tourist area", severity: 70.0, image: "/images/travel13.png" },
      { title: "Illegal drugs planted in luggage", severity: 67.5, image: "/images/travel14.png" },
      { title: "Poisonous snake bite while exploring", severity: 65.0, image: "/images/travel15.png" },
      { title: "Ice broke while skiing downhill", severity: 62.5, image: "/images/travel16.png" },
      { title: "Avalanche trapped you in snow", severity: 60.0, image: "/images/travel17.png" },
      { title: "Deadly spiders found in hotel bed", severity: 57.5, image: "/images/travel18.png" },
      { title: "Severe sunburn caused skin blisters", severity: 55.0, image: "/images/travel19.png" },
      { title: "Taxi driver attempted robbery", severity: 52.5, image: "/images/travel20.png" },
      { title: "Foreign jail cell became temporary home", severity: 50.0, image: "/images/travel21.png" },
      { title: "River crossing with crocodiles present", severity: 47.5, image: "/images/travel22.png" },
      { title: "Desert trek without water supply", severity: 45.0, image: "/images/travel23.png" },
      { title: "Stomach illness ruined entire vacation", severity: 42.5, image: "/images/travel24.png" },
      { title: "Tourist scam took all your money", severity: 40.0, image: "/images/travel25.png" },
      { title: "Wrong airport terminal caused missed flight", severity: 37.5, image: "/images/travel26.png" },
      { title: "Contaminated water caused severe illness", severity: 35.0, image: "/images/travel27.png" },
      { title: "All luggage lost by airline", severity: 32.5, image: "/images/travel28.png" },
      { title: "Foreign hospital stay required", severity: 30.0, image: "/images/travel29.png" },
      { title: "Rental car breakdown in remote area", severity: 27.5, image: "/images/travel30.png" },
      { title: "Allergic reaction to local cuisine", severity: 25.0, image: "/images/travel31.png" },
      { title: "Hotel overbooked despite reservation", severity: 22.5, image: "/images/travel32.png" },
      { title: "Pickpocketed on crowded street", severity: 20.0, image: "/images/travel33.png" },
      { title: "Flight delayed twelve hours unexpectedly", severity: 17.5, image: "/images/travel34.png" },
      { title: "Motion sickness during entire journey", severity: 15.0, image: "/images/travel35.png" },
      { title: "Phone lost with all travel information", severity: 12.5, image: "/images/travel36.png" },
      { title: "First day sunburn ruined vacation", severity: 10.0, image: "/images/travel37.png" },
      { title: "Underwear forgotten in packing rush", severity: 7.5, image: "/images/travel38.png" },
      { title: "Wrong directions from helpful local", severity: 5.0, image: "/images/travel39.png" },
      { title: "Tour bus departure missed by minutes", severity: 2.5, image: "/images/travel40.png" },
      { title: "Camera charger left at home", severity: 1.0, image: "/images/travel41.png" },
      { title: "Thunderstorm ruined outdoor activities", severity: 3.5, image: "/images/travel42.png" },
      { title: "Hotel WiFi slower than dial-up", severity: 6.0, image: "/images/travel43.png" },
      { title: "Airplane seat mix-up with stranger", severity: 8.5, image: "/images/travel44.png" },
      { title: "Toothbrush forgotten for entire trip", severity: 11.0, image: "/images/travel45.png" },
      { title: "Bathroom hunt became urgent mission", severity: 13.5, image: "/images/travel46.png" },
      { title: "Airline meal caused stomach upset", severity: 16.0, image: "/images/travel47.png" },
      { title: "Currency exchange rate completely wrong", severity: 18.5, image: "/images/travel48.png" },
      { title: "Alarm failure caused flight miss", severity: 21.0, image: "/images/travel49.png" },
      { title: "Language barrier created confusion", severity: 23.5, image: "/images/travel50.png" }
    ];

    // Insert cards for themes
    const insertCards = () => {
      return new Promise((resolve, reject) => {
        // Get theme IDs first
        db.all("SELECT id, theme_key FROM themes", [], (err, themeRows) => {
          if (err) {
            reject(err);
            return;
          }

          console.log('🔍 Theme rows found:', themeRows);

          const themeMap = {};
          themeRows.forEach(row => {
            themeMap[row.theme_key] = row.id;
          });

          console.log('🗺️ Theme mapping:', themeMap);

          const allCards = [
            ...workCards.map(card => ({ ...card, theme_id: themeMap['work'] })),
            ...travelCards.map(card => ({ ...card, theme_id: themeMap['travel'] }))
          ];

          let completed = 0;
          const total = allCards.length;

          if (total === 0) {
            resolve();
            return;
          }

          allCards.forEach(card => {
            const stmt = db.prepare(`
              INSERT OR IGNORE INTO cards 
              (theme_id, title, image_url, bad_luck_severity) 
              VALUES (?, ?, ?, ?)
            `);

            stmt.run([card.theme_id, card.title, card.image, card.severity], function(err) {
              if (err) {
                reject(err);
                return;
              }
              
              completed++;
              if (completed === total) {
                console.log(`✅ Inserted ${total} disaster cards`);
                resolve();
              }
            });

            stmt.finalize();
          });
        });
      });
    };

    // Run seeding process
    insertUsers()
      .then(() => insertThemes())
      .then(() => insertCards())
      .then(() => {
        console.log('🎉 Database seeding completed successfully!');
        resolve();
      })
      .catch((error) => {
        console.error('💥 Database seeding failed:', error);
        reject(error);
      });
  });
};

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🌟 Seeding process completed!');
      db.close(() => {
        process.exit(0);
      });
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      db.close(() => {
        process.exit(1);
      });
    });
}

export default seedDatabase; 