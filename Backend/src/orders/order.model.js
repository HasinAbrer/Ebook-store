const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        city: {
            type: String,
            required: true,
        },
        country: String,
        state: String,
        zipcode: String,
    },
    // Store phone numbers as strings to preserve formatting like leading zeros or + sign
    phone: {
        type: String,
        required: true,
    },
    productIds:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;