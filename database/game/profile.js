const mongoose = require("mongoose")

const Profile = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    coins: { type: Number, default: 40 },
    cents: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    commandRans: { type: Number, default: 0 },
    craftCount: { type: Number, default: 0 },
    cooldowns: {
        breaktree: { type: Date },
        minerock: { type: Date },
        mineore: { type: Date },
        hunt: { type: Date },
        daily: { type: Date }
    },
    property: {
        zoo: { type: Boolean, default: false }
    },
    animal: {
        cow: { type: Number, default: 0 },
        pig: { type: Number, default: 0 },
        chicken: { type: Number, default: 0 },
        sheep: { type: Number, default: 0 }
    },
    items: {
      furnace: { type: Boolean, default: false },
      forge: { type: Boolean, default: false }
    },
    resources: { 
        woods: { type: Number, default: 0 },
        stones: { type: Number, default: 0 },
        ironOres: { type: Number, default: 0 },
        ironNuggets: { type: Number, default: 0 },
        ironBricks: { type: Number, default: 0 }
    },
    axe: {
      stone: { type: Boolean, default: false },
      iron: { type: Boolean, default: false }
    },
    pickaxe: {
      stone: { type: Boolean, default: false },
      iron: { type: Boolean, default: false }
    },
    achievements: {
      tinyPlayer: { type: Boolean, default: false },
      firstCraft: { type: Boolean, default: false }
    },
})

module.exports = { Profile: mongoose.model("Profile", Profile) }
