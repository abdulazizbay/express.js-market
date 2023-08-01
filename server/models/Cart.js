const mongoose = require("mongoose");


//////////////////////////////    
const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User is the model name for your User model
        required: true,
      },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Assuming Product is the model name for your Product model
            required: true,
          },
          qty: {
            type: Number,
            default: 0
          },
          bill: {
            type: Number,
            default:0
          },
        },
      ],
    });

module.exports = mongoose.model('Cart', CartSchema);
