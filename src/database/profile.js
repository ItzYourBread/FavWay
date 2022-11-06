import mongoose from "mongoose";

const Profile = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  prestige: { type: Number, default: 1 },
  coins: { type: Number, default: 40 },
  gems: { type: Number, default: 200 },
  luck: { type: Number, default: 0 },
  commandRans: { type: Number, default: 0 },
  lastTime: { type: Date },
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
    buckets: { type: Number, default: 0 },
    cutters: { type: Number, default: 0 },
    baskets: { type: Number, default: 0 },
    axes: { type: Number, default: 0 },
    pickaxes: { type: Number, default: 0 }
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
  achievements: {
    regularUser: { type: Boolean, default: false }
  },
  health: {
    cutter: { type: Number, default: 0 },
    basket: { type: Number, default: 0 },
    axe: { type: Number, default: 0 },
    pickaxe: { type: Number, default: 0 },
  },
  settings: {
    compactMode: { type: Boolean, default: false },
    dmMode: { type: Boolean, default: false }
  }
})

const User = mongoose.model("Profile", Profile)
export { User }