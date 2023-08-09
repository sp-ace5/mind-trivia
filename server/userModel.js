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
      allowNull: false,
    },
    'General Knowledge': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Books': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Film': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Music': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Musicals & Theatres': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Television': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Video Games': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Board Games': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Science & Nature': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Science: Computers': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Science: Mathematics': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Mythology: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Sports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Geography: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    History: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Politics: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Art: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Celebrities: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Animals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Vehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Comics': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Science: Gadgets': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Japanese Anime & Manga': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'Entertainment: Cartoon & Animations': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
