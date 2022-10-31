const mongoose = require("mongoose")

const Profile = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  coins: { type: Number, default: 40 },
  gems: { type: Number, default: 200 },
  luck: { type: Number, default: 0 },
  commandRans: { type: Number, default: 0 },
  craftCount: { type: Number, default: 0 },
  bakeCount: { type: Number, default: 0 },
  cooldowns: {
    chop: { type: Date },
    mine: { type: Date },
    hunt: { type: Date },
    milk: { type: Date },
    wool: { type: Date },
    egg: { type: Date },
    pray: { type: Date },
    daily: { type: Date }
  },
  boost: {
    cakeNormal: { type: Date }
  },
  property: {
    zoo: { type: Boolean, default: false },
    dairy: { type: Boolean, default: false },
    bakery: { type: Boolean, default: false }
  },
  animal: {
    cow: { type: Number, default: 0 },
    pig: { type: Number, default: 0 },
    chicken: { type: Number, default: 0 },
    sheep: { type: Number, default: 0 }
  },
  items: {
    furnace: { type: Boolean, default: false },
    forge: { type: Boolean, default: false },
    buckets: { type: Number, default: 0 },
    cutters: { type: Number, default: 0 },
    baskets: { type: Number, default: 0 }
  },
  resources: {
    woods: { type: Number, default: 0 },
    stones: { type: Number, default: 0 },
    ironOres: { type: Number, default: 0 },
    irons: { type: Number, default: 0 },
    wools: { type: Number, default: 0 }
  },
  crops: {
    wheats: { type: Number, default: 0 }
  },
  foods: {
    milkBuckets: { type: Number, default: 0 },
    eggs: { type: Number, default: 0 },
    butters: { type: Number, default: 0 },
    creams: { type: Number, default: 0 },
    cakeNormal: { type: Number, default: 0 },
    sugars: { type: Number, default: 0 }
  },
  axe: {
    stone: { type: Number, default: 0 },
    iron: { type: Number, default: 0 }
  },
  pickaxe: {
    stone: { type: Number, default: 0 },
    iron: { type: Number, default: 0 }
  },
  achievements: {
    tinyPlayer: { type: Boolean, default: false },
    firstCraft: { type: Boolean, default: false }
  },
  health: {
    cutter: { type: Number, default: 0 },
    basket: { type: Number, default: 0 },
    axe: {
      stone: { type: Number, default: 0 },
      iron: { type: Number, default: 0 }
    },
    pickaxe: {
      stone: { type: Number, default: 0 },
      iron: { type: Number, default: 0 }
    }
  }
})

module.exports = { Profile: mongoose.model("Profile", Profile) }