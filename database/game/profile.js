const mongoose = require("mongoose")

const Profile = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    coins: { type: Number, default: 40 },
    cents: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    cooldowns: {
        breaktree: { type: Date },
        minerock: { type: Date },
        daily: { type: Date }
    },
    items: {
      furnace: { type: Boolean, default: false }
    },
    resources: {
        woods: { type: Number, default: 0 },
        stones: { type: Number, default: 0 },
        ironOres: { type: Number, default: 0 },
        ironBrick: { type: Number, default: 0 }
    },
    axe: {
      stone: { type: Boolean, default: false }
    },
    pickaxe: {
      stone: { type: Boolean, default: false }
    },
})

module.exports = { Profile: mongoose.model("Profile", Profile) }
