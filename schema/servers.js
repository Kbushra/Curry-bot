const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema
({
    guildId: {type: String, required: true},
    enableTasks: {type: Array, default: [true, true, true, false]},
    bonusTasknames: {type: Array, default: []},
    bonusTaskdescriptions: {type: Array, default: []},
    enableRoles: {type: Array, default: [true, true]},
    enableItems: {type: Array, default: [true, true, true, true, true]},
    customItemnames: {type: Array, default: []},
    customItemdescs: {type: Array, default: []},
    customItemprices: {type: Array, default: []},
    stockCosts: {type: Number, default: 15},
    taskRequirements: {type: Array, default: [50, 30, 8, 14]},
    itemPrices: {type: Array, default: [27, 10, 15, 50, 100]},
})

const model = mongoose.model("servers", serverSchema);

module.exports = model;