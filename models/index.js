var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  if (env === 'test') config.logging = false;
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.User = require('./user')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.List = require('./list')(sequelize, Sequelize);
db.Card = require('./card')(sequelize, Sequelize);
db.Event = require('./event')(sequelize, Sequelize);

// Associations
const { User, Board, List, Card, Event } = db;

User.hasMany(Board);
Board.belongsTo(User);

Board.hasMany(List, { onDelete: 'cascade', hooks:true });
List.belongsTo(Board);

List.hasMany(Card, { onDelete: 'cascade', hooks: true });
Card.belongsTo(List);

Card.belongsToMany(User, { through: 'UserCard' });
User.belongsToMany(Card, { through: 'UserCard' });


User.hasMany(Event);
Event.belongsTo(User);

Card.hasMany(Event, { onDelete: 'cascade', hooks: true });
Event.belongsTo(Card);

module.exports = db;
