const mongoose = require("mongoose")

const Profile = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    coins: { type: Number, default: 20 },
    cents: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    cooldowns: {
        breaktree: { type: Date },
        minerock: { type: Date },
        daily: { type: Date }
    },
    resources: {
        woods: { type: Number, default: 0 },
        stones: { type: Number, default: 0 }
    },
})

module.exports = { Profile: mongoose.model("Profile", Profile) }
