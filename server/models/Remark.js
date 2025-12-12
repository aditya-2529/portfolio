const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    companyName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Pending by default
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Remark', remarkSchema);