const mongoose = require('mongoose');

const ecoSchema = new mongoose.Schema
({
    userId: {type: String, required: true},
    guildId: {type: String, required: true},
    balance: {type: Number, default: 5},
    itemAmt: {type: Number, default: 0},
    inventory: {type: Array, default: []},
    completedTask: {type: Array, default: [false, false, false, false]},
    roles: {type: Array, default: [false, false]},
    msgCount: {type: Number, default: 0},
    reqTime: {type: Number, default: 2629746000},
    dailyTimer: {type: Number, default: 0},
    dailyStreak: {type: Number, default: 0},
    taskMoney: {type: Number, default: 0},
    modifier: {type: Number, default: 1},
    taskMultiply: {type: Number, default: 1},
    prestigeMultiply: {type: Number, default: 1},
    speakingAddon: {type: Number, default: 0},
    ogAddon: {type: Number, default: 0},
    dailyAddon: {type: Number, default: 0},
    embedAddon: {type: Number, default: 0},
    cashpassTimer: {type: Number, default: 0},
    stockTimer: {type: Number, default: 0},
    embedCount: {type: Number, default: 0},
})

const model = mongoose.model("economy", ecoSchema);

module.exports = model;