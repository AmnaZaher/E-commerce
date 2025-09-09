const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
    review: reviewSchema 
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
