const mongoose = require("mongoose")

const Equips = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    axe: { type: Boolean, default: false },
    pickaxe: { type: Boolean, default: false }
})

module.exports = { Equips: mongoose.model("Equips", Equips) }