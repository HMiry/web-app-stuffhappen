import db from './database.mjs';
import bcrypt from 'bcrypt';

const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🌱 Seeding database with initial data...');

    // Active themes with cards + Coming Soon themes
    const themes = [
      // Active playable themes (ordered first)
      {
        theme_key: 'university',
        name: 'University Life',
        description: 'Academic disasters, dorm room catastrophes, and campus embarrassments',
        icon: 'GraduationCap',
        color: '#4A90E2',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
        category: 'education',
        difficulty_level: 1,
        is_active: 1,
        requires_login: 0
      },
      {
        theme_key: 'love',
        name: 'Love & Dating',
        description: 'Romantic disasters and relationship catastrophes',
        icon: 'Heart',
        color: '#E91E63',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62689.jpeg',
        category: 'relationships',
        difficulty_level: 2,
        is_active: 1,
        requires_login: 1
      },
      // Coming Soon themes (inactive, locked, ordered after active ones)
      {
        theme_key: 'family',
        name: 'Family & Home',
        description: 'Family disasters, household catastrophes, and domestic mishaps',
        icon: 'Home',
        color: '#6B7280',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
        category: 'relationships',
        difficulty_level: 5,
        is_active: 0,
        requires_login: 1
      },
      {
        theme_key: 'sports',
        name: 'Sports & Fitness',
        description: 'Athletic disasters, gym embarrassments, and sports catastrophes',
        icon: 'Dumbbell',
        color: '#6B7280',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
        category: 'lifestyle',
        difficulty_level: 6,
        is_active: 0,
        requires_login: 1
      },
      {
        theme_key: 'travel',
        name: 'Travel & Adventure',
        description: 'Vacation disasters, travel mishaps, and adventure gone wrong',
        icon: 'MapPin',
        color: '#6B7280',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
        category: 'lifestyle',
        difficulty_level: 7,
        is_active: 0,
        requires_login: 1
      },
      {
        theme_key: 'work',
        name: 'Work & Career',
        description: 'Professional disasters, office mishaps, and career catastrophes',
        icon: 'Briefcase',
        color: '#6B7280',
        background_image: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
        category: 'professional',
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
        name: 'Admin User',
        role: 'admin'
      },
      {
        username: 'hojjat',
        email: 'hojjat@test.com', 
        password: 'hojjat123',
        name: 'Hojjat',
        role: 'user'
      },
      {
        username: 'FulvioCorno',
        email: 'fulviocorno@test.com',
        password: 'fulviocorno123',
        name: 'Fulvio Corno',
        role: 'user'
      },
      {
        username: 'FrancescaRusso',
        email: 'francescarusso@test.com',
        password: 'francescarusso123', 
        name: 'Francesca Russo',
        role: 'user'
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
              (username, email, password_hash, salt, name, role) 
              VALUES (?, ?, ?, ?, ?, ?)
            `);

            stmt.run([
              user.username, 
              user.email, 
              hashedPassword,
              '', // No separate salt needed with bcrypt
              user.name, 
              user.role
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
            (theme_key, name, description, icon, color, background_image, category, difficulty_level, is_active, requires_login) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          stmt.run([
            theme.theme_key, theme.name, theme.description, theme.icon, theme.color,
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

    // University Life disaster cards (50 cards)
    const universityCards = [
      { title: "Failed your thesis defense", severity: 85.5, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg" },
      { title: "Emailed professor at 3 AM asking for extension", severity: 25.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62683.jpeg" },
      { title: "Slept through your final exam", severity: 90.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62684.jpeg" },
      { title: "Forgot to submit your final assignment", severity: 80.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62685.jpeg" },
      { title: "Spilled coffee on your laptop during presentation", severity: 45.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62686.jpeg" },
      { title: "Lost your student ID on graduation day", severity: 40.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg" },
      { title: "Missed your graduation ceremony", severity: 70.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62688.jpeg" },
      { title: "Failed all courses in your final semester", severity: 95.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62689.jpeg" },
      { title: "Got locked out of dorm room naked", severity: 60.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62690.jpeg" },
      { title: "Professor caught you cheating on exam", severity: 88.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62691.jpeg" },
      { title: "Accidentally deleted your final project", severity: 75.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62692.jpeg" },
      { title: "Got food poisoning during finals week", severity: 55.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62693.jpeg" },
      { title: "Called your professor 'mom' during lecture", severity: 15.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62694.jpeg" },
      { title: "Submitted the wrong assignment file", severity: 35.0, image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62695.jpeg" },
      { title: "Forgot about group project presentation", severity: 65.0, image: "/images/freepik__the-style-is-candid-image-ography-with-natural__62696.jpeg" },
      
      // Additional university cards (35 more to reach 50 total)
      { title: "Wore pajamas to an important lecture", severity: 20.0, image: "/images/university16.jpeg" },
      { title: "Fell asleep during thesis presentation", severity: 82.0, image: "/images/university17.jpeg" },
      { title: "Accidentally sent inappropriate meme to professor", severity: 50.0, image: "/images/university18.jpeg" },
      { title: "Failed to show up for your own office hours", severity: 30.0, image: "/images/university19.jpeg" },
      { title: "Got caught plagiarizing your own work", severity: 77.5, image: "/images/university20.jpeg" },
      { title: "Arrived one day late to final exam", severity: 92.5, image: "/images/university21.jpeg" },
      { title: "Submitted assignment to wrong professor", severity: 37.5, image: "/images/university22.jpeg" },
      { title: "Forgot you were teaching and missed class", severity: 67.5, image: "/images/university23.jpeg" },
      { title: "Called academic advisor by wrong name for 4 years", severity: 22.5, image: "/images/university24.jpeg" },
      { title: "Dropped laptop during important presentation", severity: 52.5, image: "/images/university25.jpeg" },
      { title: "Wore same clothes to class for a week", severity: 27.5, image: "/images/university26.jpeg" },
      { title: "Forgot you had a midterm until 5 minutes before", severity: 87.5, image: "/images/university27.jpeg" },
      { title: "Accidentally enrolled in graduate course as freshman", severity: 42.5, image: "/images/university28.jpeg" },
      { title: "Lost your thesis the day before defense", severity: 97.5, image: "/images/university29.jpeg" },
      { title: "Got locked in library overnight before finals", severity: 32.5, image: "/images/university30.jpeg" },
      { title: "Walked into wrong classroom and taught entire lecture", severity: 72.0, image: "/images/university31.jpeg" },
      { title: "Accidentally submitted first draft instead of final", severity: 58.0, image: "/images/university32.jpeg" },
      { title: "Got caught cheating on open-book exam", severity: 83.0, image: "/images/university33.jpeg" },
      { title: "Failed to attend your own graduation", severity: 73.5, image: "/images/university34.jpeg" },
      { title: "Realized you're in wrong major after 3 years", severity: 89.0, image: "/images/university35.jpeg" },
      { title: "Accidentally CC'd entire class on private email", severity: 48.0, image: "/images/university36.jpeg" },
      { title: "Showed up drunk to thesis committee meeting", severity: 94.0, image: "/images/university37.jpeg" },
      { title: "Lost scholarship due to social media post", severity: 86.0, image: "/images/university38.jpeg" },
      { title: "Got name wrong on diploma application", severity: 41.0, image: "/images/university39.jpeg" },
      { title: "Accidentally joined cult instead of study group", severity: 78.0, image: "/images/university40.jpeg" },
      { title: "Failed driving test on university grounds", severity: 28.0, image: "/images/university41.jpeg" },
      { title: "Got caught napping in library study room", severity: 18.0, image: "/images/university42.jpeg" },
      { title: "Wore flip-flops to internship interview", severity: 33.0, image: "/images/university43.jpeg" },
      { title: "Accidentally started food fight in cafeteria", severity: 46.0, image: "/images/university44.jpeg" },
      { title: "Got lost on campus for entire first semester", severity: 24.0, image: "/images/university45.jpeg" },
      { title: "Failed to pay tuition and got locked out", severity: 91.0, image: "/images/university46.jpeg" },
      { title: "Accidentally joined wrong fraternity/sorority", severity: 54.0, image: "/images/university47.jpeg" },
      { title: "Got caught using ChatGPT for entire dissertation", severity: 96.0, image: "/images/university48.jpeg" },
      { title: "Missed acceptance letter for dream graduate program", severity: 84.0, image: "/images/university49.jpeg" },
      { title: "Got suspended for throwing party in dorm", severity: 69.0, image: "/images/university50.jpeg" }
    ];

    // Love & Dating disaster cards (50 cards)
    const loveCards = [
      { title: "Accidentally sent text about date to the date", severity: 45.0, image: "/images/love1.jpeg" },
      { title: "Met your ex at your wedding", severity: 80.0, image: "/images/love2.jpeg" },
      { title: "Forgot your anniversary completely", severity: 70.0, image: "/images/love3.jpeg" },
      { title: "Called your partner by wrong name", severity: 60.0, image: "/images/love4.jpeg" },
      { title: "Parents walked in during intimate moment", severity: 85.0, image: "/images/love5.jpeg" },
      { title: "Accidentally liked ex's photo from 2 years ago", severity: 25.0, image: "/images/love6.jpeg" },
      { title: "Got dumped via text message", severity: 55.0, image: "/images/love7.jpeg" },
      { title: "Date saw your embarrassing childhood photos", severity: 30.0, image: "/images/love8.jpeg" },
      { title: "Proposed and got rejected publicly", severity: 95.0, image: "/images/love9.jpeg" },
      { title: "Found out you're dating your friend's ex", severity: 75.0, image: "/images/love10.jpeg" },
      
      // Additional love & dating cards (40 more to reach 50 total)
      { title: "Showed up to wrong restaurant for first date", severity: 35.0, image: "/images/love11.jpeg" },
      { title: "Accidentally sent love letter to wrong person", severity: 50.0, image: "/images/love12.jpeg" },
      { title: "Got caught stalking ex's social media", severity: 40.0, image: "/images/love13.jpeg" },
      { title: "Wore same outfit on three consecutive dates", severity: 20.0, image: "/images/love14.jpeg" },
      { title: "Fell asleep during romantic dinner", severity: 65.0, image: "/images/love15.jpeg" },
      { title: "Accidentally invited two dates to same event", severity: 87.5, image: "/images/love16.jpeg" },
      { title: "Got food poisoning on anniversary dinner", severity: 52.5, image: "/images/love17.jpeg" },
      { title: "Lost engagement ring in restaurant", severity: 90.0, image: "/images/love18.jpeg" },
      { title: "Accidentally called date by ex's name during proposal", severity: 92.5, image: "/images/love19.jpeg" },
      { title: "Posted breakup status before telling partner", severity: 77.5, image: "/images/love20.jpeg" },
      { title: "Forgot Valentine's Day for third year running", severity: 72.5, image: "/images/love21.jpeg" },
      { title: "Got drunk and confessed to wrong person", severity: 42.5, image: "/images/love22.jpeg" },
      { title: "Accidentally sent intimate photo to family group chat", severity: 97.5, image: "/images/love23.jpeg" },
      { title: "Showed up to wedding in white (not the bride)", severity: 82.5, image: "/images/love24.jpeg" },
      { title: "Got caught on dating app while in relationship", severity: 88.0, image: "/images/love25.jpeg" },
      { title: "Ran into ex on honeymoon with new spouse", severity: 83.5, image: "/images/love26.jpeg" },
      { title: "Accidentally pocket-dialed ex during intimate moment", severity: 78.0, image: "/images/love27.jpeg" },
      { title: "Got stood up on Valentine's Day", severity: 58.0, image: "/images/love28.jpeg" },
      { title: "Discovered partner's secret dating profile", severity: 89.0, image: "/images/love29.jpeg" },
      { title: "Sent breakup text to wrong person", severity: 46.0, image: "/images/love30.jpeg" },
      { title: "Wore ex's shirt on date with new person", severity: 54.0, image: "/images/love31.jpeg" },
      { title: "Got caught lying about age on dating profile", severity: 41.0, image: "/images/love32.jpeg" },
      { title: "Accidentally introduced date as 'friend' to parents", severity: 48.0, image: "/images/love33.jpeg" },
      { title: "Forgot partner's birthday three years in a row", severity: 67.0, image: "/images/love34.jpeg" },
      { title: "Got food stuck in teeth throughout entire first date", severity: 28.0, image: "/images/love35.jpeg" },
      { title: "Accidentally liked every photo on crush's Instagram", severity: 36.0, image: "/images/love36.jpeg" },
      { title: "Got drunk and kissed best friend's partner", severity: 91.0, image: "/images/love37.jpeg" },
      { title: "Wore same dress to ex's wedding as the bride", severity: 86.0, image: "/images/love38.jpeg" },
      { title: "Got caught reading partner's diary", severity: 73.0, image: "/images/love39.jpeg" },
      { title: "Accidentally invited ex to engagement party", severity: 79.0, image: "/images/love40.jpeg" },
      { title: "Lost wedding ring on bachelor/bachelorette party", severity: 84.0, image: "/images/love41.jpeg" },
      { title: "Got caught cheating via social media post", severity: 93.0, image: "/images/love42.jpeg" },
      { title: "Showed up late to own wedding ceremony", severity: 81.0, image: "/images/love43.jpeg" },
      { title: "Accidentally sent romantic text to boss", severity: 56.0, image: "/images/love44.jpeg" },
      { title: "Got rejected by online date in person", severity: 62.0, image: "/images/love45.jpeg" },
      { title: "Discovered partner's identical twin and got confused", severity: 49.0, image: "/images/love46.jpeg" },
      { title: "Got caught on kiss-cam with wrong person", severity: 53.0, image: "/images/love47.jpeg" },
      { title: "Accidentally RSVPed 'no' to own wedding", severity: 71.0, image: "/images/love48.jpeg" },
      { title: "Got caught practicing proposal in public", severity: 32.0, image: "/images/love49.jpeg" },
      { title: "Accidentally married wrong person in Vegas", severity: 98.0, image: "/images/love50.jpeg" }
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
            ...universityCards.map(card => ({ ...card, theme_id: themeMap['university'] })),
            ...loveCards.map(card => ({ ...card, theme_id: themeMap['love'] }))
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