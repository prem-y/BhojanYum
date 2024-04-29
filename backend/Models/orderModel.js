const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    foodId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt:{
        type: Date,
        default: new Date(),
    },
    status: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
