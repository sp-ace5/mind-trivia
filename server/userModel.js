const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const UserStats = sequelize.define(
  'user_stats',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    general_knowledge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_books: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_film: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_music: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_musicals_theatres: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_television: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_video_games: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_board_games: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    science_nature: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    science_computers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    science_mathematics: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    mythology: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    geography: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    history: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    politics: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    art: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    celebrities: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    animals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    vehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_comics: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    science_gadgets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_japanese_anime_manga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entertainment_cartoon_animations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_questions_answered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = {
  UserStats,
  User,
};
