/* 
 * ArenaModels.mjs - Model Constructor Functions
 * Following qa-server pattern
 * 
 * ⚠️  CURRENTLY NOT USED - Collections return raw DB objects
 * 
 * 📝 WHEN TO USE THIS FILE:
 * 
 * 1. DATE FORMATTING - When you need automatic date parsing:
 *    import dayjs from 'dayjs';
 *    function User(id, username, email, created_at) {
 *      this.id = id;
 *      this.username = username;
 *      this.email = email;
 *      this.created_at = dayjs(created_at); // Auto-formats dates
 *    }
 * 
 * 2. COMPUTED PROPERTIES - When you need calculated fields:
 *    function User(id, username, role, created_at) {
 *      this.id = id;
 *      this.username = username;
 *      this.role = role;
 *      this.created_at = dayjs(created_at);
 *      
 *      // Computed properties:
 *      this.isAdmin = () => this.role === 'admin';
 *      this.displayName = () => this.username.toUpperCase();
 *      this.memberSince = () => dayjs().diff(this.created_at, 'days');
 *    }
 * 
 * 3. BUSINESS LOGIC - When you need consistent methods:
 *    function Game(id, name, status, max_players, current_players) {
 *      this.id = id;
 *      this.name = name;
 *      this.status = status;
 *      this.max_players = max_players;
 *      this.current_players = current_players;
 *      
 *      // Business logic methods:
 *      this.canJoin = () => this.status === 'waiting' && this.current_players < this.max_players;
 *      this.isFull = () => this.current_players >= this.max_players;
 *      this.isActive = () => this.status === 'active';
 *    }
 * 
 * 📋 HOW TO USE IN COLLECTIONS:
 * 
 * Instead of:
 *   resolve(rows); // Raw DB objects
 * 
 * Do this:
 *   const users = rows.map((u) => new User(u.id, u.username, u.email, u.created_at));
 *   resolve(users); // Model objects with methods
 * 
 * 📦 REQUIRED DEPENDENCY:
 *   npm install dayjs
 * 
 * 🔄 TO ACTIVATE:
 *   1. Uncomment the models you need below
 *   2. Import them in your collections
 *   3. Use constructors in your DAO functions
 */

// import dayjs from 'dayjs';

// Uncomment when needed:

// function User(id, username, email, avatar_url, role, created_at) {
//   this.id = id;
//   this.username = username;
//   this.email = email;
//   this.avatar_url = avatar_url;
//   this.role = role;
//   this.created_at = dayjs(created_at);
// }

// function Game(id, name, theme_id, creator_id, status, created_at) {
//   this.id = id;
//   this.name = name;
//   this.theme_id = theme_id;
//   this.creator_id = creator_id;
//   this.status = status;
//   this.created_at = dayjs(created_at);
// }

// function Card(id, name, description, image_url, bad_luck_index, theme_id) {
//   this.id = id;
//   this.name = name;
//   this.description = description;
//   this.image_url = image_url;
//   this.bad_luck_index = bad_luck_index;
//   this.theme_id = theme_id;
// }

// function Theme(id, name, description, created_at) {
//   this.id = id;
//   this.name = name;
//   this.description = description;
//   this.created_at = dayjs(created_at);
// }

// export { User, Game, Card, Theme }; 