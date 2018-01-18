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

// Relations
const { User, Board, List } = db;

User.hasMany(Board);
Board.belongsTo(User);

Board.hasMany(List);
List.belongsTo(Board);

module.exports = db;
